# Khatabook AI — Backend Architecture

> **Runtime:** Node.js 20+ / Bun (recommended for performance) + Express or Fastify
> **Database:** Supabase (PostgreSQL 15+)
> **Cache:** Redis (Upstash or self-hosted)
> **Queue:** Supabase Edge Functions + PostgreSQL-based job queue (BullMQ on Redis)
> **AI:** OpenAI GPT-4o (primary) + Tesseract.js (fallback) + custom fine-tuned model
> **Storage:** Supabase Storage (S3-compatible)
> **Hosting:** Vercel (Edge Functions) + Supabase (Postgres, Storage, Auth)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Service Layer Design](#service-layer-design)
3. [AI Service Architecture](#ai-service-architecture)
4. [File Upload Pipeline](#file-upload-pipeline)
5. [Webhook Handlers](#webhook-handlers)
6. [Queue System](#queue-system)
7. [Caching Strategy](#caching-strategy)
8. [Rate Limiting](#rate-limiting)
9. [Deployment Architecture](#deployment-architecture)

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT LAYER │
│ Mobile App (Flutter) / Web App (Next.js) / PWA │
└────────────────────────────┬────────────────────────────────────┘
 │ HTTPS
 ▼
┌─────────────────────────────────────────────────────────────────┐
│ API GATEWAY / EDGE │
│ Vercel Edge Middleware (Auth, Rate Limit, CORS) │
└────────────────────────────┬────────────────────────────────────┘
 │
 ┌──────────────┼──────────────┐
 ▼ ▼ ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│ API Routes │ │ Edge Funcs │ │ Webhook Handlers │
│ (REST Endpoints) │ │ (AI, Jobs) │ │ (Razorpay, WA) │
│ Supabase Client │ │ PostgreSQL │ │ Queue Consumer │
└────────┬─────────┘ └──────┬───────┘ └────────┬─────────┘
 │ │ │
 └───────────────┬───┴────────────────────┘
 ▼
 ┌──────────────────────────────────────┐
 │ SERVICE LAYER │
 │ receiptService, invoiceService, │
 │ expenseService, paymentService, │
 │ gstService, aiService, pdfService │
 └──────────────────┬───────────────────┘
 │
 ┌────────────────┼────────────────┐
 ▼ ▼ ▼
┌──────────────┐ ┌───────────────┐ ┌───────────────┐
│ Supabase │ │ Redis │ │ External APIs │
│ Postgres │ │ (Cache + Queue)│ │ OpenAI, │
│ Storage │ │ │ │ Razorpay, │
│ Auth │ │ │ │ WhatsApp │
└──────────────┘ └───────────────┘ └───────────────┘
```

---

## Service Layer Design

### Directory Structure

```
src/
├── routes/ # Express/Fastify route handlers (thin)
│ ├── auth.routes.ts
│ ├── receipts.routes.ts
│ ├── invoices.routes.ts
│ ├── expenses.routes.ts
│ ├── payments.routes.ts
│ ├── dashboard.routes.ts
│ ├── gst.routes.ts
│ ├── ai.routes.ts
│ ├── export.routes.ts
│ └── webhooks.routes.ts
│
├── services/ # Business logic (thick)
│ ├── receipt.service.ts
│ ├── invoice.service.ts
│ ├── expense.service.ts
│ ├── payment.service.ts
│ ├── gst.service.ts
│ ├── ai.service.ts
│ ├── pdf.service.ts
│ ├── notification.service.ts
│ ├── export.service.ts
│ └── user.service.ts
│
├── ai/ # AI/ML logic
│ ├── scanner/
│ │ ├── openai-scanner.ts
│ │ ├── tesseract-scanner.ts
│ │ ├── hybrid-scanner.ts
│ │ └── prompt-engine.ts
│ ├── categorizer/
│ │ ├── classifier.ts
│ │ └── embeddings.ts
│ └── gst-extractor/
│ └── extractor.ts
│
├── workers/ # Queue workers (separate process)
│ ├── receipt-scanner.worker.ts
│ ├── invoice-pdf.worker.ts
│ ├── email-sender.worker.ts
│ ├── whatsapp-sender.worker.ts
│ └── export-generator.worker.ts
│
├── jobs/ # Job definitions
│ ├── scan-receipt.job.ts
│ ├── generate-pdf.job.ts
│ ├── send-reminder.job.ts
│ └── generate-export.job.ts
│
├── middleware/
│ ├── auth.middleware.ts
│ ├── rate-limit.middleware.ts
│ ├── validation.middleware.ts
│ └── error-handler.middleware.ts
│
├── utils/
│ ├── supabase.ts
│ ├── redis.ts
│ ├── queue.ts
│ ├── logger.ts
│ ├── validators.ts
│ └── helpers.ts
│
├── types/
│ ├── receipt.ts
│ ├── invoice.ts
│ ├── gst.ts
│ └── ai.ts
│
├── config/
│ ├── database.ts
│ ├── ai.ts
│ └── app.ts
│
└── index.ts # Entry point
```

### Service Pattern

Each service follows a consistent pattern:

```typescript
// services/receipt.service.ts

export class ReceiptService {
 constructor(
 private supabase: SupabaseClient,
 private redis: Redis,
 private aiService: AIService,
 private queue: QueueService,
 private pdfService: PDFService,
 ) {}

 /**
 * Upload and scan a receipt
 */
 async uploadReceipt(
 userId: string,
 file: Buffer,
 fileName: string,
 options: UploadReceiptOptions
 ): Promise<Receipt> {
 // 1. Validate file
 this.validateFile(file, fileName);

 // 2. Upload to Supabase Storage
 const { url, path } = await this.uploadToStorage(userId, file, fileName);

 // 3. Create receipt record (status: pending)
 const receipt = await this.createReceiptRecord(userId, options, url);

 // 4. Queue AI scanning job
 await this.queue.add('scan-receipt', {
 receiptId: receipt.id,
 userId,
 businessId: options.business_id,
 imagePath: path,
 autoCategorize: options.auto_categorize,
 }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });

 return receipt;
 }

 /**
 * Get receipt by ID (with RLS check)
 */
 async getReceipt(userId: string, receiptId: string): Promise<Receipt> {
 const { data, error } = await this.supabase
 .from('receipts')
 .select('*')
 .eq('id', receiptId)
 .eq('user_id', userId)
 .single();

 if (error) throw new NotFoundError('Receipt not found');
 return data;
 }

 /**
 * List receipts with filters
 */
 async listReceipts(userId: string, filters: ReceiptFilters): Promise<PaginatedResult<Receipt>> {
 let query = this.supabase
 .from('receipts')
 .select('*', { count: 'exact' })
 .eq('user_id', userId)
 .order(filters.sort || 'date', { ascending: filters.order === 'asc' });

 // Apply filters
 if (filters.business_id) query = query.eq('business_id', filters.business_id);
 if (filters.from) query = query.gte('date', filters.from);
 if (filters.to) query = query.lte('date', filters.to);
 if (filters.category) query = query.eq('category', filters.category);
 if (filters.status) query = query.eq('ai_processing_status', filters.status);
 if (filters.search) query = query.ilike('vendor', `%${filters.search}%`);

 // Pagination
 const page = filters.page || 1;
 const limit = Math.min(filters.limit || 20, 100);
 const from = (page - 1) * limit;
 const to = from + limit - 1;

 const { data, error, count } = await query.range(from, to);

 if (error) throw new DatabaseError(error.message);

 return {
 items: data || [],
 pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) }
 };
 }
}
```

---

## AI Service Architecture

### Hybrid Scanner: OpenAI + Tesseract Fallback

```typescript
// ai/scanner/hybrid-scanner.ts

interface ScanResult {
 extractedData: ExtractedData;
 confidence: number;
 method: 'openai' | 'tesseract';
 processingTimeMs: number;
}

export class HybridReceiptScanner {
 constructor(
 private openai: OpenAI,
 private tesseract: TesseractService,
 ) {}

 async scan(imageBuffer: Buffer, language: string = 'en'): Promise<ScanResult> {
 const startTime = Date.now();

 try {
 // Primary: OpenAI GPT-4o Vision
 const result = await this.scanWithOpenAI(imageBuffer);
 return {
 ...result,
 confidence: result.confidence,
 method: 'openai',
 processingTimeMs: Date.now() - startTime,
 };
 } catch (openaiError) {
 console.warn('OpenAI scan failed, falling back to Tesseract:', openaiError);

 // Fallback: Tesseract OCR + GPT-4o text extraction
 const tesseractResult = await this.scanWithTesseract(imageBuffer);
 const textResult = await this.extractWithOpenAI(tesseractResult.text);

 return {
 ...textResult,
 confidence: Math.min(tesseractResult.confidence, textResult.confidence) * 0.85, // penalize fallback
 method: 'tesseract',
 processingTimeMs: Date.now() - startTime,
 };
 }
 }

 private async scanWithOpenAI(imageBuffer: Buffer): Promise<ExtractedData> {
 // Convert image to base64
 const base64Image = imageBuffer.toString('base64');
 const mimeType = this.detectMimeType(imageBuffer);

 const response = await this.openai.chat.completions.create({
 model: 'gpt-4o',
 messages: [
 {
 role: 'user',
 content: [
 {
 type: 'text',
 text: RECEIPT_EXTRACTION_PROMPT, // Defined in prompt-engine.ts
 },
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
 temperature: 0.1, // Low for consistency
 max_tokens: 2048,
 });

 const content = response.choices[0]?.message?.content;
 if (!content) throw new Error('No response from OpenAI');

 const extracted = JSON.parse(content);
 extracted.confidence = this.calculateConfidence(extracted);

 return extracted;
 }
}
```

### Prompt Engineering

```typescript
// ai/scanner/prompt-engine.ts

export const RECEIPT_EXTRACTION_PROMPT = `
You are an expert receipt/invoice OCR extraction engine specializing in Indian retail and business receipts.

Extract ALL visible information from this receipt image and return a valid JSON object with this exact schema:

{
 "vendor": "Store/Business Name",
 "vendor_address": "Full address if visible",
 "gstin": "GSTIN if visible, else null",
 "date": "YYYY-MM-DD",
 "time": "HH:MM:SS or null",
 "invoice_number": "Invoice/Receipt number or null",
 "payment_method": "UPI/Cash/Card/Cheque/Other or null",
 "items": [
 {
 "name": "Item description",
 "hsn_sac": "HSN or SAC code if visible",
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
 "change": 0.00,
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

export const INVOICE_ITEM_SUGGESTION_PROMPT = (description: string) => `
Given this service description from an Indian freelancer/business: "${description}"

Suggest appropriate HSN/SAC codes, suggested rates, and GST rates from this knowledge base:
- Web Development: HSN 998314, Rate: ₹500-2000/hr, GST 18% (9% CGST + 9% SGST for Maharashtra)
- Graphic Design: HSN 998382, Rate: ₹1000-5000/project, GST 18%
- Content Writing: HSN 998399, Rate: ₹0.50-2/word or ₹500-2000/article, GST 18%
- Digital Marketing: HSN 998399, Rate: ₹5000-50000/month, GST 18%
- Accounting/Bookkeeping: HSN 998260, Rate: ₹1000-5000/month, GST 18%
- Legal Consulting: HSN 998261, Rate: ₹500-3000/hour, GST 18%
- Tuition/Coaching: SAC 999293, Rate: ₹500-3000/hr, GST 18% (exempt for some)
- Photography: HSN 998722, Rate: ₹5000-50000/event, GST 18%

Return JSON:
{
 "suggestions": [
 {
 "description": "Suggested line item description",
 "hsn_sac": "HSN/SAC code",
 "suggested_rate": 5000,
 "suggested_unit": "project",
 "cgst_rate": 9,
 "sgst_rate": 9,
 "igst_rate": 0
 }
 ]
}
`;
```

### Categorizer

```typescript
// ai/categorizer/classifier.ts

export class ExpenseCategorizer {
 constructor(
 private openai: OpenAI,
 private embeddingCache: Redis, // Cache embeddings
 ) {}

 private readonly CATEGORY_HIERARCHY: Record<string, string[]> = {
 'Sales / Revenue': ['Invoice', 'Payment received', 'Client payment'],
 'Professional Fees': ['Consulting', 'Advisory', 'Contract work'],
 'Travel': ['Flight', 'Train', 'Bus', 'Taxi', 'Metro', 'Fuel', 'Parking'],
 'Food': ['Restaurant', 'Café', 'Groceries', 'Swiggy', 'Zomato'],
 'Office Supplies': ['Stationery', 'Printer', 'Paper', 'Ink'],
 'Software': ['SaaS', 'Subscription', 'Hosting', 'Domain', 'API'],
 'Utilities': ['Electricity', 'Internet', 'Phone', 'Water'],
 'Equipment': ['Laptop', 'Monitor', 'Chair', 'Desk'],
 'Marketing': ['Ads', 'Social media', 'SEO', 'Business cards'],
 };

 async categorize(receipt: Receipt): Promise<CategorizationResult> {
 const key = `cat:embed:${receipt.vendor?.toLowerCase()}`;

 // Check cache first
 const cached = await this.embeddingCache.get(key);
 if (cached) return JSON.parse(cached);

 // Use OpenAI for categorization
 const response = await this.openai.chat.completions.create({
 model: 'gpt-4o-mini', // Cheaper for classification
 messages: [
 {
 role: 'system',
 content: `You are a receipt categorizer for Indian freelancers and small businesses.
Categorize receipts into one of these categories: ${Object.keys(this.CATEGORY_HIERARCHY).join(', ')}.
Return: {"category": "...", "confidence": 0.0-1.0, "alternatives": [...]}`,
 },
 {
 role: 'user',
 content: JSON.stringify({
 vendor: receipt.vendor,
 raw_text: receipt.raw_text?.slice(0, 500),
 amount: receipt.amount,
 items: receipt.extracted_data?.items?.slice(0, 5),
 }),
 },
 ],
 response_format: { type: 'json_object' },
 temperature: 0,
 });

 const result = JSON.parse(response.choices[0].message!.content);

 // Cache for 24 hours
 await this.embeddingCache.setex(key, 86400, JSON.stringify(result));

 return result;
 }
}
```

---

## File Upload Pipeline

### Flow Diagram

```
Client
 │
 │ 1. POST /receipts/upload (multipart/form-data)
 │ image=@receipt.jpg, business_id=uuid
 │
 ▼
Edge Middleware
 │
 │ - Auth check
 │ - Rate limit check
 │ - File validation (size ≤ 10MB, type: jpeg/png/heic/webp/pdf)
 │
 ▼
API Route: receipts.upload()
 │
 │ 2. Generate storage path: {userId}/{timestamp}-{random}.jpg
 │ 3. Upload to Supabase Storage (bucket: receipts)
 │ - ACL: private, service-role only
 │ - Generate signed URL (expires: 7 days)
 │
 ▼
Service: ReceiptService.uploadReceipt()
 │
 │ 4. Insert receipt row (status: pending)
 │ 5. Enqueue job: { receiptId, imagePath, userId, businessId }
 │
 ▼
Queue: BullMQ + Redis
 │
 │ 6. Worker picks up job
 │
 ▼
Worker: ReceiptScannerWorker
 │
 │ 7. Download image from Storage
 │ 8. AIService.scan(imageBuffer) → OpenAI or Tesseract fallback
 │ 9. Update receipt row with extracted_data, gst_details, category, amount
 │ 10. If auto_categorize: call Categorizer.categorize()
 │ 11. Update receipt (status: completed)
 │ 12. Fire webhook: file-processed (internal)
 │
 ▼
Post-Processing
 │
 │ 13. If category = new → create in categories table
 │ 14. If similar invoice exists → suggest linking
 │ 15. Invalidate cache: dashboard stats
 │
 ▼
Client receives:
 │ - Initial: { id, status: "processing" }
 │ - WebSocket push: { id, status: "completed", data: {...} }
 │ - Or poll: GET /receipts/{id}
```

### Code Implementation

```typescript
// workers/receipt-scanner.worker.ts

import { Worker } from 'bullmq';
import { ReceiptService } from '../services/receipt.service';
import { AIService } from '../services/ai.service';
import { NotificationService } from '../services/notification.service';

const receiptWorker = new Worker(
 'scan-receipt',
 async (job) => {
 const { receiptId, userId, businessId, imagePath } = job.data;
 const receiptService = new ReceiptService(/* deps */);
 const aiService = new AIService(/* deps */);
 const notificationService = new NotificationService(/* deps */);

 try {
 // Update status
 await receiptService.updateStatus(receiptId, 'processing');
 await job.updateProgress(10);

 // Download image
 const { data: imageBlob, error } = await supabase.storage
 .from('receipts')
 .download(imagePath);

 if (error) throw new Error(`Download failed: ${error.message}`);

 const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());

 // AI Scan
 await job.updateProgress(30);
 const scanResult = await aiService.scan(imageBuffer);

 await job.updateProgress(70);

 // Update receipt with extracted data
 await receiptService.update(receiptId, {
 ai_processing_status: 'completed',
 raw_text: scanResult.rawText,
 extracted_data: scanResult.extractedData,
 gst_details: scanResult.gstDetails,
 vendor: scanResult.extractedData.vendor,
 date: scanResult.extractedData.date,
 amount: scanResult.extractedData.total,
 category: scanResult.extractedData.category,
 ai_confidence_score: scanResult.confidence,
 reviewed: scanResult.confidence >= 90, // Auto-approve high confidence
 });

 // Post-processing
 if (scanResult.extractedData.category) {
 await receiptService.suggestCategory(receiptId, scanResult.extractedData.category);
 }

 // Invalidate dashboard cache
 await redis.del(`dashboard:summary:${userId}:${businessId}`);

 // Notify user via WebSocket or push notification
 await notificationService.sendScanComplete(userId, receiptId, scanResult);

 await job.updateProgress(100);
 return { success: true, receiptId };
 } catch (error) {
 await receiptService.update(receiptId, {
 ai_processing_status: 'failed',
 ai_processing_error: error.message,
 });

 throw error; // BullMQ will retry based on config
 }
 },
 {
 connection: { host: redisHost, port: redisPort },
 concurrency: 5, // Process 5 scans in parallel
 removeOnComplete: { count: 100 },
 removeOnFail: { count: 50 },
 }
);
```

### File Validation

```typescript
// utils/validators.ts

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary'; // or SupabaseStorage

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];

export const uploadMiddleware = multer({
 storage: new SupabaseStorage({
 client: supabase,
 bucket: 'receipts',
 path: (req) => `${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}`,
 }),
 limits: { fileSize: MAX_FILE_SIZE },
 fileFilter: (req, file, cb) => {
 if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
 cb(null, true);
 } else {
 cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`));
 }
 },
}).single('image');
```

---

## Webhook Handlers

### Razorpay Webhook

```typescript
// routes/webhooks/razorpay.ts

import express from 'express';
import crypto from 'crypto';
import { PaymentService } from '../services/payment.service';

const router = express.Router();

router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
 const signature = req.headers['x-razorpay-signature'] as string;
 const body = req.body.toString();

 // Verify signature
 const expectedSignature = crypto
 .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
 .update(body)
 .digest('hex');

 if (signature !== expectedSignature) {
 console.warn('Invalid Razorpay webhook signature');
 return res.status(400).json({ error: 'Invalid signature' });
 }

 const event = JSON.parse(body);
 const paymentService = new PaymentService(/* deps */);

 switch (event.event) {
 case 'payment.captured': {
 const payment = await paymentService.processCapturedPayment(event.payload.payment.entity);
 await notificationService.sendPaymentReceived(payment.invoice.user_id, payment);
 break;
 }
 case 'payment.failed': {
 await paymentService.markFailed(event.payload.payment.entity.id);
 break;
 }
 case 'refund.processed': {
 await paymentService.markRefunded(event.payload.refund.entity);
 break;
 }
 default:
 console.log(`Unhandled Razorpay event: ${event.event}`);
 }

 res.status(200).json({ received: true });
});
```

### WhatsApp Webhook (Twilio)

```typescript
// routes/webhooks/whatsapp.ts

