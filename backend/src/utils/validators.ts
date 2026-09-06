import { z } from 'zod';

// ============================================================
// Common Schemas
// ============================================================

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const dateSchema = z
 .string()
 .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
 .refine((val) => !isNaN(Date.parse(val)), 'Invalid date');

export const paginationSchema = z.object({
 page: z.coerce.number().int().min(1).default(1),
 limit: z.coerce.number().int().min(1).max(100).default(20),
 sort: z.string().optional(),
 order: z.enum(['asc', 'desc']).default('desc'),
});

export const idSchema = z.object({
 id: uuidSchema,
});

// ============================================================
// Auth Schemas
// ============================================================

export const signupSchema = z.object({
 email: z.string().email('Invalid email address'),
 password: z
 .string()
 .min(8, 'Password must be at least 8 characters')
 .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
 .regex(/[0-9]/, 'Password must contain at least one number'),
 name: z.string().min(1, 'Name is required').max(255),
 phone: z
 .string()
 .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number')
 .optional(),
 language: z.enum(['en', 'hi', 'mr', 'gu', 'bn']).default('en'),
});

export const loginSchema = z.object({
 email: z.string().email().optional(),
 password: z.string().optional(),
 phone: z.string().regex(/^\+?[1-9]\d{9,14}$/).optional(),
 otp: z.string().length(6).optional(),
}).refine(
 (data) =>
 (data.email && data.password) || (data.phone && data.otp),
 { message: 'Either email/password or phone/otp is required' }
);

export const forgotPasswordSchema = z.object({
 email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
 token: z.string().min(1),
 new_password: z.string().min(8),
});

// ============================================================
// Receipt Schemas
// ============================================================

export const receiptUploadSchema = z.object({
 business_id: uuidSchema.optional(),
 auto_categorize: z.coerce.boolean().default(true),
 tags: z.union([z.string(), z.array(z.string())]).optional(),
});

export const receiptUpdateSchema = z.object({
 vendor_name: z.string().optional(),
 vendor_address: z.string().optional(),
 vendor_gstin: z.string().optional(),
 invoice_number: z.string().optional(),
 invoice_date: dateSchema.optional(),
 due_date: dateSchema.optional(),
 sub_total: z.number().positive().optional(),
 cgst_amount: z.number().nonnegative().optional(),
 sgst_amount: z.number().nonnegative().optional(),
 igst_amount: z.number().nonnegative().optional(),
 cess_amount: z.number().nonnegative().optional(),
 discount_amount: z.number().nonnegative().optional(),
 total_amount: z.number().positive().optional(),
 category_id: uuidSchema.optional(),
 tags: z.array(z.string()).optional(),
 user_notes: z.string().optional(),
 review_status: z.enum(['auto', 'pending_review', 'approved', 'edited', 'rejected']).optional(),
});

export const receiptListSchema = paginationSchema.extend({
 business_id: uuidSchema.optional(),
 from: dateSchema.optional(),
 to: dateSchema.optional(),
 category: z.string().optional(),
 vendor: z.string().optional(),
 status: z.enum(['pending', 'processing', 'completed', 'failed', 'review_required']).optional(),
 min_amount: z.coerce.number().optional(),
 max_amount: z.coerce.number().optional(),
 tags: z.string().optional(),
});

// ============================================================
// Invoice Schemas
// ============================================================

export const invoiceLineItemSchema = z.object({
 description: z.string().min(1),
 hsn_code: z.string().optional(),
 quantity: z.number().positive(),
 unit: z.string().default('pcs'),
 unit_price: z.number().nonnegative(),
 discount_pct: z.number().min(0).max(100).default(0),
 gst_rate: z.number().min(0).max(28),
 amount: z.number().nonnegative(),
 cgst: z.number().nonnegative(),
 sgst: z.number().nonnegative(),
 igst: z.number().nonnegative(),
 total: z.number().nonnegative(),
});

export const invoiceCreateSchema = z.object({
 business_id: uuidSchema,
 invoice_number: z.string().optional(),
 invoice_date: dateSchema.optional(),
 due_date: dateSchema,
 client_name: z.string().min(1),
 client_email: z.string().email().optional(),
 client_phone: z.string().optional(),
 client_gstin: z.string().optional(),
 client_billing_address: z.record(z.unknown()).optional(),
 client_shipping_address: z.record(z.unknown()).optional(),
 place_of_supply: z.string().min(1),
 line_items: z.array(invoiceLineItemSchema).min(1, 'At least one line item is required'),
 sub_total: z.number().nonnegative(),
 cgst_amount: z.number().nonnegative().default(0),
 sgst_amount: z.number().nonnegative().default(0),
 igst_amount: z.number().nonnegative().default(0),
 cess_amount: z.number().nonnegative().default(0),
 discount_amount: z.number().nonnegative().default(0),
 round_off: z.number().default(0),
 grand_total: z.number().positive(),
 reverse_charge: z.boolean().default(false),
 notes: z.string().optional(),
 terms_and_conditions: z.string().optional(),
 status: z.enum(['draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled', 'void']).default('draft'),
});

