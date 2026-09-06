import { GSTReturn } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { supabaseAdmin } from '../utils/storage';

// ============================================================
// Helper: Get quarter date range
// ============================================================

function getQuarterDates(quarter: string): { start: string; end: string } {
 const quarterStarts: Record<string, { month: number; day: number }> = {
 Q1: { month: 3, day: 1 }, // Apr 1
 Q2: { month: 6, day: 1 }, // Jul 1
 Q3: { month: 9, day: 1 }, // Oct 1
 Q4: { month: 0, day: 1 }, // Jan 1
 };

 const quarterEnds: Record<string, { month: number; day: number }> = {
 Q1: { month: 5, day: 30 }, // Jun 30
 Q2: { month: 8, day: 30 }, // Sep 30
 Q3: { month: 11, day: 31 }, // Dec 31
 Q4: { month: 2, day: 31 }, // Mar 31
 };

 const start = quarterStarts[quarter];
 const end = quarterEnds[quarter];

 return {
 start: new Date(2025, start.month, start.day).toISOString().split('T')[0],
 end: new Date(2025, end.month, end.day).toISOString().split('T')[0],
 };
}

// ============================================================
// Routes
// ============================================================

export async function handleGSTSummary(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const { business_id, financial_year, quarter } = req.query;

 if (!business_id || !financial_year || !quarter) {
 return errorResponse(res, 'VALIDATION_ERROR', 'business_id, financial_year, and quarter are required', 422);
 }

 const { start, end } = getQuarterDates(quarter as string);

 // Get invoices (outward supplies)
 let invoicesQuery = supabaseAdmin
 .from('invoices')
 .select('grand_total, cgst_amount, sgst_amount, igst_amount, cess_amount, sub_total, status')
 .eq('user_id', userId)
 .eq('business_id', business_id)
 .gte('invoice_date', start)
 .lte('invoice_date', end)
 .in('status', ['sent', 'viewed', 'partial', 'paid']);

 const { data: invoices, error: invError } = await invoicesQuery;

 if (invError) {
 return errorResponse(res, 'DATABASE_ERROR', invError.message, 500);
 }

 // Get expenses (inward supplies / ITC)
 let expensesQuery = supabaseAdmin
 .from('expenses')
 .select('amount, cgst_amount, sgst_amount, igst_amount, gst_applicable, status')
 .eq('user_id', userId)
 .eq('business_id', business_id)
 .gte('expense_date', start)
 .lte('expense_date', end)
 .is('deleted_at', null)
 .eq('gst_applicable', true);

 const { data: expenses, error: expError } = await expensesQuery;

 if (expError) {
 return errorResponse(res, 'DATABASE_ERROR', expError.message, 500);
 }

 const totalTaxableValue = (invoices || []).reduce((sum, i) => sum + (i.sub_total || 0), 0);
 const totalCGST = (invoices || []).reduce((sum, i) => sum + (i.cgst_amount || 0), 0);
 const totalSGST = (invoices || []).reduce((sum, i) => sum + (i.sgst_amount || 0), 0);
 const totalIGST = (invoices || []).reduce((sum, i) => sum + (i.igst_amount || 0), 0);
 const totalCess = (invoices || []).reduce((sum, i) => sum + (i.cess_amount || 0), 0);

 const inputCGST = (expenses || []).reduce((sum, e) => sum + (e.cgst_amount || 0), 0);
 const inputSGST = (expenses || []).reduce((sum, e) => sum + (e.sgst_amount || 0), 0);
 const inputIGST = (expenses || []).reduce((sum, e) => sum + (e.igst_amount || 0), 0);
 const inputCess = (expenses || []).reduce((sum, e) => sum + (e.cgst_amount || 0), 0); // simplified

 const netCGST = totalCGST - inputCGST;
 const netSGST = totalSGST - inputSGST;
 const netIGST = totalIGST - inputIGST;
 const netPayable = netCGST + netSGST + netIGST;

 return successResponse(res, {
 financial_year,
 quarter,
 period: { from: start, to: end },
 outward_supplies: {
 total_taxable_value: totalTaxableValue,
 total_cgst: totalCGST,
 total_sgst: totalSGST,
 total_igst: totalIGST,
 total_cess: totalCess,
 invoice_count: (invoices || []).length,
 },
 inward_supplies: {
 input_cgst: inputCGST,
 input_sgst: inputSGST,
 input_igst: inputIGST,
 expense_count: (expenses || []).length,
 },
 net_liability: {
 net_cgst: netCGST,
 net_sgst: netSGST,
 net_igst: netIGST,
 total_payable: netPayable,
 },
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to generate summary', 500);
 }
}

export async function handleListGSTReturns(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const { business_id, quarter } = req.query;

 let query = supabaseAdmin
 .from('gst_returns')
 .select('*')
 .eq('user_id', userId as string)
 .order('quarter_start_date', { ascending: false });

 if (business_id) query = query.eq('business_id', business_id as string);
 if (quarter) query = query.eq('quarter', quarter as string);

 const { data, error } = await query;

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, { items: data || [] });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to list returns', 500);
 }
}

