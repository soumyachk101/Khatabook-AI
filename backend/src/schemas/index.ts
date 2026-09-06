import { z } from "zod";

// ============================================================================
// Auth
// ============================================================================

export const signupSchema = z.object({
 email: z.string().email("Invalid email address"),
 password: z.string().min(8, "Password must be at least 8 characters"),
 name: z.string().min(1, "Name is required"),
 phone: z.string().optional(),
 language: z.enum(["en", "hi", "mr", "gu", "bn"]).default("en"),
});

export const loginSchema = z.object({
 email: z.string().email("Invalid email address"),
 password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
 email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
 token: z.string().min(1, "Token is required"),
 new_password: z.string().min(8, "Password must be at least 8 characters"),
});

// ============================================================================
// Receipt
// ============================================================================

export const listReceiptsSchema = z.object({
 business_id: z.string().uuid().optional(),
 from: z.string().date().optional(),
 to: z.string().date().optional(),
 category: z.string().optional(),
 vendor: z.string().optional(),
 min_amount: z.coerce.number().positive().optional(),
 max_amount: z.coerce.number().positive().optional(),
 tags: z.string().optional(),
 status: z
 .enum(["pending", "processing", "completed", "failed", "review_required"])
 .optional(),
 page: z.coerce.number().int().positive().default(1),
 limit: z.coerce.number().int().positive().max(100).default(20),
 sort: z.enum(["date", "amount", "vendor", "created_at"]).default("date"),
 order: z.enum(["asc", "desc"]).default("desc"),
});

export const updateReceiptSchema = z.object({
 category: z.string().optional(),
 amount: z.coerce.number().positive().optional(),
 vendor: z.string().optional(),
 date: z.string().date().optional(),
 is_expense: z.boolean().optional(),
 tags: z.array(z.string()).optional(),
 notes: z.string().optional(),
 reviewed: z.boolean().optional(),
});

// ============================================================================
// Invoice
// ============================================================================

export const invoiceLineItemSchema = z.object({
 description: z.string().min(1, "Description is required"),
 hsn_sac: z.string().optional(),
 quantity: z.coerce.number().positive().default(1),
 unit: z.string().default("pcs"),
 unit_price: z.coerce.number().nonnegative(),
 discount_pct: z.coerce.number().min(0).max(100).default(0),
 gst_rate: z.coerce.number().min(0).max(100).default(18),
 amount: z.coerce.number().nonnegative(),
});

export const createInvoiceSchema = z.object({
 business_id: z.string().uuid(),
 invoice_number: z.string().min(1, "Invoice number is required"),
 client_name: z.string().min(1, "Client name is required"),
 client_email: z.string().email().optional(),
 client_phone: z.string().optional(),
 client_gstin: z.string().optional(),
 client_billing_address: z.record(z.unknown()).optional(),
 client_shipping_address: z.record(z.unknown()).optional(),
 place_of_supply: z.string().min(1, "Place of supply is required"),
 line_items: z.array(invoiceLineItemSchema).min(1, "At least one line item is required"),
 sub_total: z.coerce.number().nonnegative(),
 cgst_amount: z.coerce.number().nonnegative().default(0),
 sgst_amount: z.coerce.number().nonnegative().default(0),
 igst_amount: z.coerce.number().nonnegative().default(0),
 cess_amount: z.coerce.number().nonnegative().default(0),
 discount_amount: z.coerce.number().nonnegative().default(0),
 round_off: z.coerce.number().default(0),
 grand_total: z.coerce.number().positive(),
 reverse_charge: z.boolean().default(false),
 notes: z.string().optional(),
 terms_and_conditions: z.string().optional(),
 issue_date: z.string().date().default(new Date().toISOString().split("T")[0]),
 due_date: z.string().date(),
 status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).default("draft"),
});

export const updateInvoiceSchema = createInvoiceSchema
 .partial()
 .omit({ business_id: true, invoice_number: true, grand_total: true, sub_total: true });

export const listInvoicesSchema = z.object({
 business_id: z.string().uuid().optional(),
 status: z
 .enum(["draft", "sent", "viewed", "partial", "paid", "overdue", "cancelled", "void"])
 .optional(),
 from: z.string().date().optional(),
 to: z.string().date().optional(),
 min_amount: z.coerce.number().positive().optional(),
 max_amount: z.coerce.number().positive().optional(),
 search: z.string().optional(),
 page: z.coerce.number().int().positive().default(1),
 limit: z.coerce.number().int().positive().max(100).default(20),
 sort: z.string().default("created_at"),
 order: z.enum(["asc", "desc"]).default("desc"),
});

export const sendInvoiceSchema = z.object({
 channel: z.enum(["email", "whatsapp"]).default("email"),
 recipient: z.string().min(1, "Recipient is required"),
 message: z.string().optional(),
});

export const markPaidSchema = z.object({
 amount: z.coerce.number().positive("Amount must be positive"),
 payment_method: z.enum(["cash", "upi", "bank_transfer", "cheque", "card", "wallet", "other"]),
 paid_at: z.string().datetime().optional(),
});

// ============================================================================
// Expense
// ============================================================================