router.post('/whatsapp', express.urlencoded({ extended: true }), async (req, res) => {
 const { From, Body, MessageSid } = req.body;

 // Handle incoming WhatsApp messages
 // - Payment confirmations: "Paid 5000 for invoice INV-001"
 // - Queries: "What is my balance?"
 // - Commands: "HELP", "STATUS"

 const user = await findUserByPhone(From.replace('whatsapp:', ''));
 if (!user) {
 return res.status(404).send('User not found');
 }

 const response = await whatsAppBot.processMessage(user.id, Body);
 res.type('text/xml').send(`<Response><Message>${response}</Message></Response>`);
});
```

---

## Queue System

### Job Definitions

```typescript
// jobs/scan-receipt.job.ts

import { Job } from 'bullmq';

export interface ScanReceiptJobData {
 receiptId: string;
 userId: string;
 businessId?: string;
 imagePath: string;
 autoCategorize: boolean;
 retryCount?: number;
}

export const scanReceiptJob: Job<ScanReceiptJobData> = {
 name: 'scan-receipt',
 defaultOptions: {
 attempts: 3,
 backoff: {
 type: 'exponential',
 delay: 2000,
 },
 removeOnComplete: { count: 100 },
 removeOnFail: { count: 50 },
 },
};

// Other jobs follow the same pattern
```

### Queue Configuration

```typescript
// utils/queue.ts

