/**
 * Khatabook AI — AI Receipt Scanner
 *
 * Uses OpenAI GPT-4o Vision API for OCR on receipt images,
 * with Tesseract.js as a fallback for offline processing.
 * Returns structured JSON with vendor info, line items, GST details.
 *
 * Located in services/ai/ as the canonical AI module entry point.
 */

import OpenAI from 'openai';
import Tesseract from 'tesseract.js';
import type { ReceiptExtraction, ReceiptLineItem } from '@/types/ai';
import { getOpenAIClient, withRetry, sanitizeOpenAIContent, parseJSONSafely } from './openai.service';

// ─── Prompt Templates ───────────────────────────────────────────────────────

const GPT4O_VISION_PROMPT = `You are an expert OCR engine specialized in Indian receipts, invoices, and bills.
Analyze the attached receipt image and extract ALL visible fields into a strict JSON structure.

IMPORTANT RULES:
1. Return ONLY valid JSON — no markdown, no code fences, no prose.
2. For numeric fields, return plain numbers without currency symbols or commas.
3. If a field is not visible, use null (not "N/A" or empty string).
4. For dates, return ISO format (YYYY-MM-DD).
5. Detect Indian GST invoices: extract CGST, SGST, IGST, and CESS separately.
6. For line_items, extract each row: description, quantity (number), unit_price (number), gst_rate (number %), amount (number).
7. Compute a confidence score 0.00–1.00 for overall extraction quality.
8. Recognize vendor GSTIN format: 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric.
9. The "paymentMode" field: detect Cash, Card, UPI, Cheque, Bank Transfer, Wallet, or Other.

JSON STRUCTURE:
{
 "vendorName": string | null,
 "vendorAddress": string | null,
 "vendorGstin": string | null,
 "invoiceNumber": string | null,
 "invoiceDate": string | null,
 "dueDate": string | null,
 "paymentMode": string | null,
 "subTotal": number | null,
 "cgstAmount": number | null,
 "sgstAmount": number | null,
 "igstAmount": number | null,
 "cessAmount": number | null,
 "discountAmount": number | null,
 "totalAmount": number | null,
 "currency": "INR" | string,
 "lineItems": [
 {
 "description": string,
 "quantity": number | null,
 "unitPrice": number | null,
 "gstRate": number | null,
 "amount": number | null
 }
 ],
 "confidence": number
}`;

// ─── Configuration ───────────────────────────────────────────────────────────

export const SCANNER_CONFIG = {
 openaiModel: 'gpt-4o' as const,
 maxRetries: 3,
 retryBaseDelayMs: 1000,
 tesseractLang: 'eng',
 fallbackEnabled: true,
 maxImageSizeBytes: 20 * 1024 * 1024, // 20 MB
};

type ScannerConfig = typeof SCANNER_CONFIG;

// ─── Utility ────────────────────────────────────────────────────────────────

function clampConfidence(confidence: number): number {
 return Math.max(0, Math.min(1, Math.round(confidence * 100) / 100));
}

// ─── Image Preprocessing ─────────────────────────────────────────────────────

export interface PreprocessedImage {
 base64Data: string;
 mimeType: string;
 width: number;
 height: number;
}

export async function preprocessImage(
 imageBuffer: Buffer | ArrayBuffer
): Promise<PreprocessedImage> {
 // In production, this would use Sharp or similar for:
 // - Resizing to max 2048px on longest edge
 // - Converting to RGB
 // - Deskewing
 // - Enhancing contrast
 // For now, we just ensure we have a buffer

 const buf = Buffer.isBuffer(imageBuffer) ? imageBuffer : Buffer.from(imageBuffer);

 // Detect mime type from magic bytes
 let mimeType = 'image/jpeg';
 if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
 mimeType = 'image/png';
 } else if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) {
 mimeType = 'image/webp';
 }

 const base64Data = buf.toString('base64');

 return {
 base64Data,
 mimeType,
 width: 0, // Would be filled by actual image processing
 height: 0,
 };
}

// ─── GPT-4o Vision OCR ──────────────────────────────────────────────────────

