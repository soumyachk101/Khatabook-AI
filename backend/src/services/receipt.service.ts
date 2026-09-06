import { supabase } from "../utils/supabase";
import { Storage } from "../utils/storage";
import { AppError, Errors } from "../utils/response";
import { receiptScannerService } from "./receipt-scanner.service";
import { aiService } from "./ai.service";
import { GSTDetails } from "../types";
import { Category } from "../types";

export class ReceiptService {
 private userId: string;

 constructor(userId: string) {
 this.userId = userId;
 }

 /**
 * Upload receipt file to storage and create record
 */
 async uploadReceipt(
 file: Buffer,
 filename: string,
 mimeType: string,
 businessId?: string
 ): Promise<{
 id: string;
 status: "processing" | "completed";
 message: string;
 estimated_completion_ms: number;
 image_url?: string;
 }> {
 // 1. Upload to storage
 const path = Storage.generateReceiptPath(this.userId, filename);
 const storageResult = await Storage.upload("RECEIPTS", path, file, mimeType, false);

 // 2. Create receipt record
 const { data: receipt, error } = await supabase
 .from("receipts")
 .insert({
 user_id: this.userId,
 business_id: businessId,
 original_image_url: storageResult.url,
 original_filename: filename,
 file_size_bytes: file.length,
 mime_type: mimeType,
 processing_status: "processing",
 })
 .select()
 .single();

 if (error || !receipt) {
 // Cleanup uploaded file
 try {
 await Storage.delete("RECEIPTS", path);
 } catch { /* ignore cleanup errors */ }
 throw new Error(`Failed to create receipt record: ${error?.message}`);
 }

 // 3. Queue AI scan (in production, use BullMQ; here we do inline for simplicity)
 try {
 const scanResult = await receiptScannerService.scanReceipt(
 file,
 mimeType,
 this.userId,
 receipt.id
 );

 // Update receipt with extracted data
 await supabase
 .from("receipts")
 .update({
 processing_status: "completed",
 processed_at: new Date().toISOString(),
 vendor_name: scanResult.extractedData.vendor,
 vendor_gstin: scanResult.extractedData.gstin,
 vendor_address: scanResult.extractedData.vendor_address,
 invoice_number: scanResult.extractedData.invoice_number,
 invoice_date: scanResult.extractedData.date || undefined,
 sub_total: scanResult.extractedData.sub_total,
 cgst_amount: scanResult.extractedData.cgst_amount,
 sgst_amount: scanResult.extractedData.sgst_amount,
 igst_amount: scanResult.extractedData.igst_amount,
 total_amount: scanResult.extractedData.total_amount,
 line_items: scanResult.extractedData.line_items,
 ai_confidence: scanResult.confidence,
 ai_model_version: scanResult.model,
 ai_raw_response: JSON.parse(JSON.stringify(scanResult.extractedData)),
 })
 .eq("id", receipt.id);

 // Auto-categorize if confidence is high
 if (scanResult.confidence >= 80) {
 try {
 const categoryResult = await aiService.categorizeReceipt(
 scanResult.extractedData.vendor,
 scanResult.extractedData.raw_text,
 scanResult.extractedData.line_items as any
 );

 // Find matching category
 const { data: categories } = await supabase
 .from("categories")
 .select("id")
 .ilike("name", `%${categoryResult.category}%`)
 .limit(1);

 if (categories && categories.length > 0) {
 await supabase
 .from("receipts")
 .update({ category_id: categories[0].id, review_status: "approved" })
 .eq("id", receipt.id);
 }
 } catch (catErr) {
 console.error("Auto-categorization failed:", catErr);
 }
 }

 return {
 id: receipt.id,
 status: "completed",
 message: "Receipt processed successfully",
 estimated_completion_ms: scanResult.processingTimeMs,
 image_url: storageResult.url,
 };
 } catch (scanErr) {
 // Update status to failed
 await supabase
 .from("receipts")
 .update({
 processing_status: "failed",
 processing_error: scanErr instanceof Error ? scanErr.message : "Unknown error",
 })
 .eq("id", receipt.id);

 return {
 id: receipt.id,
 status: "processing",
 message: "Receipt queued. Processing will continue asynchronously.",
 estimated_completion_ms: 3000,
 image_url: storageResult.url,
 };
 }
 }

