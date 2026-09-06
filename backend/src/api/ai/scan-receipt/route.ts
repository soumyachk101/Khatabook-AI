import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, notFound, internalError } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * POST /api/ai/scan-receipt
 * Manually triggers receipt scanning (alternative to upload flow).
 * Accepts multipart/form-data image upload.
 */
export async function POST(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const formData = await request.formData();
 const file = formData.get("image") as File | null;
 const businessId = formData.get("business_id") as string | null;

 if (!file) return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Image file is required" } },
 { status: 422 }
 );

 const maxSize = 10 * 1024 * 1024;
 if (file.size > maxSize) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "File must be under 10 MB" } },
 { status: 422 }
 );
 }

 const { uploadToStorage, processReceiptWithAI } = await import("@/app/lib/services");

 // Upload to storage
 const { path, publicUrl } = await uploadToStorage(userId, file, "receipts");

 // Create receipt
 const { data: receipt } = await supabase()
 .from("receipts")
 .insert({
 user_id: userId,
 business_id: businessId,
 original_image_url: publicUrl,
 original_filename: file.name,
 file_size_bytes: file.size,
 mime_type: file.type,
 processing_status: "processing",
 review_status: "auto",
 currency: "INR",
 })
 .select()
 .single();

 if (!receipt) return internalError("Failed to create receipt");

 // Run AI scan
 try {
 const result = await processReceiptWithAI(publicUrl, userId);

 const { data: updated } = await supabase()
 .from("receipts")
 .update({
 processing_status: "completed",
 ai_confidence: result.confidence,
 ai_model_version: "gpt-4o",
 ai_raw_response: result.extracted,
 processed_at: new Date().toISOString(),
 vendor_name: (result.extracted as any)?.vendor || null,
 vendor_gstin: (result.extracted as any)?.gstin || null,
 invoice_number: (result.extracted as any)?.invoice_number || null,
 invoice_date: (result.extracted as any)?.date || null,
 sub_total: (result.extracted as any)?.subtotal || null,
 cgst_amount: (result.extracted as any)?.cgst?.[0]?.amount || null,
 sgst_amount: (result.extracted as any)?.sgst?.[0]?.amount || null,
 igst_amount: (result.extracted as any)?.igst?.[0]?.amount || null,
 total_amount: (result.extracted as any)?.total || null,
 line_items: (result.extracted as any)?.items || [],
 })
 .eq("id", receipt.id)
 .select()
 .single();

 return ok({
 id: receipt.id,
 status: "completed",
 image_url: publicUrl,
 raw_text: result.rawText,
 extracted_data: result.extracted,
 ai_confidence_score: result.confidence,
 ...updated,
 });
 } catch (aiErr) {
 console.error("AI scan failed:", aiErr);
 return ok({
 id: receipt.id,
 status: "failed",
 image_url: publicUrl,
 raw_text: "",
 extracted_data: null,
 ai_confidence_score: 0,
 processing_error: aiErr instanceof Error ? aiErr.message : "AI processing failed",
 });
 }
 } catch {
 return internalError("Failed to scan receipt");
 }
}