import { Queue } from 'bullmq';
import { redis } from './redis';

export const queues = {
 scanReceipt: new Queue('scan-receipt', { connection: redis }),
 generatePdf: new Queue('generate-pdf', { connection: redis }),
 sendEmail: new Queue('send-email', { connection: redis }),
 sendWhatsApp: new Queue('send-whatsapp', { connection: redis }),
 generateExport: new Queue('generate-export', { connection: redis }),
} as const;

// Helper to add jobs with retry logic
export async function enqueueScanReceipt(data: ScanReceiptJobData) {
 await queues.scanReceipt.add(
 'scan-receipt',
 data,
 {
 jobId: `scan-${data.receiptId}`, // Prevent duplicate jobs
 ...scanReceiptJob.defaultOptions,
 }
 );
}
```

### Queue Dashboard (Bull Board)

```typescript
// routes/admin/queues.ts (admin only)

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
 queues: [
 new BullMQAdapter(queues.scanReceipt),
 new BullMQAdapter(queues.generatePdf),
 ],
 serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
```

---

## Caching Strategy

### Redis Key Patterns

```typescript
// utils/cache.ts

export const CACHE_KEYS = {
 DASHBOARD_SUMMARY: (userId: string, businessId: string) =>
 `dashboard:summary:${userId}:${businessId}`,

 DASHBOARD_MONTHLY: (userId: string, from: string, to: string) =>
 `dashboard:monthly:${userId}:${from}:${to}`,

 CATEGORY_BREAKDOWN: (userId: string, type: string, from: string, to: string) =>
 `dashboard:categories:${userId}:${type}:${from}:${to}`,

 INVOICE_COUNTER: (businessId: string, series: string) =>
 `invoice:counter:${businessId}:${series}`,

 USER_PLAN: (userId: string) => `user:plan:${userId}`,

 CATEGORIES: (userId: string) => `categories:${userId}`,

 // TTL-based (no explicit invalidation needed)
 AI_CATEGORIZATION: (vendorHash: string) => `ai:cat:${vendorHash}`, // 24h TTL
} as const;
```

### Cache Invalidation

```typescript
// services/cache-invalidation.service.ts

