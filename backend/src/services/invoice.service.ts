import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Invoice, InvoiceLineItem } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { supabaseAdmin } from '../utils/storage';
import { AppError } from '../middleware/error-handler';
import { invoiceCreateSchema } from '../utils/validators';
import { z } from 'zod';

// ============================================================
// Invoice Number Generation
// ============================================================

async function getNextInvoiceNumber(businessId: string): Promise<string> {
 // Use atomic increment
 const { data, error } = await supabaseAdmin.rpc('increment_invoice_counter', {
 p_business_id: businessId,
 });

 if (error || !data) {
 // Fallback: read counter and update
 const { data: business } = await supabaseAdmin
 .from('businesses')
 .select('invoice_number_counter, default_invoice_prefix')
 .eq('id', businessId)
 .single();

 const prefix = business?.default_invoice_prefix || 'INV';
 const nextNumber = (business?.invoice_number_counter || 0) + 1;

 await supabaseAdmin
 .from('businesses')
 .update({ invoice_number_counter: nextNumber })
 .eq('id', businessId);

 return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
 }

 return data;
}

// ============================================================
// PDF Generation
// ============================================================

async function generateInvoicePDF(invoice: Invoice, business: any): Promise<Buffer> {
 const pdfDoc = await PDFDocument.create();
 const page = pdfDoc.addPage([595.28, 841.89]); // A4
 const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
 const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

 const { width, height } = page.getSize();
 let y = height - 50;

 // Header - Business name
 page.drawText(business.name || 'Business Name', {
 x: 50,
 y,
 size: 18,
 font: boldFont,
 color: rgb(0.1, 0.1, 0.1),
 });
 y -= 20;

 if (business.address_line1) {
 page.drawText(business.address_line1, { x: 50, y, size: 9, font });
 y -= 12;
 }
 if (business.city) {
 page.drawText(`${business.city}, ${business.state} - ${business.pincode || ''}`, {
 x: 50,
 y,
 size: 9,
 font,
 });
 y -= 12;
 }
 if (business.gstin) {
 page.drawText(`GSTIN: ${business.gstin}`, { x: 50, y, size: 9, font });
 y -= 12;
 }

 // TAX INVOICE title
 page.drawText('TAX INVOICE', {
 x: width - 200,
 y: height - 50,
 size: 18,
 font: boldFont,
 color: rgb(0.1, 0.1, 0.1),
 });

 y = height - 130;

 // Invoice details (right side)
 page.drawText(`Invoice #: ${invoice.invoice_number}`, {
 x: width - 200,
 y: y,
 size: 10,
 font: boldFont,
 });
 y -= 14;
 page.drawText(`Date: ${invoice.invoice_date}`, {
 x: width - 200,
 y: y,
 size: 10,
 font,
 });
 y -= 14;
 page.drawText(`Due: ${invoice.due_date}`, {
 x: width - 200,
 y: y,
 size: 10,
 font,
 });

 // Bill To section
 y = height - 160;
 page.drawText('BILL TO', { x: 50, y, size: 10, font: boldFont });
 y -= 14;
 page.drawText(invoice.client_name, { x: 50, y, size: 11, font: boldFont });
 y -= 14;
 if (invoice.client_email) {
 page.drawText(invoice.client_email, { x: 50, y, size: 9, font });
 y -= 12;
 }
 if (invoice.client_gstin) {
 page.drawText(`GSTIN: ${invoice.client_gstin}`, { x: 50, y, size: 9, font });
 y -= 12;
 }

 y -= 20;

 // Line items header
 page.drawLine({
 start: { x: 50, y },
 end: { x: width - 50, y },
 thickness: 1,
 color: rgb(0, 0, 0),
 });
 y -= 16;

 page.drawText('#', { x: 50, y, size: 9, font: boldFont });
 page.drawText('Description', { x: 70, y, size: 9, font: boldFont });
 page.drawText('Qty', { x: 280, y, size: 9, font: boldFont });
 page.drawText('Rate', { x: 320, y, size: 9, font: boldFont });
 page.drawText('GST%', { x: 380, y, size: 9, font: boldFont });
 page.drawText('Total', { x: 470, y, size: 9, font: boldFont });

 y -= 4;
 page.drawLine({
 start: { x: 50, y },
 end: { x: width - 50, y },
 thickness: 1,
 color: rgb(0, 0, 0),
 });
 y -= 16;

 // Line items
 invoice.line_items.forEach((item, i) => {
 page.drawText(String(i + 1), { x: 50, y, size: 9, font });
 page.drawText(item.description.substring(0, 30), { x: 70, y, size: 9, font });
 page.drawText(String(item.quantity), { x: 280, y, size: 9, font });
 page.drawText(`₹${item.unit_price.toFixed(2)}`, { x: 320, y, size: 9, font });
 page.drawText(`${item.gst_rate}%`, { x: 380, y, size: 9, font });
 page.drawText(`₹${item.total.toFixed(2)}`, { x: 470, y, size: 9, font });
 y -= 16;
 });

 // Totals
 y -= 20;
 const totalsX = width - 200;
 page.drawText('Subtotal:', { x: totalsX, y, size: 10, font });
 page.drawText(`₹${invoice.sub_total.toFixed(2)}`, {
 x: totalsX + 80,
 y,
 size: 10,
 font,
 });
 y -= 14;

 if (invoice.cgst_amount > 0) {
 page.drawText('CGST:', { x: totalsX, y, size: 10, font });
 page.drawText(`₹${invoice.cgst_amount.toFixed(2)}`, {
 x: totalsX + 80,
 y,
 size: 10,
 font,
 });
 y -= 14;
 }
 if (invoice.sgst_amount > 0) {
 page.drawText('SGST:', { x: totalsX, y, size: 10, font });
 page.drawText(`₹${invoice.sgst_amount.toFixed(2)}`, {
 x: totalsX + 80,
 y,
 size: 10,
 font,
 });
 y -= 14;
 }
 if (invoice.igst_amount > 0) {
 page.drawText('IGST:', { x: totalsX, y, size: 10, font });
 page.drawText(`₹${invoice.igst_amount.toFixed(2)}`, {
 x: totalsX + 80,
 y,
 size: 10,
 font,
 });
 y -= 14;
 }
 if (invoice.discount_amount > 0) {
 page.drawText('Discount:', { x: totalsX, y, size: 10, font });
 page.drawText(`-₹${invoice.discount_amount.toFixed(2)}`, {
 x: totalsX + 80,
 y,
 size: 10,
 font,
 });
 y -= 14;
 }

 y -= 4;
 page.drawLine({
 start: { x: totalsX, y },
 end: { x: width - 50, y },
 thickness: 1,
 color: rgb(0, 0, 0),
 });
 y -= 16;

 page.drawText('GRAND TOTAL:', { x: totalsX, y, size: 12, font: boldFont });
 page.drawText(`₹${invoice.grand_total.toFixed(2)}`, {
 x: totalsX + 80,
 y,
 size: 12,
 font: boldFont,
 });

 // Notes & Terms
 y -= 60;
 if (invoice.notes) {
 page.drawText('Notes:', { x: 50, y, size: 10, font: boldFont });
 y -= 12;
 page.drawText(invoice.notes, { x: 50, y, size: 9, font, maxWidth: width - 100 });
 y -= 30;
 }

 if (invoice.terms_and_conditions) {
 page.drawText('Terms & Conditions:', { x: 50, y, size: 10, font: boldFont });
 y -= 12;
 page.drawText(invoice.terms_and_conditions, {
 x: 50,
 y,
 size: 8,
 font,
 maxWidth: width - 100,
 });
 }

 const pdfBytes = await pdfDoc.save();
 return Buffer.from(pdfBytes);
}

