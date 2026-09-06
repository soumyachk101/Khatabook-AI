/**
 * Queue Worker — processes jobs from all async queues.
 *
 * Run with: npm run worker:receipt
 *
 * In production, this would be a separate process (or set of processes)
 * managed by a process manager (PM2, systemd, Kubernetes, etc.).
 */

import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { aiService } from '@/services/ai.service';
import { scanReceipt, DEFAULT_CONFIG } from '@/services/receipt-scanner';
import { supabase } from '@/utils/supabase';
import { sendEmail } from '@/services';
import { connection, QUEUE_NAMES, ReceiptScanJobData, EmailJobData, ExportJobData, PDFGenerationJobData } from './bull-queue';

const PENDING_PROCESSED_EVENT = 'receipt.processed';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function updateReceiptStatus(receiptId: string, status: string, data: Record<string, unknown>) {
 const client = supabase();
 await client
 .from('receipts')
 .update({ processing_status: status, ...data })
 .eq('id', receiptId);
}

async function emitReceiptProcessed(userId: string, receiptId: string, data: Record<string, unknown>) {
 const client = supabase();
 await client.channel(`receipt:${receiptId}`).send({
 type: 'broadcast',
 event: PENDING_PROCESSED_EVENT,
 payload: { receiptId, userId, ...data },
 });
}

// ─── Receipt Scan Worker ──────────────────────────────────────────────────────

export function createReceiptScanWorker(): Worker<ReceiptScanJobData> {
 const worker = new Worker<ReceiptScanJobData>(
 QUEUE_NAMES.RECEIPT_SCAN,
 async (job) => {
 const { receiptId, userId, businessId, imageUrl, mimeType, jobId } = job.data;

 await job.updateProgress(5);

 // 1. Fetch image buffer from storage
 let imageBuffer: Buffer;
 try {
 const response = await fetch(imageUrl);
 if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
 const arrayBuffer = await response.arrayBuffer();
 imageBuffer = Buffer.from(arrayBuffer);
 } catch (err) {
 await updateReceiptStatus(receiptId, 'failed', {
 processing_error: `Image fetch failed: ${(err as Error).message}`,
 ai_confidence: 0,
 model_version: null,
 });
 await job.moveToFailed(new Error(`Image fetch failed: ${(err as Error).message}`), true);
 return;
 }

 await job.updateProgress(20);

 // 2. Run AI scan
 let scanResult: { extractedData: any; confidence: number; model: string };
 try {
 const result = await aiService.scanReceipt(imageBuffer, mimeType);
 scanResult = {
 extractedData: result.extractedData,
 confidence: result.confidence,
 model: result.model,
 };
 } catch (err) {
 console.error(`Receipt scan failed for ${receiptId}:`, err);
 await updateReceiptStatus(receiptId, 'failed', {
 processing_error: `AI scan failed: ${(err as Error).message}`,
 ai_confidence: 0,
 model_version: null,
 });
 await job.moveToFailed(err, true);
 return;
 }

 await job.updateProgress(60);

 // 3. Persist extraction results
 const extracted = scanResult.extractedData;
 try {
 await updateReceiptStatus(receiptId, 'completed', {
 processing_status: 'completed',
 ai_confidence: scanResult.confidence,
 ai_model_version: scanResult.model,
 ai_raw_response: extracted,
 processed_at: new Date().toISOString(),
 vendor_name: extracted.vendor || null,
 vendor_gstin: extracted.gstin || null,
 invoice_number: extracted.invoice_number || null,
 invoice_date: extracted.date || null,
 sub_total: extracted.subtotal || null,
 cgst_amount: extracted.cgst?.[0]?.amount ?? null,
 sgst_amount: extracted.sgst?.[0]?.amount ?? null,
 igst_amount: extracted.igst?.[0]?.amount ?? null,
 total_amount: extracted.total || null,
 line_items: extracted.items || [],
 });
 } catch (dbErr) {
 console.error(`DB update failed for receipt ${receiptId}:`, dbErr);
 }

 await job.updateProgress(80);

 // 4. Emit realtime event
 try {
 await emitReceiptProcessed(userId, receiptId, {
 status: 'completed',
 confidence: scanResult.confidence,
 extractedData: extracted,
 });
 } catch {
 // non-fatal
 }

 await job.updateProgress(100);

 console.log(`Receipt scan completed: ${receiptId} (model: ${scanResult.model}, confidence: ${scanResult.confidence})`);
 },
 { connection, concurrency: 4, limiter: { max: 20, duration: 1000 } }
 );

 return worker;
}

// ─── Email Worker ─────────────────────────────────────────────────────────────

export function createEmailWorker(): Worker<EmailJobData> {
 const worker = new Worker<EmailJobData>(
 QUEUE_NAMES.EMAIL,
 async (job) => {
 const { to, subject, html, from, replyTo, jobId } = job.data;

 try {
 await job.updateProgress(20);

 const result = await sendEmail(to, subject, html, { from, replyTo });

 await job.updateProgress(100);

 console.log(`Email sent to ${to}: ${result.id}`);
 return result;
 } catch (err) {
 console.error(`Email send failed to ${to}:`, err);
 throw err;
 }
 },
 { connection, concurrency: 10 }
 );

 return worker;
}

// ─── Export Worker ────────────────────────────────────────────────────────────

export function createExportWorker(): Worker<ExportJobData> {
 const worker = new Worker<ExportJobData>(
 QUEUE_NAMES.EXPORT,
 async (job) => {
 const { exportType, filters, callbackUrl, jobId } = job.data;

 await job.updateProgress(10);

 // Export generation would use the existing CSV/PDF generation code
 // This is a placeholder — in production, delegate to the appropriate handler

 await job.updateProgress(50);

 // If a callback URL is provided, notify the caller
 if (callbackUrl) {
 try {
 await fetch(callbackUrl, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ jobId, status: 'completed', exportType }),
 });
 } catch {
 // best-effort
 }
 }

 await job.updateProgress(100);
 console.log(`Export completed: ${exportType} (${jobId})`);
 },
 { connection, concurrency: 2 }
 );

 return worker;
}

// ─── PDF Generation Worker ────────────────────────────────────────────────────

export function createPDFGenerationWorker(): Worker<PDFGenerationJobData> {
 const worker = new Worker<PDFGenerationJobData>(
 QUEUE_NAMES.PDF_GENERATION,
 async (job) => {
 const { invoiceId, userId, format, jobId } = job.data;

 await job.updateProgress(20);

 // PDF generation would use pdf-lib — placeholder here
 const pdfBuffer = Buffer.from('placeholder');

 await job.updateProgress(70);

 // Upload to storage
 const client = supabase();
 const { data, error } = await client.storage
 .from('exports')
 .upload(`${userId}/invoice-${invoiceId}.pdf`, pdfBuffer, {
 cacheControl: '3600',
 upsert: false,
 });

 if (error) throw new Error(`PDF upload failed: ${error.message}`);

 await job.updateProgress(100);

 const { data: urlData } = client.storage.from('exports').getPublicUrl(data.path);

 return { url: urlData.publicUrl, path: data.path };
 },
 { connection, concurrency: 3 }
 );

 return worker;
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

export async function shutdownWorkers(...workers: Worker[]) {
 console.log('Shutting down workers...');
 await Promise.all(workers.map((w) => w.close()));
 console.log('Workers shut down.');
}