export class CacheInvalidationService {
 constructor(private redis: Redis) {}

 async invalidateDashboard(userId: string, businessId: string) {
 const keys = [
 CACHE_KEYS.DASHBOARD_SUMMARY(userId, businessId),
 CACHE_KEYS.DASHBOARD_MONTHLY(userId, '2024-01', '2024-12'), // Current year
 CACHE_KEYS.CATEGORY_BREAKDOWN(userId, 'income', '2024-01', '2024-12'),
 CACHE_KEYS.CATEGORY_BREAKDOWN(userId, 'expense', '2024-01', '2024-12'),
 ];

 // Also invalidate previous month keys
 const prevMonth = subMonths(new Date(), 1);
 const prevMonthStr = format(prevMonth, 'yyyy-MM');
 keys.push(CACHE_KEYS.DASHBOARD_MONTHLY(userId, prevMonthStr, prevMonthStr));

 await this.redis.del(keys);
 }

 async invalidateOnReceiptChange(userId: string, businessId: string) {
 await this.invalidateDashboard(userId, businessId);
 await this.redis.del(CACHE_KEYS.CATEGORIES(userId));
 }

 async invalidateOnInvoiceChange(userId: string) {
 await this.invalidateDashboard(userId, '*');
 await this.redis.del(CACHE_KEYS.INVOICE_COUNTER('*', '*')); // Pattern delete if using keyspace
 }
}
```

### Cache Warming

```typescript
// Warm cache on app startup or after mutations
export async function warmDashboardCache(userId: string, businessId: string) {
 const summary = await dashboardService.getSummary(userId, businessId);
 await redis.setex(
 CACHE_KEYS.DASHBOARD_SUMMARY(userId, businessId),
 300, // 5 minutes
 JSON.stringify(summary)
 );
}
```

---

## Rate Limiting

### Rules

| Tier | Requests/min | Burst | Notes |
|---|---|---|---|
| Free (unauthenticated) | 10 | 5/10s | IP-based |
| Free (authenticated) | 100 | 20/10s | User-based |
| Pro | 500 | 50/10s | User-based |
| Business | 2000 | 200/10s | User-based |

### Implementation (Upstash Ratelimit)

```typescript
// middleware/rate-limit.middleware.ts