export const createExpenseSchema = z.object({
 business_id: z.string().uuid(),
 category_id: z.string().uuid(),
 description: z.string().min(1, "Description is required"),
 vendor_name: z.string().optional(),
 vendor_gstin: z.string().optional(),
 amount: z.coerce.number().positive("Amount must be positive"),
 gst_applicable: z.boolean().default(true),
 gst_rate: z.coerce.number().min(0).max(100).default(0),
 cgst_amount: z.coerce.number().nonnegative().default(0),
 sgst_amount: z.coerce.number().nonnegative().default(0),
 igst_amount: z.coerce.number().nonnegative().default(0),
 hsn_code: z.string().optional(),
 expense_date: z.string().date().default(new Date().toISOString().split("T")[0]),
 payment_date: z.string().date().optional(),
 payment_method: z
 .enum(["cash", "upi", "bank_transfer", "cheque", "card", "wallet", "other"])
 .optional(),
 receipt_id: z.string().uuid().optional(),
 tds_deducted: z.coerce.number().nonnegative().default(0),
 notes: z.string().optional(),
 tags: z.array(z.string()).default([]),
});

export const updateExpenseSchema = createExpenseSchema.partial().omit({ business_id: true });

export const listExpensesSchema = z.object({
 business_id: z.string().uuid().optional(),
 category_id: z.string().uuid().optional(),
 from: z.string().date().optional(),
 to: z.string().date().optional(),
 payment_method: z.string().optional(),
 min_amount: z.coerce.number().positive().optional(),
 max_amount: z.coerce.number().positive().optional(),
 tags: z.string().optional(),
 page: z.coerce.number().int().positive().default(1),
 limit: z.coerce.number().int().positive().max(100).default(20),
 sort: z.enum(["date", "amount", "vendor", "created_at"]).default("date"),
 order: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================================
// Payment
// ============================================================================

export const createPaymentLinkSchema = z.object({
 invoice_id: z.string().uuid(),
 amount: z.coerce.number().positive("Amount must be positive"),
 method: z.enum(["razorpay", "upi", "cash", "bank_transfer"]).default("razorpay"),
 description: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
 invoice_id: z.string().uuid(),
 razorpay_payment_id: z.string().min(1, "Payment ID is required"),
 razorpay_order_id: z.string().min(1, "Order ID is required"),
 razorpay_signature: z.string().min(1, "Signature is required"),
});

export const createOrderSchema = z.object({
 invoice_id: z.string().uuid(),
 amount: z.coerce.number().positive("Amount must be positive"),
 currency: z.string().default("INR"),
});

// ============================================================================
// Dashboard
// ============================================================================

export const dashboardFiltersSchema = z.object({
 business_id: z.string().uuid().optional(),
 from: z.string().date().default(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]),
 to: z.string().date().default(new Date().toISOString().split("T")[0]),
});

export const monthlyFiltersSchema = z.object({
 from: z.string().date().default((() => {
 const d = new Date();
 d.setMonth(d.getMonth() - 11);
 return d.toISOString().split("T")[0];
 })()),
 to: z.string().date().default(new Date().toISOString().split("T")[0]),
});

export const categoryBreakdownSchema = z.object({
 type: z.enum(["expense", "income"]).default("expense"),
 from: z.string().date().optional(),
 to: z.string().date().optional(),
 business_id: z.string().uuid().optional(),
});

// ============================================================================
// GST
// ============================================================================

export const gstFiltersSchema = z.object({
 business_id: z.string().uuid(),
 financial_year: z.string().min(1, "Financial year is required"),
 quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
});

// ============================================================================
// Category
// ============================================================================

export const createCategorySchema = z.object({
 name: z.string().min(1, "Category name is required"),
 type: z.enum(["income", "expense", "transfer"]).default("expense"),
 color: z.string().default("#6B7280"),
 icon: z.string().optional(),
 parent_id: z.string().uuid().optional(),
 category_group: z
 .enum([
 "office", "travel", "food", "utilities",
 "marketing", "salary", "software", "equipment",
 "professional", "client_payment", "other",
 ])
 .optional(),
 hsn_code: z.string().optional(),
 gst_rate: z.coerce.number().min(0).max(100).default(0),
});

// ============================================================================
// AI
// ============================================================================

export const suggestItemsSchema = z.object({
 description: z.string().min(1, "Description is required"),
 business_id: z.string().uuid().optional(),
});

export const categorizeSchema = z.object({
 receipt_id: z.string().uuid(),
 force: z.boolean().default(false),
});

// ============================================================================
// Reminder
// ============================================================================

export const createReminderSchema = z.object({
 invoice_id: z.string().uuid(),
 reminder_type: z
 .enum(["before_due", "on_due", "after_due_1", "after_due_7", "after_due_15", "custom"]),
 scheduled_at: z.string().datetime(),
});

export const cancelReminderSchema = z.object({});

// ============================================================================
// Refund
// ============================================================================

export const refundSchema = z.object({
 amount: z.coerce.number().positive("Refund amount must be positive"),
 reason: z.string().min(1, "Refund reason is required"),
 notes: z.string().optional(),
});

// ============================================================================
// Bulk Export
// ============================================================================

export const bulkExportSchema = z.object({
 type: z.enum(["invoices", "expenses", "receipts", "gst"]),
 format: z.enum(["csv", "xlsx", "pdf"]),
 from: z.string().date(),
 to: z.string().date(),
 business_id: z.string().uuid(),
});
