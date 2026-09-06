/**
 * Khatabook AI — Shared Domain Types & Contracts
 */

// Re-export everything from constants
export * from '../constants';

// Re-export AI-specific types
export * from './ai';

export type StatusType = 'paid' | 'pending' | 'overdue' | 'draft' | 'processing';

export interface User {
 id: string;
 email: string;
 name: string;
 phone?: string;
 plan: 'free' | 'pro' | 'business';
 createdAt: Date | string;
}

export interface Business {
 id: string;
 userId: string;
 name: string;
 gstin?: string;
 address?: string;
 type: 'individual' | 'proprietorship' | 'llp' | 'company';
 createdAt: Date | string;
}

export interface ReceiptItem {
 name: string;
 quantity: number;
 price: number;
}

export interface ExtractedReceiptData {
 vendor?: string;
 date?: string;
 items?: ReceiptItem[];
 subtotal?: number;
 tax?: number;
 total?: number;
 paymentMethod?: string;
}

export interface GSTDetails {
 gstin?: string;
 cgst?: number;
 sgst?: number;
 igst?: number;
 totalGst?: number;
}

export interface Receipt {
 id: string;
 userId?: string;
 businessId?: string;
 imageUrl?: string;
 imageUri?: string;
 rawText?: string;
 extractedData?: ExtractedReceiptData;
 category: string;
 amount: number;
 date: Date | string;
 vendor?: string;
 paymentMode?: string;
 gstDetails?: GSTDetails;
 status: StatusType;
 createdAt: Date | string;
}

export interface InvoiceItem {
 name: string;
 description?: string;
 quantity: number;
 rate: number;
 amount: number;
 gstRate: number;
}

export interface Invoice {
 id: string;
 userId: string;
 businessId?: string;
 invoiceNumber: string;
 clientName: string;
 clientGstin?: string;
 items: InvoiceItem[];
 subtotal: number;
 cgst: number;
 sgst: number;
 igst: number;
 total: number;
 status: 'draft' | 'sent' | 'paid' | 'overdue';
 dueDate: Date | string;
 createdAt: Date | string;
}

export interface Expense {
 id: string;
 userId: string;
 businessId?: string;
 category: string;
 amount: number;
 description: string;
 receiptUrl?: string;
 date: Date | string;
 createdAt: Date | string;
}

export interface Payment {
 id: string;
 invoiceId: string;
 amount: number;
 method: 'upi' | 'card' | 'netbanking' | 'cash';
 upiTxnId?: string;
 status: 'pending' | 'completed' | 'failed';
 paidAt?: Date | string;
 createdAt: Date | string;
}

export interface Category {
 id: string;
 userId: string;
 name: string;
 type: 'income' | 'expense';
 color: string;
 icon: string;
}

export interface GSTReturn {
 id: string;
 userId: string;
 businessId: string;
 financialYear: string;
 quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
 quarterStartDate: Date | string;
 quarterEndDate: Date | string;
 totalTaxableValue: number;
 totalCgst: number;
 totalSgst: number;
 totalIgst: number;
 inputCgst: number;
 inputSgst: number;
 inputIgst: number;
 netCgst: number;
 netSgst: number;
 netIgst: number;
 netLiability: number;
 filingStatus: 'draft' | 'ready_to_file' | 'filed' | 'amended';
 filedAt?: Date | string | null;
 createdAt: Date | string;
}

export interface Transaction {
 id: string;
 type: 'receipt' | 'invoice' | 'expense';
 title: string;
 amount: number;
 date: string;
 status: StatusType;
 icon: string;
}

export interface StatCardData {
 label: string;
 value: string;
 rawValue: number;
 trend: string;
 trendUp: boolean;
 icon: string;
 color: 'primary' | 'success' | 'accent' | 'error';
}

export interface NavItem {
 label: string;
 href: string;
 icon: string;
 activeIcon: string;
}