export async function handleGetGSTReturn(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data: gstReturn, error } = await supabaseAdmin
 .from('gst_returns')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (error || !gstReturn) {
 return errorResponse(res, 'NOT_FOUND', 'GST return not found', 404);
 }

 return successResponse(res, gstReturn);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch return', 500);
 }
}

export async function handleFileGSTReturn(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;
 const { acknowledgment_number } = req.body;

 const { data: gstReturn, error } = await supabaseAdmin
 .from('gst_returns')
 .update({
 filing_status: 'filed',
 filed_at: new Date().toISOString(),
 acknowledgment_number,
 updated_at: new Date().toISOString(),
 })
 .eq('id', id)
 .eq('user_id', userId)
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, gstReturn);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to file return', 500);
 }
}

export async function handleGenerateGSTR1(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const { business_id, financial_year, quarter } = req.body;

 const { start, end } = getQuarterDates(quarter);

 // Get all invoices in the period
 const { data: invoices, error } = await supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('user_id', userId)
 .eq('business_id', business_id)
 .gte('invoice_date', start)
 .lte('invoice_date', end)
 .in('status', ['sent', 'viewed', 'partial', 'paid']);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 // B2B invoices (with GSTIN)
 const b2bInvoices = (invoices || []).filter((inv) => inv.client_gstin).map((inv) => ({
 invoice_number: inv.invoice_number,
 invoice_date: inv.invoice_date,
 client_gstin: inv.client_gstin,
 client_name: inv.client_name,
 grand_total: inv.grand_total,
 place_of_supply: inv.place_of_supply,
 cgst: inv.cgst_amount,
 sgst: inv.sgst_amount,
 igst: inv.igst_amount,
 }));

 // B2C invoices (without GSTIN)
 const b2cInvoices = (invoices || [])
 .filter((inv) => !inv.client_gstin)
 .map((inv) => ({
 invoice_number: inv.invoice_number,
 invoice_date: inv.invoice_date,
 grand_total: inv.grand_total,
 place_of_supply: inv.place_of_supply,
 }));

 const totalTaxableValue = (invoices || []).reduce((sum, i) => sum + (i.sub_total || 0), 0);
 const totalCGST = (invoices || []).reduce((sum, i) => sum + (i.cgst_amount || 0), 0);
 const totalSGST = (invoices || []).reduce((sum, i) => sum + (i.sgst_amount || 0), 0);
 const totalIGST = (invoices || []).reduce((sum, i) => sum + (i.igst_amount || 0), 0);

 const gstr1Data = {
 period: { financial_year, quarter, from: start, to: end },
 b2b_invoices: b2bInvoices,
 b2c_invoices: b2cInvoices,
 totals: {
 total_taxable_value: totalTaxableValue,
 total_cgst: totalCGST,
 total_sgst: totalSGST,
 total_igst: totalIGST,
 total_invoices: (invoices || []).length,
 },
 };

 // Save as draft
 const { data: gstReturn, error: saveError } = await supabaseAdmin
 .from('gst_returns')
 .upsert({
 user_id: userId,
 business_id,
 financial_year,
 quarter,
 quarter_start_date: start,
 quarter_end_date: end,
 total_taxable_value: totalTaxableValue,
 total_cgst: totalCGST,
 total_sgst: totalSGST,
 total_igst: totalIGST,
 b2b_invoice_count: b2bInvoices.length,
 filing_status: 'draft',
 }, { onConflict: 'business_id,financial_year,quarter' })
 .select()
 .single();

 if (saveError) {
 return errorResponse(res, 'DATABASE_ERROR', saveError.message, 500);
 }

 return successResponse(res, {
 gst_return_id: gstReturn.id,
 gstr1_data: gstr1Data,
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to generate GSTR-1', 500);
 }
}

export async function handleGenerateGSTR3B(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const { business_id, financial_year, quarter } = req.body;

 const { start, end } = getQuarterDates(quarter);

 // Outward supplies (invoices)
 const { data: invoices } = await supabaseAdmin
 .from('invoices')
 .select('sub_total, cgst_amount, sgst_amount, igst_amount, cess_amount')
 .eq('user_id', userId)
 .eq('business_id', business_id)
 .gte('invoice_date', start)
 .lte('invoice_date', end)
 .in('status', ['sent', 'viewed', 'partial', 'paid']);

 // Inward supplies (expenses)
 const { data: expenses } = await supabaseAdmin
 .from('expenses')
 .select('cgst_amount, sgst_amount, igst_amount, gst_applicable')
 .eq('user_id', userId)
 .eq('business_id', business_id)
 .gte('expense_date', start)
 .lte('expense_date', end)
 .is('deleted_at', null)
 .eq('gst_applicable', true);

 const totalTaxableValue = (invoices || []).reduce((sum, i) => sum + (i.sub_total || 0), 0);
 const outputCGST = (invoices || []).reduce((sum, i) => sum + (i.cgst_amount || 0), 0);
 const outputSGST = (invoices || []).reduce((sum, i) => sum + (i.sgst_amount || 0), 0);
 const outputIGST = (invoices || []).reduce((sum, i) => sum + (i.igst_amount || 0), 0);

 const inputCGST = (expenses || []).reduce((sum, e) => sum + (e.cgst_amount || 0), 0);
 const inputSGST = (expenses || []).reduce((sum, e) => sum + (e.sgst_amount || 0), 0);
 const inputIGST = (expenses || []).reduce((sum, e) => sum + (e.igst_amount || 0), 0);

 const gstr3bData = {
 period: { financial_year, quarter, from: start, to: end },
 outward_supplies: {
 total_taxable_value: totalTaxableValue,
 total_cgst: outputCGST,
 total_sgst: outputSGST,
 total_igst: outputIGST,
 },
 inward_supplies_itc: {
 input_cgst: inputCGST,
 input_sgst: inputSGST,
 input_igst: inputIGST,
 },
 net_liability: {
 net_cgst: outputCGST - inputCGST,
 net_sgst: outputSGST - inputSGST,
 net_igst: outputIGST - inputIGST,
 total_payable: (outputCGST - inputCGST) + (outputSGST - inputSGST) + (outputIGST - inputIGST),
 },
 };

 // Save as draft
 const { data: gstReturn, error: saveError } = await supabaseAdmin
 .from('gst_returns')
 .upsert({
 user_id: userId,
 business_id,
 financial_year,
 quarter,
 quarter_start_date: start,
 quarter_end_date: end,
 total_taxable_value: totalTaxableValue,
 total_cgst: outputCGST,
 total_sgst: outputSGST,
 total_igst: outputIGST,
 input_cgst: inputCGST,
 input_sgst: inputSGST,
 input_igst: inputIGST,
 filing_status: 'draft',
 }, { onConflict: 'business_id,financial_year,quarter' })
 .select()
 .single();

 if (saveError) {
 return errorResponse(res, 'DATABASE_ERROR', saveError.message, 500);
 }

 return successResponse(res, {
 gst_return_id: gstReturn.id,
 gstr3b_data: gstr3bData,
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to generate GSTR-3B', 500);
 }
}
