export interface User {
 id: string;
 email: string;
 name: string;
 businessName: string;
 gstin?: string;
 phone?: string;
 address?: string;
 state: string;
 language: "en" | "hi";
 currency: "INR";
 role: "owner" | "accountant" | "viewer";
 createdAt: string;
}

export interface Customer {
 id: string;
 userId: string;
 name: string;
 email?: string;
 phone: string;
 address: string;
 city?: string;
 state: string;
 gstin?: string;
 pan?: string;
 createdAt: string;
}

export interface InvoiceItem {
 id?: string;
 description: string;
 hsnCode?: string;
 quantity: number;
 rate: number;
 discount: number;
 taxRate: number;
}

export interface Invoice {
 id: string;
 userId: string;
 customer: Customer;
 items: InvoiceItem[];
 subtotal: number;
 taxAmount: number;
 discountAmount: number;
 total: number;
 status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
 notes?: string;
 terms?: string;
 dueDate: string;
 issueDate: string;
 placeOfSupply: string;
 paymentLink?: string;
 qrCode?: string;
 createdAt: string;
 updatedAt: string;
}

export interface ExpenseCategory {
 id: string;
 name: string;
 icon: string;
 color: string;
 type: "expense" | "income";
 parentId?: string;
}

export interface Expense {
 id: string;
 userId: string;
 amount: number;
 category: ExpenseCategory;
 description: string;
 date: string;
 paymentMethod: "cash" | "upi" | "bank" | "card";
 receiptUrl?: string;
 tags: string[];
 createdAt: string;
}

export interface Receipt {
 id: string;
 userId: string;
 imageUrl: string;
 vendor: string;
 date: string;
 amount: number;
 items?: ReceiptItem[];
 category?: string;
 paymentMethod?: string;
 notes?: string;
 confidence?: number;
 createdAt: string;
}

export interface ReceiptItem {
 name: string;
 quantity: number;
 price: number;
}

export interface GstReturn {
 id: string;
 userId: string;
 returnType: "GSTR-1" | "GSTR-3B" | "GSTR-2A" | "GSTR-2B";
 financialYear: string;
 quarter: "Q1" | "Q2" | "Q3" | "Q4";
 month?: string;
 dueDate: string;
 filedDate?: string;
 status: "draft" | "filed" | "pending" | "error";
 totalTurnover: number;
 totalTax: number;
 itcAvailable: number;
 itcClaimed: number;
}

export interface Gstr1Table {
 id: string;
 returnId: string;
 section: "B2B" | "B2C" | "B2CS" | "B2BA" | "CDNR" | "CDNUR";
 invoices: Gstr1Invoice[];
 totalTaxableValue: number;
 totalCgst: number;
 totalSgst: number;
 totalIgst: number;
}

export interface Gstr1Invoice {
 id: string;
 gstin: string;
 invoiceNumber: string;
 invoiceDate: string;
 invoiceValue: number;
 placeOfSupply: string;
 reverseCharge: boolean;
 items: { taxableValue: number; cgst: number; sgst: number; igst: number }[];
}

export interface ItcSummary {
 id: string;
 returnId: string;
 itcType: "input" | "input_service";
 totalItc: number;
 itcAvailable: number;
 itcClaimed: number;
 itcIneligible: number;
 ineligibleReason?: string;
}

export interface Payment {
 id: string;
 userId: string;
 invoiceId: string;
 amount: number;
 method: "upi" | "bank" | "cash" | "card";
 upiTransactionId?: string;
 status: "pending" | "completed" | "failed" | "refunded";
 paidAt?: string;
 createdAt: string;
}

export interface PaymentLink {
 id: string;
 userId: string;
 invoiceId: string;
 amount: number;
 link: string;
 qrCode: string;
 upiId: string;
 status: "active" | "used" | "expired";
 expiresAt?: string;
 createdAt: string;
}

export interface Reminder {
 id: string;
 userId: string;
 invoiceId?: string;
 type: "payment" | "gst" | "custom";
 channel: "email" | "whatsapp" | "sms";
 subject: string;
 body: string;
 schedule: {
 frequency: "once" | "daily" | "weekly" | "monthly";
 startDate: string;
 endDate?: string;
 time: string;
 };
 isActive: boolean;
 createdAt: string;
}

export type PaymentStatus = Invoice["status"];
