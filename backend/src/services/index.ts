/**
 * Service layer stubs for business logic.
 * These would normally delegate to the OCR microservice via HTTP.
 */

import { supabase } from "@/app/lib/supabase";

export async function processReceiptWithAI(
 imageUrl: string,
 userId: string
): Promise<{
 extracted: Record<string, unknown>;
 confidence: number;
 rawText: string;
}> {
 const ocrApiUrl = process.env.OCR_API_URL || "http://localhost:4000";
 const ocrApiKey = process.env.OCR_API_KEY;

 if (!ocrApiKey) {
 throw new Error("OCR service not configured.");
 }

 const response = await fetch(`${ocrApiUrl}/scan`, {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "X-OCR-API-Key": ocrApiKey,
 },
 body: JSON.stringify({ image_url: imageUrl, user_id: userId }),
 });

 if (!response.ok) {
 throw new Error(`OCR service error: ${response.status} ${response.statusText}`);
 }

 const result = await response.json();
 return {
 extracted: result.extracted_data || {},
 confidence: result.confidence || 0,
 rawText: result.raw_text || "",
 };
}

export async function uploadToStorage(
 userId: string,
 file: File,
 bucket = "receipts"
): Promise<{ path: string; publicUrl: string }> {
 const client = supabase();
 const fileExt = file.name.split(".").pop();
 const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
 const filePath = `${userId}/${fileName}`;

 const { data, error } = await client.storage
 .from(bucket)
 .upload(filePath, file, {
 cacheControl: "3600",
 upsert: false,
 });

 if (error) throw new Error(`Storage upload failed: ${error.message}`);

 const { data: urlData } = client.storage.from(bucket).getPublicUrl(filePath);

 return {
 path: filePath,
 publicUrl: urlData.publicUrl,
 };
}

export async function sendEmail(
 to: string,
 subject: string,
 html: string
): Promise<{ id: string }> {
 const resend = getResend();
 const from = process.env.NEXT_PUBLIC_APP_NAME
 ? `${process.env.NEXT_PUBLIC_APP_NAME} <onboarding@khatabook.ai>`
 : "Khatabook AI <onboarding@khatabook.ai>";

 const { data, error } = await resend.emails.send({
 from,
 to,
 subject,
 html,
 });

 if (error) throw new Error(`Email send failed: ${error.message}`);
 return { id: data.id };
}

export async function createRazorpayOrder(amount: number, currency = "INR") {
 const razorpay = getRazorpay();
 const order = await razorpay.orders.create({
 amount: Math.round(amount * 100), // paise
 currency,
 receipt: `receipt_${Date.now()}`,
 payment_capture: 1,
 });
 return order;
}

export async function generateGSTSummary(
 userId: string,
 businessId: string,
 quarter: string,
 financialYear: string
): Promise<{
 gstr1: Record<string, unknown>;
 gstr3b: Record<string, unknown>;
}> {
 const client = supabase();

 // Fetch all invoices for the period
 const [quarterStart, quarterEnd] = getQuarterDates(quarter, financialYear);

 const { data: invoices, error: invError } = await client
 .from("invoices")
 .select("line_items, sub_total, cgst_amount, sgst_amount, igst_amount, place_of_supply, client_gstin, invoice_number")
 .eq("user_id", userId)
 .eq("business_id", businessId)
 .gte("invoice_date", quarterStart)
 .lte("invoice_date", quarterEnd)
 .neq("status", "cancelled")
 .neq("status", "draft");

 if (invError) throw new Error(invError.message);

 const gstr1: Record<string, unknown> = {
 b2b_invoices: invoices || [],
 b2cl_invoices: [],
 total_taxable_value: 0,
 total_cgst: 0,
 total_sgst: 0,
 total_igst: 0,
 };

 const gstr3b: Record<string, unknown> = {
 outward_supplies: gstr1,
 inward_supplies: { input_cgst: 0, input_sgst: 0, input_igst: 0 },
 };

 if (invoices && invoices.length > 0) {
 let totalTaxable = 0;
 let totalCgst = 0;
 let totalSgst = 0;
 let totalIgst = 0;

 for (const inv of invoices) {
 totalTaxable += Number(inv.sub_total) || 0;
 totalCgst += Number(inv.cgst_amount) || 0;
 totalSgst += Number(inv.sgst_amount) || 0;
 totalIgst += Number(inv.igst_amount) || 0;
 }

 gstr1.total_taxable_value = totalTaxable;
 gstr1.total_cgst = totalCgst;
 gstr1.total_sgst = totalSgst;
 gstr1.total_igst = totalIgst;
 }

 return { gstr1, gstr3b };
}