async function scanWithGPT4o(image: PreprocessedImage): Promise<ReceiptExtraction> {
 const client = getOpenAIClient();

 const response = await withRetry(
 () =>
 client.chat.completions.create({
 model: SCANNER_CONFIG.openaiModel,
 temperature: 0,
 max_tokens: 2000,
 messages: [
 {
 role: 'user',
 content: [
 {
 type: 'text' as const,
 text: GPT4O_VISION_PROMPT,
 },
 {
 type: 'image_url' as const,
 image_url: {
 url: `data:${image.mimeType};base64,${image.base64Data}`,
 detail: 'high',
 },
 },
 ],
 },
 ],
 }),
 SCANNER_CONFIG.maxRetries,
 SCANNER_CONFIG.retryBaseDelayMs
 );

 const content = response.choices[0]?.message?.content?.trim();
 if (!content) {
 throw new Error('GPT-4o returned empty response');
 }

 // Parse the JSON — use shared sanitizer
 const jsonMatch = content.match(/\{[\s\S]*\}/);
 if (!jsonMatch) {
 throw new Error(`GPT-4o returned non-JSON response: ${content.slice(0, 200)}`);
 }

 const parsed = parseJSONSafely<Record<string, unknown>>(jsonMatch[0]);

 // Validate and normalize line items
 const rawLineItems = Array.isArray(parsed.lineItems) ? parsed.lineItems : [];
 const lineItems: ReceiptLineItem[] = rawLineItems.map((item: Record<string, unknown>) => ({
 description: typeof item.description === 'string' ? item.description : '',
 quantity: typeof item.quantity === 'number' ? item.quantity : null,
 unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : null,
 gstRate: typeof item.gstRate === 'number' ? item.gstRate : null,
 amount: typeof item.amount === 'number' ? item.amount : null,
 }));

 // Validate GSTIN format if present
 const vendorGstin = typeof parsed.vendorGstin === 'string' ? parsed.vendorGstin : null;
 if (vendorGstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(vendorGstin)) {
 // Mark as potentially incorrect but don't block
 console.warn(`ReceiptScanner: GSTIN format may be invalid: ${vendorGstin}`);
 }

 return {
 vendorName: typeof parsed.vendorName === 'string' ? parsed.vendorName : null,
 vendorAddress: typeof parsed.vendorAddress === 'string' ? parsed.vendorAddress : null,
 vendorGstin,
 invoiceNumber: typeof parsed.invoiceNumber === 'string' ? parsed.invoiceNumber : null,
 invoiceDate: typeof parsed.invoiceDate === 'string' ? parsed.invoiceDate : null,
 dueDate: typeof parsed.dueDate === 'string' ? parsed.dueDate : null,
 paymentMode: typeof parsed.paymentMode === 'string' ? parsed.paymentMode : null,
 subTotal: typeof parsed.subTotal === 'number' ? parsed.subTotal : null,
 cgstAmount: typeof parsed.cgstAmount === 'number' ? parsed.cgstAmount : null,
 sgstAmount: typeof parsed.sgstAmount === 'number' ? parsed.sgstAmount : null,
 igstAmount: typeof parsed.igstAmount === 'number' ? parsed.igstAmount : null,
 cessAmount: typeof parsed.cessAmount === 'number' ? parsed.cessAmount : null,
 discountAmount: typeof parsed.discountAmount === 'number' ? parsed.discountAmount : null,
 totalAmount: typeof parsed.totalAmount === 'number' ? parsed.totalAmount : null,
 currency: typeof parsed.currency === 'string' ? parsed.currency : 'INR',
 lineItems,
 confidence: clampConfidence(typeof parsed.confidence === 'number' ? parsed.confidence : 0.5),
 processingStatus: 'completed',
 processingError: null,
 modelVersion: 'gpt-4o',
 };
}

// ─── Tesseract.js Fallback OCR ───────────────────────────────────────────────

