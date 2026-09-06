import OpenAI from 'openai';
import Tesseract from 'tesseract.js';
import { Receipt, ApiResponse } from '../types';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { supabaseAdmin } from '../utils/storage';
import { AppError } from '../middleware/error-handler';
import { receiptUpdateSchema } from '../utils/validators';

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
});

const PRIMARY_MODEL = process.env.OPENAI_PRIMARY_MODEL || 'gpt-4o';
const FALLBACK_MODEL = process.env.OPENAI_FALLBACK_MODEL || 'gpt-4o-mini';

// ============================================================
// Prompts
// ============================================================

const RECEIPT_EXTRACTION_PROMPT = `
You are an expert receipt/invoice OCR extraction engine specializing in Indian retail and business receipts.

Extract ALL visible information from this receipt image and return a valid JSON object with this exact schema:

{
 "vendor": "Store/Business Name or null",
 "vendor_address": "Full address if visible or null",
 "vendor_gstin": "GSTIN if visible (format: 2 digits, 5 letters, 4 digits, 1 letter, 1-2 alphanumeric, Z, 1 alphanumeric) or null",
 "date": "YYYY-MM-DD or null",
 "invoice_number": "Invoice/Receipt number or null",
 "payment_method": "UPI/Cash/Card/Cheque/Other or null",
 "items": [
 {
 "name": "Item description",
 "hsn_sac": "HSN or SAC code if visible or null",
 "quantity": 1,
 "unit": "pcs/kg/ltr/etc",
 "rate": 100.00,
 "discount": 0,
 "amount": 100.00
 }
 ],
 "subtotal": 1000.00,
 "total_tax": 180.00,
 "total": 1180.00,
 "round_off": 0.00,
 "amount_paid": 1180.00,
 "cgst": [{"rate": 9, "amount": 90.00}],
 "sgst": [{"rate": 9, "amount": 90.00}],
 "igst": [{"rate": 0, "amount": 0.00}],
 "confidence_note": "Brief note about scan quality"
}

RULES:
- Always return valid JSON. Never include markdown or explanations outside the JSON.
- If a field is not visible, use null (for strings/numbers) or [] (for arrays).
- For Indian GST receipts, split tax into CGST/SGST (intra-state) or IGST (inter-state).
- CGST + SGST should sum to total_tax for intra-state. IGST is used for inter-state.
- Amounts: use numbers, not strings. E.g., 2450.50 not "₹2,450.50".
- Date format: always YYYY-MM-DD.
- If the receipt is heavily damaged or unreadable, return {"error": "unreadable", "raw_text": "..."}.
- Do not hallucinate data. If unsure, set to null.

IMPORTANT: This is a 100% accurate extraction task. Never guess or invent data.
`;

// ============================================================
// Helper: Convert extracted data to database format
// ============================================================

function mapExtractedData(
 extracted: Record<string, unknown>,
 receiptId: string,
 modelVersion: string
): Partial<Receipt> {
 const cgst = (extracted.cgst as Array<{ amount: number }>) || [];
 const sgst = (extracted.sgst as Array<{ amount: number }>) || [];
 const igst = (extracted.igst as Array<{ amount: number }>) || [];

 const cgstAmount = cgst.reduce((sum, item) => sum + item.amount, 0);
 const sgstAmount = sgst.reduce((sum, item) => sum + item.amount, 0);
 const igstAmount = igst.reduce((sum, item) => sum + item.amount, 0);

 const subTotal = (extracted.subtotal as number) || 0;
 const total = (extracted.total as number) || 0;

 // Calculate confidence from extracted data
 let confidence = 85; // Base confidence for OpenAI
 if (
 extracted.vendor &&
 extracted.date &&
 extracted.total &&
 (extracted.items as unknown[] | undefined)?.length > 0
 ) {
 confidence = 95;
 }
 if (extracted.confidence_note && extracted.confidence_note.includes('unreadable')) {
 confidence = 20;
 }

 return {
 vendor_name: (extracted.vendor as string) || undefined,
 vendor_address: (extracted.vendor_address as string) || undefined,
 vendor_gstin: (extracted.vendor_gstin as string) || undefined,
 invoice_number: (extracted.invoice_number as string) || undefined,
 invoice_date: (extracted.date as string) || undefined,
 line_items: (extracted.items as Record<string, unknown>[]) || [],
 sub_total: subTotal,
 cgst_amount: cgstAmount,
 sgst_amount: sgstAmount,
 igst_amount: igstAmount,
 total_amount: total,
 currency: 'INR',
 ai_confidence: confidence,
 ai_model_version: modelVersion,
 ai_raw_response: extracted,
 processing_status: 'completed' as const,
 review_status: confidence >= 85 ? 'approved' : 'pending_review',
 processed_at: new Date().toISOString(),
 };
}