import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '../utils/redis';

const rateLimiter = new Ratelimit({
 redis,
 limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 req/min
 analytics: true,
 });

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
 const userId = req.user?.id;
 const identifier = userId || req.ip;

 const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);

 res.setHeader('X-RateLimit-Limit', limit);
 res.setHeader('X-RateLimit-Remaining', remaining);
 res.setHeader('X-RateLimit-Reset', reset.toString());

 if (!success) {
 return res.status(429).json({
 success: false,
 error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
 });
 }

 next();
}

// Stricter limits for AI endpoints
const aiRateLimiter = new Ratelimit({
 redis,
 limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 AI scans/min
 });
```

---

## Deployment Architecture

### Infrastructure

```
┌──────────────────────────────────────────────────────────────────┐
│ CLOUDFLARE CDN │
│ (Static assets, DDoS protection) │
└────────────────────────────┬─────────────────────────────────────┘
 │
┌──────────────────────────────────────────────────────────────────┐
│ VERCEL EDGE NETWORK │
│ ┌─────────────┐ ┌──────────────┐ ┌───────────────────────┐ │
│ │ Next.js App │ │ API Routes │ │ Edge Functions │ │
│ │ (Web UI) │ │ (Express) │ │ (Webhooks, Cron) │ │
│ └─────────────┘ └──────────────┘ └───────────────────────┘ │
│ │ │ │
│ ┌───────┴──────┐ │ │
│ │ Auth Middleware│ │ │
│ │ Rate Limiter │ │ │
│ │ CORS │ │ │
│ └───────────────┘ │ │
└───────────────────────────────────────┼───────────────────────────┘
 │
 ┌──────────────────────────────┼────────────────────┐
 ▼ ▼ ▼