async function scanWithTesseract(
 image: PreprocessedImage,
 _lang = SCANNER_CONFIG.tesseractLang
): Promise<ReceiptExtraction> {
 try {
 const result = await Tesseract.recognize(image.base64Data, _lang, {
 logger: (m) => {
 if (m.status === 'recognizing text') {
 console.debug(`Tesseract progress: ${Math.round(m.progress * 100)}%`);
 }
 },
 });

 const text = result.data.text.trim();

 // Basic heuristic extraction from raw text
 const lines = text.split('\n').filter((l) => l.trim().length > 0);

 // Try to find totals
 const totalMatch = text.match(/(?:total|grand\s*total|amount)\s*[:\-]?\s*(?:₹|Rs\.?)?\s*([0-9,]+\.?\d*)/i);
 const subTotalMatch = text.match(/(?:sub\s*total|subtotal)\s*[:\-]?\s*(?:₹|Rs\.?)?\s*([0-9,]+\.?\d*)/i);
 const cgstMatch = text.match(/(?:cgst)\s*[:\-]?\s*(?:@?\s*([0-9]+)%?\s*)?(?:₹|Rs\.?)?\s*([0-9,]+\.?\d*)/i);
 const sgstMatch = text.match(/(?:sgst)\s*[:\-]?\s*(?:@?\s*([0-9]+)%?\s*)?(?:₹|Rs\.?)?\s*([0-9,]+\.?\d*)/i);

 // Try to find a vendor name (usually the first non-empty, non-numeric line)
 const vendorName = lines.find(
 (l) => l.trim().length > 3 && !/^\d/.test(l.trim()) && l.trim().length < 60
 )?.trim() ?? null;

 // Try to find invoice number
 const invoiceMatch = text.match(/(?:invoice|bill|receipt)\s*(?:no|number|#|:)?\s*[:\-]?\s*([A-Z0-9\/\-]{3,20})/i);
 const invoiceNumber = invoiceMatch?.[1] ?? null;

 // Try to find date
 const dateMatch = text.match(
 /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|(\d{1,2})(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i
 );
 const invoiceDate = dateMatch?.[1] ?? null;

 // Try to find GSTIN
 const gstinMatch = text.match(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/);

 const totalAmount = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : null;
 const subTotal = subTotalMatch ? parseFloat(subTotalMatch[1].replace(/,/g, '')) : totalAmount;

 return {
 vendorName,
 vendorAddress: null,
 vendorGstin: gstinMatch?.[0] ?? null,
 invoiceNumber,
 invoiceDate,
 dueDate: null,
 paymentMode: null,
 subTotal: subTotal ?? null,
 cgstAmount: cgstMatch?.[2] ? parseFloat(cgstMatch[2].replace(/,/g, '')) : null,
 sgstAmount: sgstMatch?.[2] ? parseFloat(sgstMatch[2].replace(/,/g, '')) : null,
 igstAmount: null,
 cessAmount: null,
 discountAmount: null,
 totalAmount,
 currency: 'INR',
 lineItems: [],
 confidence: 0.45, // Tesseract is lower confidence
 processingStatus: 'review_required',
 processingError: null,
 modelVersion: 'tesseract-5',
 };
 } catch (error: unknown) {
 console.error('Tesseract OCR failed:', error);
 return {
 vendorName: null,
 vendorAddress: null,
 vendorGstin: null,
 invoiceNumber: null,
 invoiceDate: null,
 dueDate: null,
 paymentMode: null,
 subTotal: null,
 cgstAmount: null,
 sgstAmount: null,
 igstAmount: null,
 cessAmount: null,
 discountAmount: null,
 totalAmount: null,
 currency: 'INR',
 lineItems: [],
 confidence: 0,
 processingStatus: 'failed',
 processingError: `Tesseract fallback failed: ${(error as Error).message}`,
 modelVersion: null,
 };
 }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface ScanReceiptOptions {
 imageBuffer: Buffer | ArrayBuffer;
 mimeType?: string;
 useTesseractFallback?: boolean;
 userId?: string; // for tracking
}

export interface ScanReceiptResult {
 extraction: ReceiptExtraction;
 fallbackUsed: boolean;
 model: string;
}

export async function scanReceipt(options: ScanReceiptOptions): Promise<ScanReceiptResult> {
 const {
 imageBuffer,
 useTesseractFallback = SCANNER_CONFIG.fallbackEnabled,
 } = options;

 // Validate input size
 const size = Buffer.isBuffer(imageBuffer) ? imageBuffer.length : imageBuffer.byteLength;
 if (size > SCANNER_CONFIG.maxImageSizeBytes) {
 throw new Error(
 `Image too large: ${(size / 1024 / 1024).toFixed(1)}MB exceeds ${SCANNER_CONFIG.maxImageSizeBytes / 1024 / 1024}MB limit`
 );
 }

 if (size === 0) {
 throw new Error('Image buffer is empty');
 }

 const image = await preprocessImage(imageBuffer);

 // Primary: GPT-4o Vision
 if (process.env.OPENAI_API_KEY) {
 try {
 const extraction = await scanWithGPT4o(image);
 return {
 extraction,
 fallbackUsed: false,
 model: 'gpt-4o',
 };
 } catch (error: unknown) {
 console.error('GPT-4o OCR failed, attempting fallback:', error);

 if (!useTesseractFallback) {
 throw new Error(
 `GPT-4o OCR failed: ${(error as Error).message}. Fallback disabled.`
 );
 }
 }
 }

 // Fallback: Tesseract.js
 if (SCANNER_CONFIG.fallbackEnabled) {
 const extraction = await scanWithTesseract(image);
 return {
 extraction,
 fallbackUsed: true,
 model: 'tesseract-5',
 };
 }

 throw new Error('No OCR engine available. Configure OPENAI_API_KEY or enable Tesseract fallback.');
}

export { SCANNER_CONFIG as DEFAULT_CONFIG };