// ============================================================
// Service Class
// ============================================================

export class ReceiptScannerService {
 // ============================================================
 // Scan with OpenAI GPT-4o Vision
 // ============================================================

 async scanWithOpenAI(
 imageBuffer: Buffer,
 mimeType: string
 ): Promise<{ extracted: Record<string, unknown>; confidence: number }> {
 const base64Image = imageBuffer.toString('base64');

 const response = await openai.chat.completions.create({
 model: PRIMARY_MODEL,
 messages: [
 {
 role: 'user',
 content: [
 { type: 'text', text: RECEIPT_EXTRACTION_PROMPT },
 {
 type: 'image_url',
 image_url: {
 url: `data:${mimeType};base64,${base64Image}`,
 detail: 'high',
 },
 },
 ],
 },
 ],
 response_format: { type: 'json_object' },
 temperature: 0.1,
 max_tokens: 2048,
 });

 const content = response.choices[0]?.message?.content;
 if (!content) {
 throw new Error('No response from OpenAI');
 }

 const extracted = JSON.parse(content);

 if (extracted.error === 'unreadable') {
 throw new Error('Receipt is unreadable');
 }

 const confidence = extracted.confidence_note && extracted.confidence_note.includes('unreadable')
 ? 20
 : 95;

 return { extracted, confidence };
 }

 // ============================================================
 // Fallback: Tesseract OCR + OpenAI text extraction
 // ============================================================

 async scanWithTesseract(
 imageBuffer: Buffer,
 mimeType: string
 ): Promise<{ extracted: Record<string, unknown>; confidence: number }> {
 // Step 1: OCR with Tesseract
 const result = await Tesseract.recognize(imageBuffer, 'eng', {
 logger: (m) => {
 if (m.status === 'recognizing text') {
 console.log(`[Tesseract] ${(m.progress * 100).toFixed(0)}%`);
 }
 },
 });

 const ocrText = result.data.text;
 const tesseractConfidence = result.data.confidence / 100;

 if (tesseractConfidence < 0.3) {
 throw new Error(`OCR confidence too low: ${tesseractConfidence}`);
 }

 // Step 2: Extract structured data from OCR text with GPT-4o-mini
 const extractionPrompt = `
Extract structured data from this OCR text of an Indian receipt/invoice.
Return JSON only:

${RECEIPT_EXTRACTION_PROMPT}

OCR Text:
---
${ocrText}
---

Return the JSON object.
`;

 const response = await openai.chat.completions.create({
 model: FALLBACK_MODEL,
 messages: [{ role: 'user', content: extractionPrompt }],
 response_format: { type: 'json_object' },
 temperature: 0.1,
 max_tokens: 2048,
 });

 const content = response.choices[0]?.message?.content;
 if (!content) {
 throw new Error('No response from OpenAI fallback');
 }

 const extracted = JSON.parse(content);

 return {
 extracted,
 confidence: Math.min(tesseractConfidence, 85) * 0.85,
 };
 }

 // ============================================================
 // Main scan method
 // ============================================================

