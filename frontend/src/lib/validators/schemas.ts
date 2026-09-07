import { z } from "zod";

// Auth
export const loginSchema = z.object({
 email: z.string().email("Invalid email address"),
 password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
 name: z.string().min(2, "Name must be at least 2 characters"),
 email: z.string().email("Invalid email address"),
 password: z.string().min(6, "Password must be at least 6 characters"),
 businessName: z.string().min(2, "Business name is required"),
 gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format").optional().or(z.literal("")),
});

// Invoice
export const invoiceItemSchema = z.object({
 description: z.string().min(1, "Description is required"),
 hsnCode: z.string().optional(),
 quantity: z.number().min(1, "Quantity must be at least 1"),
 rate: z.number().min(0, "Rate cannot be negative"),
 discount: z.number().min(0).max(100).default(0),
 taxRate: z.number().min(0).max(28).default(18),
});

export const invoiceSchema = z.object({
 customer: z.object({
 name: z.string().min(1, "Customer name is required"),
 email: z.string().email().optional().or(z.literal("")),
 phone: z.string().min(10, "Valid phone number required"),
 address: z.string().min(1, "Address is required"),
 gstin: z.string().optional(),
 state: z.string().min(1, "State is required"),
 }),
 items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
 notes: z.string().optional(),
 terms: z.string().optional(),
 dueDate: z.string().min(1, "Due date is required"),
 placeOfSupply: z.string().min(1, "Place of supply is required"),
});

// Expense
export const expenseSchema = z.object({
 amount: z.number().positive("Amount must be positive"),
 category: z.string().min(1, "Category is required"),
 description: z.string().min(1, "Description is required"),
 date: z.string().min(1, "Date is required"),
 paymentMethod: z.enum(["cash", "upi", "bank", "card"]).default("cash"),
 receiptUrl: z.string().optional(),
 tags: z.array(z.string()).optional(),
});

// Receipt
export const receiptSchema = z.object({
 vendor: z.string().min(1, "Vendor name is required"),
 date: z.string().min(1, "Date is required"),
 amount: z.number().positive("Amount must be positive"),
 items: z.array(z.object({
 name: z.string(),
 quantity: z.number().default(1),
 price: z.number().default(0),
 })).optional(),
 category: z.string().optional(),
 paymentMethod: z.string().optional(),
 notes: z.string().optional(),
});

// GST
export const gstReturnSchema = z.object({
 returnType: z.enum(["GSTR-1", "GSTR-3B", "GSTR-2A", "GSTR-2B"]),
 financialYear: z.string().regex(/^\d{4}-\d{2}$/, "Invalid financial year format"),
 quarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
 dueDate: z.string().min(1, "Due date is required"),
 invoices: z.array(z.string()).min(1, "At least one invoice required"),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type InvoiceForm = z.infer<typeof invoiceSchema>;
export type InvoiceItemForm = z.infer<typeof invoiceItemSchema>;
export type ExpenseForm = z.infer<typeof expenseSchema>;
export type ReceiptForm = z.infer<typeof receiptSchema>;
export type GstReturnForm = z.infer<typeof gstReturnSchema>;
