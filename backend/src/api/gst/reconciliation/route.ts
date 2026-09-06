import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, validationError, internalError } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * GET /api/gst/reconciliation
 * Matches inward vs outward supplies, flags mismatches.
 */
export async function GET(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const { searchParams } = new URL(request.url);
 const businessId = searchParams.get("business_id");

 if (!businessId) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "business_id is required" } },
 { status: 422 }
 );
 }

 // Fetch invoices (outward)
 const { data: invoices } = await supabase()
 .from("invoices")
 .select("client_gstin, sub_total, cgst_amount, sgst_amount, igst_amount, invoice_number")
 .eq("user_id", userId)
 .eq("business_id", businessId)
 .not("status", "in", "('void','cancelled')");

 // Fetch expenses (inward)
 const { data: expenses } = await supabase()
 .from("expenses")
 .select("vendor_gstin, amount, cgst_amount, sgst_amount, igst_amount")
 .eq("user_id", userId)
 .eq("business_id", businessId)
 .is("deleted_at", null);

 // Build outward map by GSTIN
 const outwardMap: Record<string, any> = {};
 for (const inv of invoices || []) {
 const gstin = inv.client_gstin || "UNKNOWN";
 if (!outwardMap[gstin]) outwardMap[gstin] = { invoices: [], total_taxable: 0, total_cgst: 0, total_sgst: 0, total_igst: 0 };
 outwardMap[gstin].invoices.push(inv);
 outwardMap[gstin].total_taxable += Number(inv.sub_total) || 0;
 outwardMap[gstin].total_cgst += Number(inv.cgst_amount) || 0;
 outwardMap[gstin].total_sgst += Number(inv.sgst_amount) || 0;
 outwardMap[gstin].total_igst += Number(inv.igst_amount) || 0;
 }

 // Build inward map by GSTIN
 const inwardMap: Record<string, any> = {};
 for (const exp of expenses || []) {
 const gstin = exp.vendor_gstin || "UNKNOWN";
 if (!inwardMap[gstin]) inwardMap[gstin] = { total_taxable: 0, total_cgst: 0, total_sgst: 0, total_igst: 0 };
 inwardMap[gstin].total_taxable += Number(exp.amount) || 0;
 inwardMap[gstin].total_cgst += Number(exp.cgst_amount) || 0;
 inwardMap[gstin].total_sgst += Number(exp.sgst_amount) || 0;
 inwardMap[gstin].total_igst += Number(exp.igst_amount) || 0;
 }

 const allGstins = new Set([...Object.keys(outwardMap), ...Object.keys(inwardMap)]);
 const reconciliation = Array.from(allGstins).map((gstin) => {
 const outward = outwardMap[gstin] || { total_taxable: 0, total_cgst: 0, total_sgst: 0, total_igst: 0, invoices: [] };
 const inward = inwardMap[gstin] || { total_taxable: 0, total_cgst: 0, total_sgst: 0, total_igst: 0 };

 const hasMismatch = (outward.total_cgst !== inward.total_cgst) || (outward.total_sgst !== inward.total_sgst) || (outward.total_igst !== inward.total_igst);

 return {
 gstin,
 outward: { taxable: outward.total_taxable, cgst: outward.total_cgst, sgst: outward.total_sgst, igst: outward.total_igst },
 inward: { taxable: inward.total_taxable, cgst: inward.total_cgst, sgst: inward.total_sgst, igst: inward.total_igst },
 mismatch: hasMismatch,
 invoice_count: outward.invoices?.length || 0,
 };
 });

 const mismatches = reconciliation.filter((r) => r.mismatch);

 return ok({
 reconciliation,
 summary: {
 total_outward_supplies: reconciliation.reduce((s, r) => s + r.outward.taxable, 0),
 total_inward_supplies: reconciliation.reduce((s, r) => s + r.inward.taxable, 0),
 mismatches_found: mismatches.length,
 },
 mismatches,
 });
 } catch {
 return internalError("Failed to perform GST reconciliation");
 }
}