 async scanReceipt(
 imageBuffer: Buffer,
 mimeType: string
 ): Promise<{
 extracted: Record<string, unknown>;
 method: 'openai' | 'tesseract';
 confidence: number;
 processingTimeMs: number;
 }> {
 const startTime = Date.now();

 try {
 // Primary: OpenAI GPT-4o Vision
 const result = await this.scanWithOpenAI(imageBuffer, mimeType);

 return {
 ...result,
 method: 'openai',
 processingTimeMs: Date.now() - startTime,
 };
 } catch (openaiError) {
 console.warn('[ReceiptScanner] OpenAI failed, falling back to Tesseract:', openaiError);

 // Fallback: Tesseract OCR + GPT-4o-mini
 try {
 const result = await this.scanWithTesseract(imageBuffer, mimeType);

 return {
 ...result,
 method: 'tesseract',
 processingTimeMs: Date.now() - startTime,
 };
 } catch (fallbackError) {
 throw new AppError(422, 'AI_PROCESSING_FAILED', `Receipt scanning failed: ${fallbackError.message}`);
 }
 }
 }

 // ============================================================
 // Process a receipt (main entry point)
 // ============================================================

 async processReceipt(
 receiptId: string,
 userId: string
 ): Promise<Receipt> {
 const startTime = Date.now();

 // Fetch receipt
 const { data: receipt, error } = await supabaseAdmin
 .from('receipts')
 .select('*')
 .eq('id', receiptId)
 .eq('user_id', userId)
 .single();

 if (error || !receipt) {
 throw new AppError(404, 'NOT_FOUND', 'Receipt not found');
 }

 // Update to processing
 await supabaseAdmin
 .from('receipts')
 .update({ processing_status: 'processing' })
 .eq('id', receiptId);

 try {
 // Download the image
 const { data: imageData, error: downloadError } = await supabaseAdmin.storage
 .from('receipts')
 .download(receipt.original_image_url);

 if (downloadError) {
 throw new Error(`Failed to download image: ${downloadError.message}`);
 }

 const imageBuffer = Buffer.from(await imageData.arrayBuffer());
 const mimeType = receipt.mime_type || 'image/jpeg';

 // Scan
 const scanResult = await this.scanReceipt(imageBuffer, mimeType);

 // Map to DB format
 const updates = mapExtractedData(scanResult.extracted, receiptId, PRIMARY_MODEL);

 // Save AI job metadata
 const promptTokens = Math.ceil(imageBuffer.length / 4);
 const completionTokens = Math.ceil(JSON.stringify(scanResult.extracted).length / 4);

 const { error: updateError } = await supabaseAdmin
 .from('receipts')
 .update({
 ...updates,
 updated_at: new Date().toISOString(),
 })
 .eq('id', receiptId);

 if (updateError) {
 throw new Error(`Failed to update receipt: ${updateError.message}`);
 }

 return { ...receipt, ...updates } as Receipt;
 } catch (error) {
 // Mark as failed
 await supabaseAdmin
 .from('receipts')
 .update({
 processing_status: 'failed',
 processing_error: error instanceof Error ? error.message : 'Unknown error',
 updated_at: new Date().toISOString(),
 })
 .eq('id', receiptId);

 throw error;
 }
 }
}

// ============================================================
// Routes
// ============================================================

export async function handleReceiptUpload(
 req: any,
 res: Response<ApiResponse>
): Promise<Response<ApiResponse> | void> {
 try {
 const userId = req.user?.id;
 if (!userId) {
 return errorResponse(res, 'AUTH_REQUIRED', 'Authentication required', 401);
 }

 const receiptData = req.body;

 const { data: receipt, error } = await supabaseAdmin
 .from('receipts')
 .insert({
 user_id: userId,
 business_id: receiptData.business_id,
 original_image_url: receiptData.original_image_url,
 original_filename: receiptData.original_filename,
 file_size_bytes: receiptData.file_size_bytes,
 mime_type: receiptData.mime_type || 'image/jpeg',
 processing_status: 'pending',
 review_status: 'auto',
 tags: Array.isArray(receiptData.tags) ? receiptData.tags : [],
 })
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 // Queue AI processing job (in background)
 process.nextTick(() => {
 const service = new ReceiptScannerService();
 service.processReceipt(receipt.id, userId).catch((err) => {
 console.error('[ReceiptScanner] Background processing failed:', err);
 });
 });

 return successResponse(res, {
 id: receipt.id,
 status: 'processing',
 message: 'Receipt queued for AI scanning. Check status at GET /receipts/{id}',
 }, 201);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Upload failed', 500);
 }
}

