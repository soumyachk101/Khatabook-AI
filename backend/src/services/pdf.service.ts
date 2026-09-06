import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabase } from "../utils/supabase";
import { Storage } from "../utils/storage";
import { Invoice } from "../types";

/**
 * PDF Generation Service — creates professional invoice PDFs
 */
export class PDFService {
 /**
 * Generate invoice PDF and upload to storage
 */
 async generateInvoicePDF(invoice: Invoice): Promise<string> {
 const pdfDoc = await PDFDocument.create();
 const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
 const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
 const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

 // Colors
 const primaryColor = rgb(0.1, 0.3, 0.6);
 const textColor = rgb(0.2, 0.2, 0.2);
 const lightGray = rgb(0.95, 0.95, 0.95);

 let yPos = 780;

 // ---- Header ----
 // Business info (left)
 page.drawText("INVOICE", { x: 50, y: yPos, size: 24, font: boldFont, color: primaryColor });
 yPos -= 30;

 // Invoice details (right)
 page.drawText(`Invoice #: ${invoice.invoice_number}`, { x: 350, y: yPos, size: 10, font });
 page.drawText(`Date: ${invoice.invoice_date}`, { x: 350, y: yPos - 15, size: 10, font });
 page.drawText(`Due Date: ${invoice.due_date}`, { x: 350, y: yPos - 30, size: 10, font });

 yPos -= 70;

 // ---- From / To ----
 // From
 page.drawText("FROM:", { x: 50, y: yPos, size: 10, font: boldFont, color: primaryColor });
 yPos -= 20;
 page.drawText("Your Business Name", { x: 50, y: yPos, size: 10, font });
 yPos -= 15;
 page.drawText("Business Address", { x: 50, y: yPos, size: 9, font, color: textColor });
 yPos -= 30;

 // To
 page.drawText("BILL TO:", { x: 50, y: yPos, size: 10, font: boldFont, color: primaryColor });
 yPos -= 20;
 page.drawText(invoice.client_name, { x: 50, y: yPos, size: 10, font });
 yPos -= 15;
 if (invoice.client_email) {
 page.drawText(invoice.client_email, { x: 50, y: yPos, size: 9, font, color: textColor });
 yPos -= 15;
 }
 if (invoice.client_gstin) {
 page.drawText(`GSTIN: ${invoice.client_gstin}`, { x: 50, y: yPos, size: 9, font, color: textColor });
 yPos -= 15;
 }

 yPos -= 30;

 // ---- Line Items Table ----
 const tableTop = yPos;
 const colX = [50, 280, 330, 380, 430, 480];
 const rowHeight = 20;
 const colLabels = ["Description", "HSN", "Qty", "Rate", "GST%", "Amount"];

 // Table header
 page.drawRectangle({ x: 50, y: tableTop - 5, width: 450, height: 20, color: primaryColor });
 for (let i = 0; i < colLabels.length; i++) {
 page.drawText(colLabels[i], { x: colX[i] + 2, y: tableTop, size: 8, font: boldFont, color: rgb(1, 1, 1) });
 }

 // Table rows
 let rowY = tableTop - 20;
 const items = (invoice.line_items as Array<Record<string, unknown>>) || [];
 for (const item of items) {
 if (rowY < 150) break; // Don't overflow page
 page.drawRectangle({ x: 50, y: rowY - 5, width: 450, height: rowHeight, color: lightGray });
 page.drawText(String(item.description || "").slice(0, 40), { x: colX[0] + 2, y: rowY, size: 8, font });
 page.drawText(String(item.hsn_code || ""), { x: colX[1] + 2, y: rowY, size: 8, font });
 page.drawText(String(item.quantity || 1), { x: colX[2] + 2, y: rowY, size: 8, font });
 page.drawText(`Rs. ${Number(item.unit_price || 0).toFixed(2)}`, { x: colX[3] + 2, y: rowY, size: 8, font });
 page.drawText(`${item.gst_rate || 0}%`, { x: colX[4] + 2, y: rowY, size: 8, font });
 page.drawText(`Rs. ${Number(item.total || 0).toFixed(2)}`, { x: colX[5] + 2, y: rowY, size: 8, font });
 rowY -= rowHeight;
 }

 yPos = rowY - 20;

 // ---- Totals ----
 const totalsStart = yPos;
 const labelX = 400;
 const valueX = 460;

 page.drawText("Subtotal:", { x: labelX, y: yPos, size: 10, font });
 page.drawText(`Rs. ${Number(invoice.sub_total).toFixed(2)}`, { x: valueX, y: yPos, size: 10, font });
 yPos -= 18;

 if ((invoice.cgst_amount || 0) > 0) {
 page.drawText("CGST:", { x: labelX, y: yPos, size: 10, font });
 page.drawText(`Rs. ${Number(invoice.cgst_amount).toFixed(2)}`, { x: valueX, y: yPos, size: 10, font });
 yPos -= 18;
 }
 if ((invoice.sgst_amount || 0) > 0) {
 page.drawText("SGST:", { x: labelX, y: yPos, size: 10, font });
 page.drawText(`Rs. ${Number(invoice.sgst_amount).toFixed(2)}`, { x: valueX, y: yPos, size: 10, font });
 yPos -= 18;
 }
 if ((invoice.igst_amount || 0) > 0) {
 page.drawText("IGST:", { x: labelX, y: yPos, size: 10, font });
 page.drawText(`Rs. ${Number(invoice.igst_amount).toFixed(2)}`, { x: valueX, y: yPos, size: 10, font });
 yPos -= 18;
 }

 // Grand Total (highlighted)
 page.drawRectangle({ x: 395, y: yPos - 5, width: 110, height: 22, color: primaryColor });
 page.drawText("GRAND TOTAL:", { x: labelX, y: yPos, size: 11, font: boldFont, color: rgb(1, 1, 1) });
 page.drawText(`Rs. ${Number(invoice.grand_total).toFixed(2)}`, { x: valueX, y: yPos, size: 11, font: boldFont, color: rgb(1, 1, 1) });

 yPos -= 50;

 // ---- Notes ----
 if (invoice.notes) {
 page.drawText("Notes:", { x: 50, y: yPos, size: 9, font: boldFont, color: primaryColor });
 yPos -= 15;
 const maxWidth = 500;
 const words = invoice.notes.split(" ");
 let line = "";
 for (const word of words) {
 const testLine = line + word + " ";
 const testWidth = boldFont.widthOfTextAtSize(testLine, 9);
 if (testWidth > maxWidth) {
 page.drawText(line.trim(), { x: 50, y: yPos, size: 9, font, color: textColor });
 yPos -= 14;
 line = word + " ";
 } else {
 line = testLine;
 }
 }
 if (line.trim()) {
 page.drawText(line.trim(), { x: 50, y: yPos, size: 9, font, color: textColor });
 }
 }

 // ---- Footer ----
 yPos = 60;
 page.drawLine({
 x1: 50,
 y1: yPos,
 x2: 545,
 y2: yPos,
 thickness: 1,
 color: primaryColor,
 });
 yPos -= 15;
 page.drawText(
 "Thank you for your business!",
 { x: 50, y: yPos, size: 9, font, color: textColor }
 );

 // Serialize PDF
 const pdfBytes = await pdfDoc.save();

 // Upload to Supabase Storage
 const path = `invoices/${invoice.id}.pdf`;
 const { error } = await supabase.storage
 .from("invoices")
 .upload(path, Buffer.from(pdfBytes), {
 contentType: "application/pdf",
 upsert: true,
 });

 if (error) {
 throw new Error(`Failed to upload PDF: ${error.message}`);
 }

 // Update invoice with PDF URL
 const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(path);

 await supabase
 .from("invoices")
 .update({ pdf_url: urlData.publicUrl })
 .eq("id", invoice.id);

 return urlData.publicUrl;
 }

