/**
 * GST Calculator
 *
 * Computes CGST / SGST / IGST split from invoice totals, validates GSTINs,
 * determines inter/intra-state applicability, and prepares GSTR-1 / GSTR-3B entries.
 */

import { GST_VALIDATION, GST_RATES, type GstRate } from '@/types/ai';
import { isInterstate, STATES_BY_GST_CODE, type IndianState } from '@/types/ai';
import type { GSTDetail, GSTR1Entry, GSTR3BSummary, ReceiptExtraction } from '@/types/ai';

// ─── Validation ────────────────────────────────────────────────────────────────

export function validateGSTIN(gstin: string): { valid: boolean; reason?: string } {
 const cleaned = gstin.trim().toUpperCase();

 if (cleaned.length !== GST_VALIDATION.GSTIN_LENGTH) {
 return { valid: false, reason: `GSTIN must be ${GST_VALIDATION.GSTIN_LENGTH} characters` };
 }

 if (!GST_VALIDATION.GSTIN_REGEX.test(cleaned)) {
 return { valid: false, reason: 'Invalid GSTIN format. Expected: 2-digit state + 5-letter PAN + 4-digit entity + 1-char entity + 1-char Z + 1-char checksum' };
 }

 const stateCode = cleaned.slice(0, GST_VALIDATION.STATE_CODE_LENGTH);
 const state = STATES_BY_GST_CODE.get(stateCode);
 if (!state) {
 return { valid: false, reason: `Unknown state GST code: ${stateCode}` };
 }

 const pan = cleaned.slice(GST_VALIDATION.PAN_OFFSET, GST_VALIDATION.PAN_OFFSET + GST_VALIDATION.PAN_LENGTH);
 if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
 return { valid: false, reason: 'Invalid PAN segment within GSTIN' };
 }

 return { valid: true };
}

export function extractStateFromGSTIN(gstin: string): string | null {
 const cleaned = gstin.trim().toUpperCase();
 if (cleaned.length < GST_VALIDATION.STATE_CODE_LENGTH) return null;
 const stateCode = cleaned.slice(0, GST_VALIDATION.STATE_CODE_LENGTH);
 return STATES_BY_GST_CODE.get(stateCode)?.name ?? null;
}

// ─── GST Computation ──────────────────────────────────────────────────────────

export function computeGSTBreakdown(params: {
 subtotal: number;
 gstRate: GstRate;
 placeOfSupply?: string;
 supplierGstin?: string;
 recipientGstin?: string;
 currency?: string;
}): GSTDetail {
 const { subtotal, gstRate, placeOfSupply, supplierGstin, recipientGstin } = params;

 const supplierStateCode = supplierGstin?.slice(0, 2) ?? '';
 const recipientStateCode = recipientGstin?.slice(0, 2) ?? '';

 const effectivePlaceOfSupply = placeOfSupply
 ?? (recipientStateCode ? STATES_BY_GST_CODE.get(recipientStateCode)?.name ?? null : null)
 ?? (supplierStateCode ? STATES_BY_GST_CODE.get(supplierStateCode)?.name ?? null : null)
 ?? null;

 const interstate = isInterstate(supplierStateCode, recipientStateCode);

 if (interstate) {
 // IGST: full rate on full subtotal
 const igstAmount = roundToTwo(subtotal * (gstRate / 100));
 return {
 vendorGstin: recipientGstin ?? supplierGstin ?? '',
 placeOfSupply: effectivePlaceOfSupply ?? 'Unknown',
 placeOfSupplyState: effectivePlaceOfSupply ?? 'Unknown',
 isInterstate: true,
 subTotal: roundToTwo(subtotal),
 cgstAmount: 0,
 sgstAmount: 0,
 igstAmount,
 totalTax: igstAmount,
 gstRate,
 hsnCode: null,
 };
 }

 // Intra-state: split equally into CGST + SGST
 const halfRate = gstRate / 2;
 const cgstAmount = roundToTwo(subtotal * (halfRate / 100));
 const sgstAmount = roundToTwo(subtotal * (halfRate / 100));
 const totalTax = roundToTwo(cgstAmount + sgstAmount);

 return {
 vendorGstin: recipientGstin ?? supplierGstin ?? '',
 placeOfSupply: effectivePlaceOfSupply ?? 'Unknown',
 placeOfSupplyState: effectivePlaceOfSupply ?? 'Unknown',
 isInterstate: false,
 subTotal: roundToTwo(subtotal),
 cgstAmount,
 sgstAmount,
 igstAmount: 0,
 totalTax,
 gstRate,
 hsnCode: null,
 };
}

