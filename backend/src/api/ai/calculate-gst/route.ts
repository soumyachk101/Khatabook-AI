import { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';
import { computeGSTBreakdown, validateGSTIN, type GstRate } from '../../services/ai/gst-calculator';

/**
 * POST /api/ai/calculate-gst
 *
 * Calculates CGST/SGST/IGST split for a given subtotal and GST rate.
 *
 * Body: {
 * subtotal: number;
 * gstRate: number;
 * supplierGstin?: string;
 * recipientGstin?: string;
 * placeOfSupply?: string;
 * }
 */
export function calculateGstRoute(req: Request, res: Response): void {
 authMiddleware(req, res, () => {
 try {
 const { subtotal, gstRate, supplierGstin, recipientGstin, placeOfSupply } = req.body;

 if (typeof subtotal !== 'number' || subtotal < 0) {
 return errorResponse(res, 'VALIDATION_ERROR', 'subtotal must be a non-negative number', 422);
 }

 if (typeof gstRate !== 'number') {
 return errorResponse(res, 'VALIDATION_ERROR', 'gstRate is required and must be a number', 422);
 }

 // Validate the GSTIN if provided
 let supplierStateCode: string | undefined;
 let recipientStateCode: string | undefined;

 if (supplierGstin) {
 const validation = validateGSTIN(supplierGstin);
 if (!validation.valid) {
 return errorResponse(res, 'INVALID_GSTIN', `Invalid supplier GSTIN: ${validation.reason}`, 422);
 }
 supplierStateCode = supplierGstin.slice(0, 2);
 }

 if (recipientGstin) {
 const validation = validateGSTIN(recipientGstin);
 if (!validation.valid) {
 return errorResponse(res, 'INVALID_GSTIN', `Invalid recipient GSTIN: ${validation.reason}`, 422);
 }
 recipientStateCode = recipientGstin.slice(0, 2);
 }

 const result = computeGSTBreakdown({
 subtotal,
 gstRate: gstRate as GstRate,
 placeOfSupply,
 supplierGstin,
 recipientGstin,
 });

 return successResponse(res, result);
 } catch (err: unknown) {
 console.error('GST calculation error:', err);
 return errorResponse(res, 'CALCULATION_ERROR', err instanceof Error ? err.message : 'GST calculation failed', 500);
 }
 });
}