 /**
 * Generate PDF and return as buffer
 */
 async generateInvoicePDFBuffer(invoice: Invoice): Promise<Buffer> {
 const pdfDoc = await PDFDocument.create();
 const page = pdfDoc.addPage([595.28, 841.89]);
 const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
 const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

 const primaryColor = rgb(0.1, 0.3, 0.6);
 const textColor = rgb(0.2, 0.2, 0.2);

 // Simplified PDF content (same logic as above, abbreviated)
 page.drawText("INVOICE", { x: 50, y: 780, size: 24, font: boldFont, color: primaryColor });
 page.drawText(`Invoice #: ${invoice.invoice_number}`, { x: 350, y: 770, size: 10, font });
 page.drawText(`Date: ${invoice.invoice_date}`, { x: 350, y: 755, size: 10, font });
 page.drawText(`Due Date: ${invoice.due_date}`, { x: 350, y: 740, size: 10, font });
 page.drawText(`Client: ${invoice.client_name}`, { x: 50, y: 700, size: 10, font });

 if (invoice.client_email) {
 page.drawText(invoice.client_email, { x: 50, y: 685, size: 9, font, color: textColor });
 }

 // Line items
 let yPos = 660;
 page.drawText("Description", { x: 50, y: yPos, size: 10, font: boldFont });
 page.drawText("Qty", { x: 280, y: yPos, size: 10, font: boldFont });
 page.drawText("Rate", { x: 330, y: yPos, size: 10, font: boldFont });
 page.drawText("Amount", { x: 420, y: yPos, size: 10, font: boldFont });
 yPos -= 20;

 const items = (invoice.line_items as Array<Record<string, unknown>>) || [];
 for (const item of items) {
 const desc = String(item.description || "").slice(0, 50);
 page.drawText(desc, { x: 50, y: yPos, size: 9, font });
 page.drawText(String(item.quantity || 1), { x: 280, y: yPos, size: 9, font });
 page.drawText(`Rs. ${Number(item.unit_price || 0).toFixed(2)}`, { x: 330, y: yPos, size: 9, font });
 page.drawText(`Rs. ${Number(item.total || 0).toFixed(2)}`, { x: 420, y: yPos, size: 9, font });
 yPos -= 18;
 }

 yPos -= 15;
 page.drawText(`Subtotal: Rs. ${Number(invoice.sub_total).toFixed(2)}`, { x: 350, y: yPos, size: 10, font });
 yPos -= 18;
 if (invoice.cgst_amount) {
 page.drawText(`CGST: Rs. ${Number(invoice.cgst_amount).toFixed(2)}`, { x: 350, y: yPos, size: 10, font });
 yPos -= 18;
 }
 if (invoice.sgst_amount) {
 page.drawText(`SGST: Rs. ${Number(invoice.sgst_amount).toFixed(2)}`, { x: 350, y: yPos, size: 10, font });
 yPos -= 18;
 }

 // Grand total highlight
 page.drawRectangle({ x: 380, y: yPos - 3, width: 120, height: 20, color: primaryColor });
 page.drawText("TOTAL:", { x: 400, y: yPos, size: 11, font: boldFont, color: rgb(1, 1, 1) });
 page.drawText(`Rs. ${Number(invoice.grand_total).toFixed(2)}`, { x: 460, y: yPos, size: 11, font: boldFont, color: rgb(1, 1, 1) });

 // Footer
 page.drawLine({ x1: 50, y1: 80, x2: 545, y2: 80, thickness: 1, color: primaryColor });
 page.drawText("Thank you for your business!", { x: 50, y: 60, size: 9, font, color: textColor });

 const pdfBytes = await pdfDoc.save();
 return Buffer.from(pdfBytes);
 }
}

export const pdfService = new PDFService();
