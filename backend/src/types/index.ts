import { z } from "zod";

 // ─── Profile & Business ───────────────────────────────────────────

 export interface Profile {
 id: string;
 email: string;
 phone?: string;
 fullName: string;
 avatarUrl?: string;
 isOnboarded: boolean;
 userId: string;
 createdAt: Date;
 updatedAt: Date;
 }

 export interface Business {
 id: string;
 name: string;
 type: BusinessType;
 gstin?: string;
 pan?: string;
 address?: string;
 city?: string;
 state?: string;
 pincode?: string;
 financialYearStart: number;
 currency: string;
 timezone: string;
 profileId: string;
 createdAt: Date;
 updatedAt: Date;
 }

 export type BusinessType = "sole_proprietor" | "pvt_ltd" | "llp" | "partnership";

 export const BusinessTypeSchema = z.enum(["sole_proprietor", "pvt_ltd", "llp", "partnership"]);

 // ─── Category ─────────────────────────────────────────────────────

 export interface Category {
 id: string;
 name: string;
 type: "income" | "expense";
 parentId?: string;
 color: string;
 icon?: string;
 isSystem: boolean;
 businessId: string;
 createdAt: Date;
 updatedAt: Date;
 }

 // ─── Receipt ──────────────────────────────────────────────────────

 export interface Receipt {
 id: string;
 imageUrl: string;
 thumbnailUrl?: string;
 rawText?: string;
 extractedData?: Record<string, unknown>;
 isVerified: boolean;
 confidence?: number;
 tags: string[];
 notes?: string;
 businessId: string;
 profileId: string;
 categoryId?: string;
 category?: Category;
 createdAt: Date;
 updatedAt: Date;
 }

 export interface ExtractedReceiptData {
 vendorName?: string;
 date?: string;
 total?: number;
 items?: Array<{ name: string; price: number; quantity?: number }>;
 tax?: number;
 paymentMethod?: string;
 invoiceNumber?: string;
 confidence: number;
 }

 // ─── Invoice ──────────────────────────────────────────────────────

 export interface InvoiceLineItem {
 description: string;
 quantity: number;
 unitPrice: number;
 amount: number;
 taxRate?: number;
 taxAmount?: number;
 }

 export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";

 export interface Invoice {
 id: string;
 invoiceNumber: string;
 customerName: string;
 customerEmail?: string;
 customerPhone?: string;
 billingAddress?: string;
 shippingAddress?: string;
 subtotal: number;
 taxRate: number;
 taxAmount: number;
 discount: number;
 total: number;
 currency: string;
 status: InvoiceStatus;
 dueDate?: Date;
 sentAt?: Date;
 paidAt?: Date;
 pdfUrl?: string;
 qrCodeUrl?: string;
 notes?: string;
 terms?: string;
 lineItems: InvoiceLineItem[];
 businessId: string;
 profileId: string;
 payments?: Payment[];
 createdAt: Date;
 updatedAt: Date;
 }

 // ─── Expense ──────────────────────────────────────────────────────

 export type PaymentMethod = "cash" | "upi" | "card" | "bank_transfer" | "cheque";

 export interface Expense {
 id: string;
 amount: number;
 description: string;
 date: Date;
 paymentMethod?: PaymentMethod;
 referenceNumber?: string;
 receiptUrl?: string;
 isGstApplicable: boolean;
 gstRate?: number;
 gstAmount?: number;
 notes?: string;
 businessId: string;
 profileId: string;
 categoryId: string;
 category?: Category;
 createdAt: Date;
 updatedAt: Date;
 }

 // ─── Payment ──────────────────────────────────────────────────────

 export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

 export interface Payment {
 id: string;
 amount: number;
 currency: string;
 method: string;
 status: PaymentStatus;
 razorpayPaymentId?: string;
 razorpayOrderId?: string;
 razorpaySignature?: string;
 receiptUrl?: string;
 notes?: string;
 paidAt?: Date;
 businessId: string;
 profileId: string;
 invoiceId?: string;
 invoice?: Invoice;
 createdAt: Date;
 updatedAt: Date;
 }

 // ─── Reminder ─────────────────────────────────────────────────────

 export type ReminderType = "payment_due" | "invoice_overdue" | "gst_deadline";
 export type ReminderChannel = "email" | "whatsapp" | "sms";
 export type ReminderStatus = "pending" | "sent" | "failed" | "cancelled";

 export interface Reminder {
 id: string;
 type: ReminderType;
 title: string;
 message: string;
 channel: ReminderChannel;
 recipient: string;
 scheduledAt: Date;
 sentAt?: Date;
 status: ReminderStatus;
 errorMessage?: string;
 businessId: string;
 profileId: string;
 createdAt: Date;
 updatedAt: Date;
 }

 // ─── GST Return ───────────────────────────────────────────────────

 export type GstReturnType = "GSTR-1" | "GSTR-3B";
 export type GstReturnStatus = "draft" | "filed" | "pending";

 export interface GstReturn {
 id: string;
 returnType: GstReturnType;
 financialYear: string;
 quarter?: string;
 month?: number;
 periodStart: Date;
 periodEnd: Date;
 totalOutwardSupply: number;
 totalInwardSupply: number;
 outputTax: number;
 inputTax: number;
 taxPayable: number;
 itcAvailable: number;
 status: GstReturnStatus;
 filedAt?: Date;
 dueDate: Date;
 jsonUrl?: string;
 notes?: string;
 businessId: string;
 profileId: string;
 createdAt: Date;
 updatedAt: Date;
 }

 // ─── Zod Schemas ──────────────────────────────────────────────────

 export const SignupSchema = z.object({
 email: z.string().email(),
 password: z.string().min(8).max(100),
 fullName: z.string().min(1).max(100),
 phone: z.string().optional(),
 });

 export const LoginSchema = z.object({
 email: z.string().email(),
 password: z.string(),
 });

 export const CreateBusinessSchema = z.object({
 name: z.string().min(1).max(200),
 type: BusinessTypeSchema,
 gstin: z.string().length(15).optional().or(z.literal("")),
 pan: z.string().length(10).optional().or(z.literal("")),
 address: z.string().max(500).optional().or(z.literal("")),
 city: z.string().max(100).optional().or(z.literal("")),
 state: z.string().max(100).optional().or(z.literal("")),
 pincode: z.string().length(6).optional().or(z.literal("")),
 financialYearStart: z.number().int().min(1).max(12),
 currency: z.string().default("INR"),
 timezone: z.string().default("Asia/Kolkata"),
 });

 export const CreateReceiptSchema = z.object({
 notes: z.string().optional(),
 tags: z.array(z.string()).optional(),
 categoryId: z.string().uuid().optional(),
 });

 export const CreateExpenseSchema = z.object({
 amount: z.number().positive(),
 description: z.string().min(1).max(500),
 date: z.coerce.date(),
 paymentMethod: z.enum(["cash", "upi", "card", "bank_transfer", "cheque"]).optional(),
 referenceNumber: z.string().optional(),
 receiptUrl: z.string().url().optional(),
 isGstApplicable: z.boolean().default(false),
 gstRate: z.number().min(0).max(100).optional(),
 gstAmount: z.number().min(0).optional(),
 categoryId: z.string().uuid(),
 notes: z.string().optional(),
 });

 export const CreateInvoiceSchema = z.object({
 invoiceNumber: z.string().min(1).max(50),
 customerName: z.string().min(1).max(200),
 customerEmail: z.string().email().optional().or(z.literal("")),
 customerPhone: z.string().optional().or(z.literal("")),
 billingAddress: z.string().max(500).optional().or(z.literal("")),
 shippingAddress: z.string().max(500).optional().or(z.literal("")),
 subtotal: z.number().nonNegative(),
 taxRate: z.number().min(0).max(100).default(0),
 discount: z.number().min(0).default(0),
 dueDate: z.coerce.date().optional(),
 notes: z.string().optional(),
 terms: z.string().optional(),
 lineItems: z.array(z.object({
 description: z.string().min(1),
 quantity: z.number().positive(),
 unitPrice: z.number().nonNegative(),
 })),
 });

 export const CreateReminderSchema = z.object({
 type: z.enum(["payment_due", "invoice_overdue", "gst_deadline"]),
 title: z.string().min(1).max(200),
 message: z.string().min(1).max,
 channel: z.enum(["email", "whatsapp", "sms"]),
 recipient: z.string().min(1),
 scheduledAt: z.coerce.date(),
 });

 export type CreateReminderInput = z.infer<typeof CreateReminderSchema>;
 export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
 export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
 export type CreateReceiptInput = z.infer<typeof CreateReceiptSchema>;
 export type SignupInput = z.infer<typeof SignupSchema>;
 export type LoginInput = z.infer<typeof LoginSchema>;
 export type CreateBusinessInput = z.infer<typeof CreateBusinessSchema>;

 // ─── API Response wrappers ─────────────────────────────────────────

 export interface ApiResponse<T> {
 success: boolean;
 data?: T;
 error?: string;
 message?: string;
 }

 export interface PaginatedResponse<T> {
 data: T[];
 total: number;
 page: number;
 limit: number;
 totalPages: number;
 }

 // ─── Auth ─────────────────────────────────────────────────────────

 export interface JWTPayload {
 profileId: string;
 email: string;
 businessId?: string;
 iat?: number;
 exp?: number;
 }

 export interface AuthRequest {
 user?: JWTPayload;
 }

 // ─── Queue Job Data ────────────────────────────────────────────────

 export interface OCRJobData {
 receiptId: string;
 imagePath: string;
 }

 export interface PDFJobData {
 invoiceId: string;
 }

 export interface ReminderJobData {
 reminderId: string;
 }

 export interface GSTCalcJobData {
 businessId: string;
 startDate: string;
 endDate: string;
 }
