import { z } from 'zod';

// ============================================================
// Receipt
// ============================================================

export interface Receipt {
 id: string;
 user_id: string;
 business_id?: string;
 original_image_url: string;
 original_filename?: string;
 file_size_bytes?: number;
 mime_type: string;
 thumbnail_url?: string;
 preprocessed_image_url?: string;
 ai_confidence?: number;
 ai_model_version?: string;
 ai_raw_response?: Record<string, unknown>;
 processing_status: 'pending' | 'processing' | 'completed' | 'failed' | 'review_required';
 processing_error?: string;
 processed_at?: string;
 vendor_name?: string;
 vendor_gstin?: string;
 vendor_address?: string;
 invoice_number?: string;
 invoice_date?: string;
 due_date?: string;
 sub_total?: number;
 cgst_amount?: number;
 sgst_amount?: number;
 igst_amount?: number;
 cess_amount?: number;
 discount_amount?: number;
 total_amount?: number;
 currency: string;
 line_items?: Record<string, unknown>[];
 category_id?: string;
 suggested_category_id?: string;
 linked_invoice_id?: string;
 linked_expense_id?: string;
 review_status: 'auto' | 'pending_review' | 'approved' | 'edited' | 'rejected';
 reviewed_by?: string;
 reviewed_at?: string;
 tags: string[];
 user_notes?: string;
 created_at: string;
 updated_at: string;
}

// ============================================================
// Invoice
// ============================================================

export interface Invoice {
 id: string;
 user_id: string;
 business_id: string;
 invoice_number: string;
 invoice_date: string;
 due_date: string;
 client_name: string;
 client_email?: string;
 client_phone?: string;
 client_gstin?: string;
 client_billing_address: Record<string, unknown>;
 client_shipping_address: Record<string, unknown>;
 place_of_supply: string;
 line_items: InvoiceLineItem[];
 sub_total: number;
 cgst_amount: number;
 sgst_amount: number;
 igst_amount: number;
 cess_amount: number;
 discount_amount: number;
 round_off: number;
 grand_total: number;
 reverse_charge: boolean;
 notes?: string;
 terms_and_conditions?: string;
 pdf_url?: string;
 status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'void';
 viewed_at?: string;
 sent_at?: string;
 source_type: 'manual' | 'receipt_scan' | 'import' | 'api';
 source_receipt_id?: string;
 created_at: string;
 updated_at: string;
}

export interface InvoiceLineItem {
 description: string;
 hsn_code?: string;
 quantity: number;
 unit: string;
 unit_price: number;
 discount_pct: number;
 gst_rate: number;
 amount: number;
 cgst: number;
 sgst: number;
 igst: number;
 total: number;
}

// ============================================================
// Expense
// ============================================================

export interface Expense {
 id: string;
 user_id: string;
 business_id: string;
 description: string;
 category_id: string;
 vendor_name?: string;
 vendor_gstin?: string;
 amount: number;
 currency: string;
 gst_applicable: boolean;
 gst_rate?: number;
 cgst_amount?: number;
 sgst_amount?: number;
 igst_amount?: number;
 hsn_code?: string;
 expense_date: string;
 payment_date?: string;
 payment_method?: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card' | 'wallet' | 'other';
 receipt_id?: string;
 tds_deducted: number;
 source_type: 'manual' | 'receipt_scan' | 'import' | 'api';
 notes?: string;
 tags: string[];
 attachment_urls: string[];
 deleted_at?: string;
 created_at: string;
 updated_at: string;
}

// ============================================================
// Payment
// ============================================================

export interface Payment {
 id: string;
 user_id: string;
 business_id: string;
 invoice_id: string;
 amount: number;
 currency: string;
 payment_method: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'card' | 'wallet' | 'other';
 reference_number?: string;
 payment_date: string;
 bank_name?: string;
 account_last_four?: string;
 tds_deducted: number;
 notes?: string;
 attachment_urls: string[];
 status: 'pending' | 'completed' | 'failed' | 'refunded';
 recorded_by?: string;
 created_at: string;
 updated_at: string;
}

// ============================================================
// Category
// ============================================================

export interface Category {
 id: string;
 owner_id?: string;
 parent_id?: string;
 name: string;
 slug: string;
 description?: string;
 icon?: string;
 color: string;
 type: 'income' | 'expense' | 'transfer';
 category_group?: 'office' | 'travel' | 'food' | 'utilities' | 'marketing' | 'salary' | 'software' | 'equipment' | 'professional' | 'client_payment' | 'other';
 hsn_code?: string;
 gst_rate?: number;
 is_system_default: boolean;
 is_active: boolean;
 created_at: string;
}

// ============================================================
// GST Return
// ============================================================

export interface GSTReturn {
 id: string;
 user_id: string;
 business_id: string;
 financial_year: string;
 quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
 quarter_start_date: string;
 quarter_end_date: string;
 total_taxable_value: number;
 total_cgst: number;
 total_sgst: number;
 total_igst: number;
 total_cess: number;
 input_cgst: number;
 input_sgst: number;
 input_igst: number;
 input_cess: number;
 net_cgst: number;
 net_sgst: number;
 net_igst: number;
 gstr3b_total_liability: number;
 b2b_invoice_count: number;
 hsn_summary: Record<string, unknown>[];
 filing_status: 'draft' | 'ready_to_file' | 'filed' | 'amended';
 filed_at?: string;
 acknowledgment_number?: string;
 created_at: string;
 updated_at: string;
}

// ============================================================
// User
// ============================================================

export interface User {
 id: string;
 full_name: string;
 phone?: string;
 avatar_url?: string;
 preferred_language: string;
 currency: string;
 timezone: string;
 gstin?: string;
 gst_registration_type?: string;
 gst_annual_turnover?: number;
 email_verified: boolean;
 onboarding_completed: boolean;
 free_trial_ends_at?: string;
 subscription_plan: 'free' | 'starter' | 'pro' | 'enterprise';
 ai_credits_used: number;
 ai_credits_limit: number;
 created_at: string;
 updated_at: string;
}

// ============================================================
// Business
// ============================================================

export interface Business {
 id: string;
 owner_id: string;
 name: string;
 logo_url?: string;
 tagline?: string;
 address_line1?: string;
 address_line2?: string;
 city?: string;
 state: string;
 pincode?: string;
 country: string;
 gstin?: string;
 pan_number?: string;
 udyam_registration?: string;
 financial_year_start_month: number;
 gst_applicable: boolean;
 tcs_applicable: boolean;
 tds_applicable: boolean;
 default_payment_terms: number;
 default_invoice_prefix: string;
 invoice_number_counter: number;
 default_currency: string;
 bank_details: Record<string, unknown>;
 is_active: boolean;
 created_at: string;
 updated_at: string;
}

// ============================================================
// Pagination
// ============================================================

export interface PaginatedResult<T> {
 items: T[];
 pagination: {
 page: number;
 limit: number;
 total: number;
 pages: number;
 };
}

// ============================================================
// Standard API Response
// ============================================================

export interface ApiResponse<T = unknown> {
 success: boolean;
 data?: T;
 error?: {
 code: string;
 message: string;
 details?: Record<string, unknown>;
 };
}