export async function upsertGSTReturn(
 userId: string,
 businessId: string,
 financialYear: string,
 quarter: string,
 gstr1Data: Record<string, unknown>,
 gstr3bData: Record<string, unknown>
) {
 const client = supabase();

 const totalTaxable = (gstr1Data.total_taxable_value as number) || 0;
 const totalCgst = (gstr1Data.total_cgst as number) || 0;
 const totalSgst = (gstr1Data.total_sgst as number) || 0;
 const totalIgst = (gstr1Data.total_igst as number) || 0;

 // Approximate input tax from expenses for demo
 const [qStart, qEnd] = getQuarterDates(quarter, financialYear);
 const { data: expenses } = await client
 .from("expenses")
 .select("cgst_amount, sgst_amount, igst_amount")
 .eq("user_id", userId)
 .eq("business_id", businessId)
 .gte("expense_date", qStart)
 .lte("expense_date", qEnd)
 .is("deleted_at", null);

 let inputCgst = 0;
 let inputSgst = 0;
 let inputIgst = 0;
 if (expenses) {
 for (const exp of expenses) {
 inputCgst += Number(exp.cgst_amount) || 0;
 inputSgst += Number(exp.sgst_amount) || 0;
 inputIgst += Number(exp.igst_amount) || 0;
 }
 }

 const netCgst = totalCgst - inputCgst;
 const netSgst = totalSgst - inputSgst;
 const netIgst = totalIgst - inputIgst;
 const gstr3bLiability = netCgst + netSgst + netIgst;

 const { data, error } = await client
 .from("gst_returns")
 .upsert(
 {
 user_id: userId,
 business_id: businessId,
 financial_year: financialYear,
 quarter: quarter as "Q1" | "Q2" | "Q3" | "Q4",
 quarter_start_date: qStart,
 quarter_end_date: qEnd,
 total_taxable_value: totalTaxable,
 total_cgst: totalCgst,
 total_sgst: totalSgst,
 total_igst: totalIgst,
 input_cgst: inputCgst,
 input_sgst: inputSgst,
 input_igst: inputIgst,
 gstr3b_total_liability: gstr3bLiability,
 hsn_summary: [],
 filing_status: "draft" as "draft" | "ready_to_file" | "filed" | "amended",
 },
 { onConflict: "business_id,financial_year,quarter" }
 )
 .select()
 .single();

 if (error) throw new Error(error.message);
 return data;
}

function getQuarterDates(quarter: string, financialYear: string): [string, string, string, string] {
 const [startYear] = financialYear.split("-").map(Number);
 const qMap: Record<string, [number, number]> = {
 Q1: [startYear, 3], // Apr-Jun
 Q2: [startYear, 6], // Jul-Sep
 Q3: [startYear, 9], // Oct-Dec
 Q4: [startYear + 1, 0], // Jan-Mar next year
 };
 const [y, m] = qMap[quarter] || [startYear, 3];
 const start = new Date(y, m - 1, 1);
 const end = new Date(y, m + 2, 0);
 return [start.toISOString().split("T")[0], end.toISOString().split("T")[0]];
}