 /**
 * List receipts with filters
 */
 async listReceipts(filters: {
 business_id?: string;
 category?: string;
 vendor?: string;
 min_amount?: number;
 max_amount?: number;
 tags?: string;
 status?: string;
 from?: string;
 to?: string;
 page: number;
 limit: number;
 sort?: string;
 order?: "asc" | "desc";
 }): Promise<{ items: any[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
 let query = supabase
 .from("receipts")
 .select("*", { count: "exact" })
 .eq("user_id", this.userId);

 if (filters.business_id) query = query.eq("business_id", filters.business_id);
 if (filters.category) query = query.eq("category_id", filters.category);
 if (filters.vendor) query = query.ilike("vendor_name", `%${filters.vendor}%`);
 if (filters.status) query = query.eq("processing_status", filters.status);
 if (filters.from) query = query.gte("invoice_date", filters.from);
 if (filters.to) query = query.lte("invoice_date", filters.to);
 if (filters.min_amount) query = query.gte("total_amount", filters.min_amount);
 if (filters.max_amount) query = query.lte("total_amount", filters.max_amount);
 if (filters.tags) {
 const tags = filters.tags.split(",");
 query = query.contains("tags", tags);
 }

 const sortField = filters.sort || "created_at";
 query = query.order(sortField, { ascending: filters.order === "asc" });

 const from = (filters.page - 1) * filters.limit;
 const to = from + filters.limit - 1;

 const { data, error, count } = await query.range(from, to);

 if (error) {
 throw new Error(`Failed to list receipts: ${error.message}`);
 }

 return {
 items: data || [],
 pagination: {
 page: filters.page,
 limit: filters.limit,
 total: count || 0,
 pages: Math.ceil((count || 0) / filters.limit),
 },
 };
 }

 /**
 * Get receipt by ID
 */
 async getReceipt(receiptId: string): Promise<any> {
 const { data, error } = await supabase
 .from("receipts")
 .select("*")
 .eq("id", receiptId)
 .eq("user_id", this.userId)
 .single();

 if (error || !data) {
 throw Errors.notFound("Receipt not found");
 }

 return data;
 }

 /**
 * Update receipt
 */
 async updateReceipt(receiptId: string, updates: Record<string, unknown>): Promise<any> {
 const { data, error } = await supabase
 .from("receipts")
 .update({ ...updates, updated_at: new Date().toISOString() })
 .eq("id", receiptId)
 .eq("user_id", this.userId)
 .select()
 .single();

 if (error) {
 throw new Error(`Failed to update receipt: ${error.message}`);
 }

 if (!data) {
 throw Errors.notFound("Receipt not found");
 }

 return data;
 }

 /**
 * Delete receipt
 */
 async deleteReceipt(receiptId: string): Promise<void> {
 const { error } = await supabase
 .from("receipts")
 .delete()
 .eq("id", receiptId)
 .eq("user_id", this.userId);

 if (error) {
 throw new Error(`Failed to delete receipt: ${error.message}`);
 }
 }

 /**
 * Re-scan receipt
 */
 async rescanReceipt(receiptId: string): Promise<any> {
 const receipt = await this.getReceipt(receiptId);

 if (!receipt.original_image_url) {
 throw AppError.badRequest("Receipt has no image to re-scan");
 }

 // Update status
 await supabase
 .from("receipts")
 .update({ processing_status: "processing", processing_error: null })
 .eq("id", receiptId);

 // Fetch image from URL and re-scan
 const imageBuffer = await this.fetchImage(receipt.original_image_url);
 const scanResult = await receiptScannerService.scanReceipt(
 imageBuffer,
 receipt.mime_type || "image/jpeg",
 this.userId,
 receiptId
 );

 return this.updateReceipt(receiptId, {
 processing_status: "completed",
 processed_at: new Date().toISOString(),
 vendor_name: scanResult.extractedData.vendor,
 vendor_gstin: scanResult.extractedData.gstin,
 vendor_address: scanResult.extractedData.vendor_address,
 invoice_number: scanResult.extractedData.invoice_number,
 invoice_date: scanResult.extractedData.date || undefined,
 sub_total: scanResult.extractedData.sub_total,
 cgst_amount: scanResult.extractedData.cgst_amount,
 sgst_amount: scanResult.extractedData.sgst_amount,
 igst_amount: scanResult.extractedData.igst_amount,
 total_amount: scanResult.extractedData.total_amount,
 line_items: scanResult.extractedData.line_items,
 ai_confidence: scanResult.confidence,
 ai_model_version: scanResult.model,
 ai_raw_response: JSON.parse(JSON.stringify(scanResult.extractedData)),
 });
 }

 /**
 * Convert receipt to expense
 */
 async convertToExpense(receiptId: string, categoryId: string): Promise<any> {
 const receipt = await this.getReceipt(receiptId);

 if (!receipt.vendor_name || !receipt.total_amount) {
 throw AppError.badRequest("Receipt must have vendor and amount to convert to expense");
 }

 // Create expense from receipt data
 const { data: expense, error } = await supabase
 .from("expenses")
 .insert({
 user_id: this.userId,
 business_id: receipt.business_id,
 description: receipt.vendor_name,
 category_id: categoryId,
 amount: receipt.total_amount,
 expense_date: receipt.invoice_date || new Date().toISOString().split("T")[0],
 vendor_name: receipt.vendor_name,
 vendor_gstin: receipt.vendor_gstin,
 gst_applicable: !!(receipt.cgst_amount || receipt.sgst_amount || receipt.igst_amount),
 cgst_amount: receipt.cgst_amount,
 sgst_amount: receipt.sgst_amount,
 igst_amount: receipt.igst_amount,
 source_type: "receipt_scan",
 receipt_id: receiptId,
 })
 .select()
 .single();

 if (error) {
 throw new Error(`Failed to create expense: ${error.message}`);
 }

 // Link receipt to expense
 await supabase
 .from("receipts")
 .update({ linked_expense_id: (expense as Record<string, string>).id })
 .eq("id", receiptId);

 return expense;
 }

 /**
 * Fetch image from URL (helper)
 */
 private async fetchImage(url: string): Promise<Buffer> {
 const response = await fetch(url);
 if (!response.ok) {
 throw AppError.serviceUnavailable("Failed to fetch receipt image");
 }
 const arrayBuffer = await response.arrayBuffer();
 return Buffer.from(arrayBuffer);
 }
}
