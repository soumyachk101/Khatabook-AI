import OpenAI from 'openai';
import { successResponse, errorResponse } from '../utils/response';
import { supabaseAdmin } from '../utils/storage';

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
});

const PRIMARY_MODEL = process.env.OPENAI_PRIMARY_MODEL || 'gpt-4o';
const FALLBACK_MODEL = process.env.OPENAI_FALLBACK_MODEL || 'gpt-4o-mini';

// ============================================================
// Categorizer
// ============================================================

const CATEGORY_PROMPT = `
You are an expense categorization AI for Indian freelancers and small businesses.
Categorize the given receipt into ONE of these categories:
- Sales / Revenue
- Professional Fees (Consulting, Advisory, Contract work)
- Travel (Flight, Train, Bus, Taxi, Fuel, Parking)
- Food & Dining (Restaurant, Café, Groceries, Food delivery)
- Office Supplies (Stationery, Printer, Paper)
- Software & SaaS (Subscriptions, Hosting, Domain)
- Utilities (Electricity, Internet, Phone, Water)
- Equipment (Laptop, Monitor, Furniture)
- Marketing & Advertising
- Salary & Wages
- Rent & Office Space
- Insurance
- Courier & Shipping
- Training & Education
- Other

Return JSON: { "category": "...", "confidence": 0.0-1.0, "alternatives": [{"name": "...", "confidence": 0.0-1.0}] }
`;

// ============================================================
// GST Extractor
// ============================================================

const GST_EXTRACTOR_PROMPT = `
Extract GST details from the given Indian receipt data. Return JSON:
{
 "gst_details": {
 "cgst": [{"rate": 9, "amount": 90.00}],
 "sgst": [{"rate": 9, "amount": 90.00}],
 "igst": [{"rate": 0, "amount": 0.00}],
 "total_tax": 180.00
 },
 "vendor_gstin": "15-digit GSTIN or null",
 "is_interstate": false,
 "confidence": 0.0-1.0
}
`;

// ============================================================
// Item Suggestion
// ============================================================

const ITEM_SUGGESTION_PROMPT = (description: string) => `
Given this service description from an Indian freelancer/business: "${description}"

Suggest appropriate HSN/SAC codes and rates:
- Web Development: HSN 998314, GST 18% (9% CGST + 9% SGST)
- Graphic Design: HSN 998382, GST 18%
- Content Writing: HSN 998399, GST 18%
- Digital Marketing: HSN 998399, GST 18%
- Accounting: HSN 998260, GST 18%
- Legal: HSN 998261, GST 18%
- Coaching: SAC 999293, GST 18%
- Photography: HSN 998722, GST 18%

Return JSON:
{
 "suggestions": [
 {
 "description": "Suggested description",
 "hsn_sac": "code",
 "suggested_rate": 5000,
 "suggested_unit": "project",
 "cgst_rate": 9,
 "sgst_rate": 9,
 "igst_rate": 0
 }
 ]
}
`;

// ============================================================
// Service Functions
// ============================================================

export async function handleCategorize(
 req: any,
 res: any
): Promise<any> {
 try {
 const { receipt_id } = req.body;

 const { data: receipt, error } = await supabaseAdmin
 .from('receipts')
 .select('*')
 .eq('id', receipt_id)
 .single();

 if (error || !receipt) {
 return errorResponse(res, 'NOT_FOUND', 'Receipt not found', 404);
 }

 const response = await openai.chat.completions.create({
 model: FALLBACK_MODEL,
 messages: [
 { role: 'system', content: CATEGORY_PROMPT },
 {
 role: 'user',
 content: JSON.stringify({
 vendor: receipt.vendor_name,
 line_items: receipt.line_items,
 amount: receipt.total_amount,
 }),
 },
 ],
 response_format: { type: 'json_object' },
 temperature: 0,
 });

 const result = JSON.parse(response.choices[0].message!.content);

 return successResponse(res, {
 category: result.category,
 confidence: result.confidence,
 alternatives: result.alternatives || [],
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Categorization failed', 500);
 }
}

export async function handleExtractGST(
 req: any,
 res: any
): Promise<any> {
 try {
 const { receipt_id } = req.body;

 const { data: receipt, error } = await supabaseAdmin
 .from('receipts')
 .select('*')
 .eq('id', receipt_id)
 .single();

 if (error || !receipt) {
 return errorResponse(res, 'NOT_FOUND', 'Receipt not found', 404);
 }

 const response = await openai.chat.completions.create({
 model: FALLBACK_MODEL,
 messages: [
 { role: 'system', content: GST_EXTRACTOR_PROMPT },
 {
 role: 'user',
 content: JSON.stringify({
 vendor: receipt.vendor_name,
 amount: receipt.total_amount,
 subtotal: receipt.sub_total,
 cgst: receipt.cgst_amount,
 sgst: receipt.sgst_amount,
 igst: receipt.igst_amount,
 line_items: receipt.line_items,
 }),
 },
 ],
 response_format: { type: 'json_object' },
 temperature: 0,
 });

 const result = JSON.parse(response.choices[0].message!.content);

 return successResponse(res, result);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'GST extraction failed', 500);
 }
}

export async function handleSuggestItems(
 req: any,
 res: any
): Promise<any> {
 try {
 const { description } = req.body;

 const response = await openai.chat.completions.create({
 model: FALLBACK_MODEL,
 messages: [
 { role: 'user', content: ITEM_SUGGESTION_PROMPT(description) },
 ],
 response_format: { type: 'json_object' },
 temperature: 0.3,
 });

 const result = JSON.parse(response.choices[0].message!.content);

 return successResponse(res, result);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Suggestion failed', 500);
 }
}