// ============================================================
// Routes
// ============================================================

export async function handleCreateInvoice(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 if (!userId) {
 return errorResponse(res, 'AUTH_REQUIRED', 'Authentication required', 401);
 }

 // Validate input
 const validated = invoiceCreateSchema.parse(req.body);

 // Generate invoice number if not provided
 let invoiceNumber = validated.invoice_number;
 if (!invoiceNumber) {
 invoiceNumber = await getNextInvoiceNumber(validated.business_id);
 }

 // Create invoice
 const { data: invoice, error } = await supabaseAdmin
 .from('invoices')
 .insert({
 ...validated,
 user_id: userId,
 invoice_number: invoiceNumber,
 invoice_date: validated.invoice_date || new Date().toISOString().split('T')[0],
 })
 .select()
 .single();

 if (error) {
 if (error.code === '23505') {
 return errorResponse(res, 'DUPLICATE_RESOURCE', 'Invoice number already exists for this business', 409);
 }
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, invoice, 201);
 } catch (error) {
 if (error instanceof z.ZodError) {
 return errorResponse(res, 'VALIDATION_ERROR', 'Invalid request body', 422, error.flatten().fieldErrors);
 }
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to create invoice', 500);
 }
}

export async function handleListInvoices(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const {
 page = '1',
 limit = '20',
 business_id,
 status,
 client_gstin,
 from,
 to,
 min_amount,
 max_amount,
 search,
 sort = 'invoice_date',
 order = 'desc',
 } = req.query;

 const pageNum = parseInt(page as string, 10);
 const limitNum = Math.min(parseInt(limit as string, 10), 100);

 let query = supabaseAdmin
 .from('invoices')
 .select('*', { count: 'exact' })
 .eq('user_id', userId as string)
 .order(sort as string, { ascending: order === 'asc' });

 if (business_id) query = query.eq('business_id', business_id as string);
 if (status) query = query.eq('status', status as string);
 if (client_gstin) query = query.eq('client_gstin', client_gstin as string);
 if (from) query = query.gte('invoice_date', from as string);
 if (to) query = query.lte('invoice_date', to as string);
 if (min_amount) query = query.gte('grand_total', parseFloat(min_amount as string));
 if (max_amount) query = query.lte('grand_total', parseFloat(max_amount as string));
 if (search) {
 query = query.or(`invoice_number.ilike.%${search}%,client_name.ilike.%${search}%`);
 }

 const fromIdx = (pageNum - 1) * limitNum;
 const toIdx = fromIdx + limitNum - 1;

 const { data, error, count } = await query.range(fromIdx, toIdx);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, {
 items: data || [],
 pagination: {
 page: pageNum,
 limit: limitNum,
 total: count || 0,
 pages: Math.ceil((count || 0) / limitNum),
 },
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to list invoices', 500);
 }
}