export function computeGSTFromExtraction(extraction: ReceiptExtraction): GSTDetail | null {
 const subtotal = extraction.subTotal ?? 0;
 const totalTax = (extraction.cgstAmount ?? 0) + (extraction.sgstAmount ?? 0) + (extraction.igstAmount ?? 0);
 if (subtotal <= 0 || totalTax <= 0) return null;

 // Infer the combined rate from the actual tax
 const effectiveRate = Math.round((totalTax / subtotal) * 100);
 const rate = GST_RATES.includes(effectiveRate as GstRate) ? (effectiveRate as GstRate) : 18;

 return computeGSTBreakdown({
 subtotal,
 gstRate: rate,
 supplierGstin: extraction.vendorGstin ?? undefined,
 recipientGstin: undefined,
 });
}

// ─── Line-item tax calculation ─────────────────────────────────────────────────

export function computeLineItemTax(lineItems: Array<{ amount: number; gstRate?: number }>): number {
 return lineItems.reduce((sum, item) => {
 const rate = typeof item.gstRate === 'number' ? item.gstRate : 0;
 return sum + roundToTwo(item.amount * (rate / 100));
 }, 0);
}

// ─── GSTR-1 Entry Builder ──────────────────────────────────────────────────────

export function buildGSTR1Entry(params: {
 invoiceNumber: string;
 invoiceDate: string;
 recipientGstin: string;
 recipientName: string;
 placeOfSupply: string;
 taxableValue: number;
 gstDetail: GSTDetail;
 invoiceType?: GSTR1Entry['invoiceType'];
 hsnCode?: string | null;
}): GSTR1Entry {
 const { invoiceNumber, invoiceDate, recipientGstin, recipientName, placeOfSupply, taxableValue, gstDetail, invoiceType = 'B2B', hsnCode } = params;

 return {
 invoiceNumber,
 invoiceDate,
 recipientGstin,
 recipientName,
 placeOfSupply,
 taxableValue: roundToTwo(taxableValue),
 cgst: roundToTwo(gstDetail.cgstAmount),
 sgst: roundToTwo(gstDetail.sgstAmount),
 igst: roundToTwo(gstDetail.igstAmount),
 cess: 0,
 invoiceType,
 hsnCode: hsnCode ?? gstDetail.hsnCode,
 };
}

// ─── GSTR-3B Summary Builder ───────────────────────────────────────────────────

export function buildGSTR3BSummary(params: {
 gstr1Entries: GSTR1Entry[];
 inputTaxCredits: { inputCgst: number; inputSgst: number; inputIgst: number };
 outwardCess: number;
 inwardCess: number;
}): GSTR3BSummary {
 const outwardTaxable = params.gstr1Entries.reduce((sum, e) => sum + e.taxableValue, 0);
 const outwardIgst = params.gstr1Entries.reduce((sum, e) => sum + e.igst, 0);
 const totalOutCgst = params.gstr1Entries.reduce((sum, e) => sum + e.cgst, 0);
 const totalOutSgst = params.gstr1Entries.reduce((sum, e) => sum + e.sgst, 0);

 const netCgst = roundToTwo(totalOutCgst - params.inputTaxCredits.inputCgst);
 const netSgst = roundToTwo(totalOutSgst - params.inputTaxCredits.inputSgst);
 const netIgst = roundToTwo(outwardIgst - params.inputTaxCredits.inputIgst);
 const totalLiability = roundToTwo(netCgst + netSgst + netIgst);

 return {
 outwardTaxable: roundToTwo(outwardTaxable),
 outwardIgst: roundToTwo(outwardIgst),
 outwardCess: roundToTwo(params.outwardCess),
 inwardTaxable: 0,
 inputCgst: roundToTwo(params.inputTaxCredits.inputCgst),
 inputSgst: roundToTwo(params.inputTaxCredits.inputSgst),
 inputIgst: roundToTwo(params.inputTaxCredits.inputIgst),
 inputCess: roundToTwo(params.inwardCess),
 netCgstLiability: netCgst,
 netSgstLiability: netSgst,
 netIgstLiability: netIgst,
 totalLiability,
 };
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function roundToTwo(value: number): number {
 return Math.round(value * 100) / 100;
}
