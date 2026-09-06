import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Payment } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { supabaseAdmin } from '../utils/storage';
import { paymentLinkSchema } from '../utils/validators';
import { z } from 'zod';

// ============================================================
// Razorpay initialization
// ============================================================

const razorpay = new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID || '',
 key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// ============================================================
// Helpers
// ============================================================

function verifyRazorpaySignature(
 orderId: string,
 paymentId: string,
 signature: string
): boolean {
 const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
 const generatedSignature = crypto
 .createHmac('sha256', secret)
 .update(`${orderId}|${paymentId}`)
 .digest('hex');
 return generatedSignature === signature;
}

function verifyWebhookSignature(
 body: string,
 signature: string
): boolean {
 const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
 const expectedSignature = crypto
 .createHmac('sha256', secret)
 .update(body)
 .digest('hex');
 return expectedSignature === signature;
}

// ============================================================
// Routes
// ============================================================

export async function handleCreatePaymentLink(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const validated = paymentLinkSchema.parse(req.body);

 // Get invoice
 const { data: invoice, error: invError } = await supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('id', validated.invoice_id)
 .eq('user_id', userId)
 .single();

 if (invError || !invoice) {
 return errorResponse(res, 'NOT_FOUND', 'Invoice not found', 404);
 }

 // Create Razorpay payment link
 const linkData: any = {
 amount: validated.amount * 100, // Razorpay expects paise
 currency: 'INR',
 accept_partial: false,
 reference_id: invoice.invoice_number,
 description: validated.description || `Payment for invoice ${invoice.invoice_number},
 customer: {
 name: invoice.client_name,
 email: invoice.client_email,
 contact: invoice.client_phone,
 },
 notify: {
 sms: !!invoice.client_phone,
 email: !!invoice.client_email,
 },
 reminder_enable: true,
 };

 if (validated.expires_at) {
 linkData.expire_by = Math.floor(new Date(validated.expires_at).getTime() / 1000);
 }

 const paymentLink = await razorpay.paymentLink.create(linkData);

 // Save payment record (pending)
 const { data: payment, error } = await supabaseAdmin
 .from('payments')
 .insert({
 user_id: userId,
 business_id: invoice.business_id,
 invoice_id: invoice.id,
 amount: validated.amount,
 currency: 'INR',
 payment_method: 'upi',
 reference_number: paymentLink.id,
 payment_date: new Date().toISOString().split('T')[0],
 status: 'pending',
 })
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, {
 id: payment.id,
 payment_link_id: paymentLink.id,
 short_url: paymentLink.short_url,
 amount: validated.amount,
 status: 'pending',
 expires_at: validated.expires_at,
 }, 201);
 } catch (error) {
 if (error instanceof z.ZodError) {
 return errorResponse(res, 'VALIDATION_ERROR', 'Invalid request body', 422, error.flatten().fieldErrors);
 }
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to create payment link', 500);
 }
}

export async function handleVerifyPayment(
 req: any,
 res: any
): Promise<any> {
 try {
 const {
 invoice_id,
 razorpay_payment_id,
 razorpay_order_id,
 razorpay_signature,
 } = req.body;

 // Verify signature
 const isValid = verifyRazorpaySignature(
 razorpay_order_id,
 razorpay_payment_id,
 razorpay_signature
 );

 if (!isValid) {
 return errorResponse(res, 'INVALID_SIGNATURE', 'Invalid payment signature', 400);
 }

 // Fetch payment details from Razorpay
 const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

 if (razorpayPayment.status !== 'captured') {
 return errorResponse(res, 'PAYMENT_NOT_CAPTURED', 'Payment not captured', 400);
 }

 // Update payment record
 const { data: payment, error } = await supabaseAdmin
 .from('payments')
 .update({
 status: 'completed',
 reference_number: razorpay_payment_id,
 updated_at: new Date().toISOString(),
 })
 .eq('invoice_id', invoice_id)
 .eq('status', 'pending')
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 // Invoice status will be updated by trigger

 return successResponse(res, {
 payment,
 message: 'Payment verified and recorded',
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Payment verification failed', 500);
 }
}

export async function handleRazorpayWebhook(
 req: any,
 res: any
): Promise<any> {
 try {
 const signature = req.headers['x-razorpay-signature'] as string;
 const body = JSON.stringify(req.body);

 // Verify webhook signature
 if (!verifyWebhookSignature(body, signature)) {
 return errorResponse(res, 'INVALID_SIGNATURE', 'Invalid webhook signature', 400);
 }

 const event = req.body.event;
 const payload = req.body.payload;

 switch (event) {
 case 'payment.captured': {
 const paymentEntity = payload.payment.entity;
 const orderId = paymentEntity.order_id;
 const paymentId = paymentEntity.id;

 // Update payment status
 const { error } = await supabaseAdmin
 .from('payments')
 .update({
 status: 'completed',
 reference_number: paymentId,
 updated_at: new Date().toISOString(),
 })
 .eq('reference_number', orderId)
 .single();

 if (error) {
 console.error('[Razorpay Webhook] Update failed:', error);
 }
 break;
 }

 case 'payment.failed': {
 const paymentEntity = payload.payment.entity;
 const orderId = paymentEntity.order_id;

 await supabaseAdmin
 .from('payments')
 .update({
 status: 'failed',
 updated_at: new Date().toISOString(),
 })
 .eq('reference_number', orderId)
 .single();

 break;
 }

 case 'refund.processed': {
 const refundEntity = payload.refund.entity;
 const paymentId = refundEntity.payment_id;

 await supabaseAdmin
 .from('payments')
 .update({
 status: 'refunded',
 updated_at: new Date().toISOString(),
 })
 .eq('reference_number', paymentId)
 .single();

 break;
 }

 default:
 console.log(`[Razorpay Webhook] Unhandled event: ${event}`);
 }

 return successResponse(res, { received: true });
 } catch (error) {
 console.error('[Razorpay Webhook] Error:', error);
 // Still return 200 to prevent retries for non-critical errors
 return res.status(200).json({ received: true });
 }
}

export async function handleCreateOrder(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const { invoice_id, amount } = req.body;

 // Get invoice
 const { data: invoice, error: invError } = await supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('id', invoice_id)
 .eq('user_id', userId)
 .single();

 if (invError || !invoice) {
 return errorResponse(res, 'NOT_FOUND', 'Invoice not found', 404);
 }

 // Create Razorpay order
 const order = await razorpay.orders.create({
 amount: amount * 100, // paise
 currency: 'INR',
 receipt: `invoice-${invoice.invoice_number}-${Date.now()}`,
 notes: {
 invoice_id: invoice.id,
 invoice_number: invoice.invoice_number,
 user_id: userId,
 },
 });

 return successResponse(res, {
 order_id: order.id,
 amount: order.amount,
 currency: order.currency,
 receipt: order.receipt,
 status: order.status,
 }, 201);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to create order', 500);
 }
}

export async function handleListPayments(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const { invoice_id, status, page = '1', limit = '20' } = req.query;

 const pageNum = parseInt(page as string, 10);
 const limitNum = Math.min(parseInt(limit as string, 10), 100);

 let query = supabaseAdmin
 .from('payments')
 .select('*', { count: 'exact' })
 .eq('user_id', userId as string)
 .order('payment_date', { ascending: false });

 if (invoice_id) query = query.eq('invoice_id', invoice_id as string);
 if (status) query = query.eq('status', status as string);

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
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to list payments', 500);
 }
}

export async function handleRefundPayment(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;
 const { amount, reason, notes } = req.body;

 // Get payment
 const { data: payment, error: payError } = await supabaseAdmin
 .from('payments')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (payError || !payment) {
 return errorResponse(res, 'NOT_FOUND', 'Payment not found', 404);
 }

 // Create refund via Razorpay
 const refund = await razorpay.payments.refund(payment.reference_number, {
 amount: amount * 100, // paise
 speed: 'optimum',
 notes: {
 reason,
 notes,
 invoice_id: payment.invoice_id,
 },
 });

 // Update payment status
 const { error } = await supabaseAdmin
 .from('payments')
 .update({
 status: 'refunded',
 notes: notes || payment.notes,
 updated_at: new Date().toISOString(),
 })
 .eq('id', id);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, {
 refund_id: refund.id,
 amount,
 status: 'refunded',
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Refund failed', 500);
 }
}
