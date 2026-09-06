import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { ok, notFound, unauthorized, internalError } from "@/app/lib/utils/response";

/**
 * GET /api/invoices/counters
 * Returns the next invoice number for a business.
 */
export async function GET(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const { searchParams } = new URL(request.url);
 const businessId = searchParams.get("business_id");

 if (!businessId) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "business_id is required", details: {} } },
 { status: 422 }
 );
 }

 const { data: business } = await supabase()
 .from("businesses")
 .select("default_invoice_prefix, invoice_number_counter")
 .eq("id", businessId)
 .eq("owner_id", userId)
 .single();

 if (!business) return notFound("Business not found");

 return ok({
 series: business.default_invoice_prefix || "INV",
 last_number: business.invoice_number_counter || 0,
 next_number: (business.invoice_number_counter || 0) + 1,
 });
 } catch {
 return internalError("Failed to fetch invoice counters");
 }
}

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}