export async function handleGetReceipt(
 req: any,
 res: Response<ApiResponse>
): Promise<Response<ApiResponse> | void> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data: receipt, error } = await supabaseAdmin
 .from('receipts')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (error || !receipt) {
 return errorResponse(res, 'NOT_FOUND', 'Receipt not found', 404);
 }

 return successResponse(res, receipt);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch receipt', 500);
 }
}

export async function handleListReceipts(
 req: any,
 res: Response<ApiResponse>
): Promise<Response<ApiResponse> | void> {
 try {
 const userId = req.user?.id;
 const {
 page = '1',
 limit = '20',
 business_id,
 from,
 to,
 category,
 vendor,
 status,
 min_amount,
 max_amount,
 tags,
 sort = 'created_at',
 order = 'desc',
 } = req.query;

 const pageNum = parseInt(page as string, 10);
 const limitNum = Math.min(parseInt(limit as string, 10), 100);

 let query = supabaseAdmin
 .from('receipts')
 .select('*', { count: 'exact' })
 .eq('user_id', userId as string)
 .order(sort as string, { ascending: order === 'asc' });

 if (business_id) query = query.eq('business_id', business_id as string);
 if (from) query = query.gte('invoice_date', from as string);
 if (to) query = query.lte('invoice_date', to as string);
 if (category) query = query.eq('category_id', category as string);
 if (vendor) query = query.ilike('vendor_name', `%${vendor}%`);
 if (status) query = query.eq('processing_status', status as string);
 if (min_amount) query = query.gte('total_amount', parseFloat(min_amount as string));
 if (max_amount) query = query.lte('total_amount', parseFloat(max_amount as string));

 const fromIdx = (pageNum - 1) * limitNum;
 const toIdx = fromIdx + limitNum - 1;

 const { data, error, count } = await query.range(fromIdx, toIdx);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return paginatedResponse(res, data || [], count || 0, pageNum, limitNum);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to list receipts', 500);
 }
}

export async function handleUpdateReceipt(
 req: any,
 res: Response<ApiResponse>
): Promise<Response<ApiResponse> | void> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 // Validate input
 const validated = receiptUpdateSchema.parse(req.body);

 // Check if receipt exists and belongs to user
 const { data: existing, error: fetchError } = await supabaseAdmin
 .from('receipts')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (fetchError || !existing) {
 return errorResponse(res, 'NOT_FOUND', 'Receipt not found', 404);
 }

 const { data: receipt, error } = await supabaseAdmin
 .from('receipts')
 .update({
 ...validated,
 updated_at: new Date().toISOString(),
 })
 .eq('id', id)
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, receipt);
 } catch (error) {
 if (error instanceof z.ZodError) {
 return errorResponse(res, 'VALIDATION_ERROR', 'Invalid request body', 422, error.flatten().fieldErrors);
 }
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Update failed', 500);
 }
}

export async function handleDeleteReceipt(
 req: any,
 res: Response<ApiResponse>
): Promise<Response<ApiResponse> | void> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { error } = await supabaseAdmin
 .from('receipts')
 .delete()
 .eq('id', id)
 .eq('user_id', userId);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, { message: 'Receipt deleted successfully' });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Delete failed', 500);
 }
}

export async function handleRescanReceipt(
 req: any,
 res: Response<ApiResponse>
): Promise<Response<ApiResponse> | void> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 // Check receipt exists
 const { data: receipt, error } = await supabaseAdmin
 .from('receipts')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (error || !receipt) {
 return errorResponse(res, 'NOT_FOUND', 'Receipt not found', 404);
 }

 // Update to processing
 await supabaseAdmin
 .from('receipts')
 .update({ processing_status: 'processing', updated_at: new Date().toISOString() })
 .eq('id', id);

 // Re-process in background
 process.nextTick(() => {
 const service = new ReceiptScannerService();
 service.processReceipt(id, userId).catch((err) => {
 console.error('[ReceiptScanner] Re-scan failed:', err);
 });
 });

 return successResponse(res, {
 id,
 status: 'processing',
 message: 'Receipt queued for re-scanning',
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Rescan failed', 500);
 }
}