export async function handleGetInvoice(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data: invoice, error } = await supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (error || !invoice) {
 return errorResponse(res, 'NOT_FOUND', 'Invoice not found', 404);
 }

 return successResponse(res, invoice);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch invoice', 500);
 }
}

export async function handleUpdateInvoice(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 // Check if invoice exists
 const { data: existing, error: fetchError } = await supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (fetchError || !existing) {
 return errorResponse(res, 'NOT_FOUND', 'Invoice not found', 404);
 }

 // Don't allow changing invoice_number or business_id after creation
 delete req.body.invoice_number;
 delete req.body.business_id;

 const { data: invoice, error } = await supabaseAdmin
 .from('invoices')
 .update({
 ...req.body,
 updated_at: new Date().toISOString(),
 })
 .eq('id', id)
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, invoice);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to update invoice', 500);
 }
}

export async function handleDeleteInvoice(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 // Check if invoice exists and is draft
 const { data: existing, error: fetchError } = await supabaseAdmin
 .from('invoices')
 .select('status')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (fetchError || !existing) {
 return errorResponse(res, 'NOT_FOUND', 'Invoice not found', 404);
 }

 if (existing.status !== 'draft') {
 return errorResponse(res, 'CONFLICT', 'Only draft invoices can be deleted', 409);
 }

 const { error } = await supabaseAdmin
 .from('invoices')
 .delete()
 .eq('id', id);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, { message: 'Invoice deleted successfully' });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to delete invoice', 500);
 }
}

export async function handleSendInvoice(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;
 const { channel, recipient, message } = req.body;

 // Get invoice
 const { data: invoice, error: fetchError } = await supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (fetchError || !invoice) {
 return errorResponse(res, 'NOT_FOUND', 'Invoice not found', 404);
 }

 // Generate PDF if not already generated
 let pdfUrl = invoice.pdf_url;
 if (!pdfUrl) {
 // Get business info
 const { data: business } = await supabaseAdmin
 .from('businesses')
 .select('*')
 .eq('id', invoice.business_id)
 .single();

 const pdfBuffer = await generateInvoicePDF(invoice, business);

 // Upload PDF to storage
 const fileName = `invoice-${invoice.invoice_number}-${Date.now()}.pdf`;
 const filePath = `${userId}/${fileName}`;

 const { data: upload, error: uploadError } = await supabaseAdmin.storage
 .from('invoices')
 .upload(filePath, pdfBuffer, {
 contentType: 'application/pdf',
 upsert: false,
 });

 if (uploadError) {
 return errorResponse(res, 'STORAGE_ERROR', uploadError.message, 500);
 }

 const {
 data: { publicUrl },
 } = supabaseAdmin.storage.from('invoices').getPublicUrl(upload.path);

 pdfUrl = publicUrl;

 // Save PDF URL
 await supabaseAdmin
 .from('invoices')
 .update({ pdf_url: pdfUrl })
 .eq('id', id);
 }

 // Send via channel
 // TODO: Implement actual email/WhatsApp sending
 console.log(`[Invoice] Sending invoice ${id} via ${channel} to ${recipient}`);

 // Update status
 const { data: updated, error } = await supabaseAdmin
 .from('invoices')
 .update({
 status: 'sent',
 sent_at: new Date().toISOString(),
 updated_at: new Date().toISOString(),
 })
 .eq('id', id)
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, {
 ...updated,
 pdf_url: pdfUrl,
 message: `Invoice sent via ${channel}`,
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to send invoice', 500);
 }
}

export async function handleGetInvoicePDF(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data: invoice, error: fetchError } = await supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (fetchError || !invoice) {
 return errorResponse(res, 'NOT_FOUND', 'Invoice not found', 404);
 }

 // Get business
 const { data: business } = await supabaseAdmin
 .from('businesses')
 .select('*')
 .eq('id', invoice.business_id)
 .single();

 // Generate PDF
 const pdfBuffer = await generateInvoicePDF(invoice, business);

 res.setHeader('Content-Type', 'application/pdf');
 res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoice_number}.pdf"`);
 res.send(pdfBuffer);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to generate PDF', 500);
 }
}