┌──────────────────┐ ┌──────────────────────┐ ┌──────────────────┐
│ SUPABASE │ │ REDIS (Upstash) │ │ EXTERNAL APIs │
│ ─────────────── │ │ ──────────────────── │ │ ──────────────── │
│ PostgreSQL 15+ │ │ Cache keys │ │ OpenAI GPT-4o │
│ (Auth, Storage, │ │ BullMQ queues │ │ Tesseract OCR │
│ Realtime, Edge │ │ Rate limit counters │ │ Razorpay │
│ Functions) │ │ Session store │ │ WhatsApp (Twilio)│
│ │ │ │ │ │
│ Storage: receipts│ │ │ │ │
│ bucket: invoices │ │ │ │ │
│ bucket: exports │ │ │ │ │
└──────────────────┘ └──────────────────────┘ └──────────────────┘
```

### Environment Variables

```bash
# .env (server-side)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role>
SUPABASE_ANON_KEY=<anon-key>

REDIS_URL=redis://<host>:6379

OPENAI_API_KEY=sk-...
OPENAI_FALLBACK_MODEL=gpt-4o-mini

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886

RESEND_API_KEY=re_... (or SendGrid)
APP_URL=https://app.khatabookai.com
API_URL=https://api.khatabookai.com
STORAGE_URL=https://xxx.supabase.co/storage/v1/object/public

NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# AI config
AI_PRIMARY_MODEL=gpt-4o
AI_FALLBACK_MODEL=gpt-4o-mini
AI_SCAN_CONFIDENCE_THRESHOLD=80
AI_CATEGORIZE_CONFIDENCE_THRESHOLD=70
```

### Supabase Edge Functions

```typescript
// supabase/functions/process-receipt-webhook/index.ts
// Called by queue worker when receipt scan completes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
 const { receiptId, userId } = await req.json();

 // Fetch receipt
 const { data: receipt } = await supabase
 .from('receipts')
 .select('*')
 .eq('id', receiptId)
 .single();

 if (!receipt) return new Response('Not found', { status: 404 });

 // Invalidate caches
 await fetch(`${API_URL}/internal/cache/invalidate`, {
 method: 'POST',
 headers: { 'Authorization': `Bearer ${SERVICE_ROLE_KEY}` },
 body: JSON.stringify({ userId, businessId: receipt.business_id }),
 });

 // Send notification
 await fetch(`${API_URL}/internal/notifications/scan-complete`, {
 method: 'POST',
 headers: { 'Authorization': `Bearer ${SERVICE_ROLE_KEY}` },
 body: JSON.stringify({ userId, receiptId }),
 });

 return new Response('OK');
});
```

---

## Health Checks & Monitoring

```typescript
// routes/health.ts

