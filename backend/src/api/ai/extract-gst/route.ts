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
 * POST /api/ai/extract-gst
 * Extracts GST details from a receipt.
 */
export async function POST(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const body = await request.json();
 const { receipt_id } = body;

 if (!receipt_id) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "receipt_id is required" } },
 { status: 422 }
 );
 }

 const { data: receipt } = await supabase()
 .from("receipts")
 .select("*")
 .eq("id", receipt_id)
 .eq("user_id", userId)
 .single();

 if (!receipt) return notFound("Receipt not found");

 // Extract GST details from raw response
 const raw = receipt.ai_raw_response as Record<string, unknown> | null;

 return ok({
 gst_details: {
 cgst: (raw?.cgst as any[]) || [],
 sgst: (raw?.sgst as any[]) || [],
 igst: (raw?.igst as any[]) || [],
 total_tax: (Number(receipt.cgst_amount) || 0) + (Number(receipt.sgst_amount) || 0) + (Number(receipt.igst_amount) || 0),
 },
 vendor_gstin: receipt.vendor_gstin,
 confidence: receipt.ai_confidence || 0.8,
 });
 } catch {
 return internalError("Failed to extract GST details");
 }
}