export const invoiceUpdateSchema = invoiceCreateSchema.partial().omit({
 business_id: true,
 invoice_number: true,
});

export const invoiceSendSchema = z.object({
 channel: z.enum(['email', 'whatsapp']),
 recipient: z.string().min(1),
 message: z.string().optional(),
});

// ============================================================
// Expense Schemas
// ============================================================

export const expenseCreateSchema = z.object({
 business_id: uuidSchema,
 category_id: uuidSchema,
 description: z.string().min(1),
 vendor_name: z.string().optional(),
 vendor_gstin: z.string().optional(),
 amount: z.number().positive('Amount must be positive'),
 gst_applicable: z.boolean().default(true),
 gst_rate: z.number().min(0).max(28).default(0),
 cgst_amount: z.number().nonnegative().default(0),
 sgst_amount: z.number().nonnegative().default(0),
 igst_amount: z.number().nonnegative().default(0),
 hsn_code: z.string().optional(),
 expense_date: dateSchema.optional(),
 payment_date: dateSchema.optional(),
 payment_method: z.enum(['cash', 'upi', 'bank_transfer', 'cheque', 'card', 'wallet', 'other']).optional(),
 receipt_id: uuidSchema.optional(),
 tds_deducted: z.number().nonnegative().default(0),
 notes: z.string().optional(),
 tags: z.array(z.string()).default([]),
});

export const expenseUpdateSchema = expenseCreateSchema.partial().omit({
 business_id: true,
 receipt_id: true,
});

export const expenseListSchema = paginationSchema.extend({
 business_id: uuidSchema.optional(),
 category_id: uuidSchema.optional(),
 from: dateSchema.optional(),
 to: dateSchema.optional(),
 min_amount: z.coerce.number().optional(),
 max_amount: z.coerce.number().optional(),
 payment_method: z.enum(['cash', 'upi', 'bank_transfer', 'cheque', 'card', 'wallet', 'other']).optional(),
});

export const expenseSummarySchema = z.object({
 business_id: uuidSchema.optional(),
 from: dateSchema.optional(),
 to: dateSchema.optional(),
});

// ============================================================
// Payment Schemas
// ============================================================

export const paymentLinkSchema = z.object({
 invoice_id: uuidSchema,
 amount: z.number().positive(),
 method: z.enum(['razorpay', 'upi', 'bank_transfer']),
 description: z.string().optional(),
 expires_at: z.string().datetime().optional(),
});

export const paymentVerifySchema = z.object({
 invoice_id: uuidSchema,
 razorpay_payment_id: z.string(),
 razorpay_order_id: z.string(),
 razorpay_signature: z.string(),
});

export const paymentRefundSchema = z.object({
 amount: z.number().positive(),
 reason: z.string().min(1),
 notes: z.string().optional(),
});

// ============================================================
// GST Schemas
// ============================================================

export const gstGenerateSchema = z.object({
 business_id: uuidSchema,
 financial_year: z.string().regex(/^\d{4}-\d{2}$/, 'Format: YYYY-YY'),
 quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
});

export const gstFileSchema = z.object({
 acknowledgment_number: z.string().min(1),
 filed_at: z.string().datetime().optional(),
});

// ============================================================
// Category Schemas
// ============================================================

export const categoryCreateSchema = z.object({
 name: z.string().min(1).max(100),
 type: z.enum(['income', 'expense', 'transfer']),
 description: z.string().optional(),
 icon: z.string().optional(),
 color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be hex format').default('#6B7280'),
 parent_id: uuidSchema.optional(),
 category_group: z.enum(['office', 'travel', 'food', 'utilities', 'marketing', 'salary', 'software', 'equipment', 'professional', 'client_payment', 'other']).optional(),
 hsn_code: z.string().optional(),
 gst_rate: z.number().min(0).max(28).default(0),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

// ============================================================
// Reminder Schemas
// ============================================================

export const reminderCreateSchema = z.object({
 invoice_id: uuidSchema,
 reminder_type: z.enum(['before_due', 'on_due', 'after_due_1', 'after_due_7', 'after_due_15', 'custom']),
 scheduled_at: z.string().datetime(),
 recipient_email: z.string().email(),
 recipient_name: z.string().optional(),
 template_id: z.string().default('standard_reminder'),
});

// ============================================================
// Helper Functions
// ============================================================

export function validateBody<T>(
 schema: z.ZodSchema<T>
) {
 return (data: unknown): T => {
 const result = schema.safeParse(data);
 if (!result.success) {
 const details: Record<string, unknown> = {};
 result.error.issues.forEach((issue) => {
 const path = issue.path.join('.') || 'root';
 details[path] = issue.message;
 });
 const error: any = new Error('Validation failed');
 error.name = 'ValidationError';
 error.details = details;
 throw error;
 }
 return result.data;
 };
}

export { z };