router.get('/health', (req, res) => {
 res.json({
 status: 'healthy',
 timestamp: new Date().toISOString(),
 services: {
 database: 'connected', // Check via supabase query
 redis: 'connected', // Check via ping
 queue: 'connected', // Check via BullMQ
 ai: 'connected', // Check via OpenAI ping
 },
 version: process.env.npm_package_version,
 });
});

router.get('/health/ready', async (req, res) => {
 // Deep health check
 try {
 await supabase.from('users').select('count').limit(1);
 await redis.ping();
 await queues.scanReceipt.getJobCounts();
 res.json({ status: 'ready' });
 } catch (error) {
 res.status(503).json({ status: 'not ready', error: error.message });
 }
});
```

---

## Summary

| Component | Technology | Purpose |
|---|---|---|
| API Framework | Express / Fastify on Vercel | REST endpoints |
| Database | Supabase Postgres 15+ | Data persistence, RLS |
| Auth | Supabase Auth | JWT-based authentication |
| Storage | Supabase Storage | Receipt images, PDFs |
| Cache | Upstash Redis | Dashboard stats, embeddings |
| Queue | BullMQ + Redis | Async AI processing |
| AI Primary | OpenAI GPT-4o Vision | Receipt scanning |
| AI Fallback | Tesseract.js + GPT-4o-mini | Offline/low-quality scans |
| Payments | Razorpay | Payment links, verification |
| Notifications | Resend (email) + Twilio (WhatsApp) | Reminders, alerts |
| PDF Generation | Puppeteer / @react-pdf/renderer | Invoice PDFs |
| Monitoring | Vercel Analytics + Sentry | Error tracking, performance |
