# Database Schema — Khatabook AI

> PostgreSQL 15+ · Supabase-compatible · Row Level Security (RLS) enabled
> Generated: 2026-09-06

---

## Table of Contents

1. [Schema Overview](#schema-overview)
2. [Extension Setup](#extension-setup)
3. [Core Tables](#core-tables)
 - [profiles](#profiles)
 - [businesses](#businesses)
 - [categories](#categories)
 - [receipts](#receipts)
 - [invoices](#invoices)
 - [expenses](#expenses)
 - [payments](#payments)
 - [reminders](#reminders)
 - [gst_returns](#gst_returns)
4. [Audit & Logging Tables](#audit--logging-tables)
5. [Indexes](#indexes)
6. [Row Level Security Policies](#row-level-security-policies)
7. [Database Triggers](#database-triggers)
8. [Sample Seed Data](#sample-seed-data)

---

## Schema Overview

| # | Table | Purpose |
|---|-------|---------|
| 1 | `profiles` | User identity & preferences (extends `auth.users`) |
| 2 | `businesses` | Business/brand profiles owned by a user |
| 3 | `categories` | Shared + user-scoped expense/income categories |
| 4 | `receipts` | Uploaded receipt images with AI-extracted data |
| 5 | `invoices` | Created invoices sent to customers |
| 6 | `expenses` | Logged business expenses |
| 7 | `payments` | Payment records for invoices |
| 8 | `reminders` | Automated payment reminders |
| 9 | `gst_returns` | GST quarterly return summaries |

---

## Extension Setup

```sql
-- Run once as superuser / migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- composite indexes for RLS
```

---

## Core Tables

### profiles

Extends Supabase Auth's `auth.users` with app-specific data.

```sql
CREATE TABLE profiles (
 id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

 -- Identity
 full_name TEXT NOT NULL,
 phone TEXT,
 avatar_url TEXT,

 -- Preferences
 preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'mr', 'gu', 'bn')),
 currency TEXT DEFAULT 'INR',
 timezone TEXT DEFAULT 'Asia/Kolkata',

 -- GST fields
 gstin TEXT, -- user's GSTIN
 gst_registration_type TEXT CHECK (
 gst_registration_type IN ('regular', 'composition', 'casual', 'non_resident', 'unregistered')
 ),
 gst_annual_turnover NUMERIC(15, 2), -- determines registration threshold

 -- Account
 email_verified BOOLEAN DEFAULT FALSE,
 onboarding_completed BOOLEAN DEFAULT FALSE,
 free_trial_ends_at TIMESTAMPTZ,
 subscription_plan TEXT DEFAULT 'free' CHECK (
 subscription_plan IN ('free', 'starter', 'pro', 'enterprise')
 ),

 -- AI Usage (for quota tracking)
 ai_credits_used INTEGER DEFAULT 0,
 ai_credits_limit INTEGER DEFAULT 50, -- free plan monthly

 -- Metadata
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT gstin_format CHECK (
 gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
 )
);

-- Trigger for updated_at
CREATE TRIGGER set_profiles_updated_at
 BEFORE UPDATE ON profiles
 FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

### businesses

A user can own multiple businesses (e.g., "Consulting" + "Design Studio").

```sql
CREATE TABLE businesses (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

 -- Business Identity
 name TEXT NOT NULL,
 logo_url TEXT,
 tagline TEXT,

 -- Address
 address_line1 TEXT,
 address_line2 TEXT,
 city TEXT,
 state TEXT NOT NULL, -- Indian state code (e.g., 'MH', 'KA')
 pincode TEXT,
 country TEXT DEFAULT 'India',

 -- Legal
 gstin TEXT,
 pan_number TEXT,
 udyam_registration TEXT, -- Udyam MSME number

 -- Fiscal settings
 financial_year_start_month INTEGER DEFAULT 4, -- April (Indian FY)
 gst_applicable BOOLEAN DEFAULT TRUE,
 tcs_applicable BOOLEAN DEFAULT FALSE,
 tds_applicable BOOLEAN DEFAULT FALSE,

 -- Billing defaults
 default_payment_terms INTEGER DEFAULT 30, -- days
 default_invoice_prefix TEXT DEFAULT 'INV',
 invoice_number_counter INTEGER DEFAULT 0,
 default_currency TEXT DEFAULT 'INR',
 bank_details JSONB DEFAULT '{}'::jsonb,

 -- Status
 is_active BOOLEAN DEFAULT TRUE,

 -- Metadata
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT pan_format CHECK (
 pan_number IS NULL OR pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
 ),
 CONSTRAINT gstin_biz_format CHECK (
 gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
 )
);

CREATE TRIGGER set_businesses_updated_at
 BEFORE UPDATE ON businesses
 FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

### categories

Hierarchical categories for expenses/income. Some system-defined, some user-custom.

```sql
CREATE TABLE categories (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
 -- NULL means it's a system-default category

 parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,

 -- Identity
 name TEXT NOT NULL,
 slug TEXT NOT NULL,
 description TEXT,
 icon TEXT, -- emoji or icon name
 color TEXT DEFAULT '#6B7280', -- hex for UI

 -- Classification
 type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
 category_group TEXT CHECK (
 category_group IN (
 'office', 'travel', 'food', 'utilities',
 'marketing', 'salary', 'software', 'equipment',
 'professional', 'client_payment', 'other'
 )
 ),

 -- GST
 hsn_code TEXT,
 gst_rate NUMERIC(5, 2) DEFAULT 0, -- applicable GST %

 -- System
 is_system_default BOOLEAN DEFAULT FALSE,
 is_active BOOLEAN DEFAULT TRUE,

 created_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT unique_category_per_owner UNIQUE (owner_id, slug)
);

CREATE INDEX idx_categories_owner_type ON categories(owner_id, type) WHERE is_active = TRUE;
```

### receipts

Core table — uploaded receipt/invoice images with AI-extracted structured data.

```sql
CREATE TABLE receipts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,

 -- File storage
 original_image_url TEXT NOT NULL, -- signed S3/R2 URL
 original_filename TEXT,
 file_size_bytes INTEGER,
 mime_type TEXT DEFAULT 'image/jpeg',

 -- Preprocessing
 thumbnail_url TEXT,
 preprocessed_image_url TEXT, -- deskewed, contrast-adjusted

 -- AI Extraction (populated by AI pipeline)
 ai_confidence NUMERIC(3, 2), -- 0.00 – 1.00 overall
 ai_model_version TEXT, -- e.g., 'gpt-4o-2024-08-06'
 ai_raw_response JSONB, -- raw LLM output
 processing_status TEXT DEFAULT 'pending' CHECK (
 processing_status IN (
 'pending', 'processing', 'completed', 'failed', 'review_required'
 )
 ),
 processing_error TEXT,
 processed_at TIMESTAMPTZ,

 -- Extracted fields
 vendor_name TEXT,
 vendor_gstin TEXT,
 vendor_address TEXT,
 invoice_number TEXT,
 invoice_date DATE,
 due_date DATE,

 -- Amounts (all in INR, always positive numbers)
 sub_total NUMERIC(12, 2),
 cgst_amount NUMERIC(12, 2),
 sgst_amount NUMERIC(12, 2),
 igst_amount NUMERIC(12, 2),
 cess_amount NUMERIC(12, 2) DEFAULT 0,
 discount_amount NUMERIC(12, 2) DEFAULT 0,
 total_amount NUMERIC(12, 2),
 currency TEXT DEFAULT 'INR',

 -- Line items (JSONB array of {description, quantity, unit_price, gst_rate, amount})
 line_items JSONB DEFAULT '[]'::jsonb,

 -- Classification
 category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
 suggested_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

 -- Relationships
 linked_invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
 linked_expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,

 -- Human review tracking
 review_status TEXT DEFAULT 'auto' CHECK (
 review_status IN ('auto', 'pending_review', 'approved', 'edited', 'rejected')
 ),
 reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
 reviewed_at TIMESTAMPTZ,

 -- Tags & notes
 tags TEXT[] DEFAULT '{}',
 user_notes TEXT,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT total_equals_sum CHECK (
 total_amount IS NULL OR
 total_amount = COALESCE(sub_total, 0)
 + COALESCE(cgst_amount, 0)
 + COALESCE(sgst_amount, 0)
 + COALESCE(igst_amount, 0)
 + COALESCE(cess_amount, 0)
 - COALESCE(discount_amount, 0)
 )
);

CREATE TRIGGER set_receipts_updated_at
 BEFORE UPDATE ON receipts
 FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

### invoices

Invoices created by the user to bill clients. Supports CGST/SGST/IGST split.

```sql
CREATE TABLE invoices (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 -- Invoice Identity
 invoice_number TEXT NOT NULL,
 invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
 due_date DATE NOT NULL,

 -- Client info (denormalized for snapshot)
 client_name TEXT NOT NULL,
 client_email TEXT,
 client_phone TEXT,
 client_gstin TEXT,
 client_billing_address JSONB DEFAULT '{}'::jsonb,
 client_shipping_address JSONB DEFAULT '{}'::jsonb,

 -- Place of supply (determines IGST vs CGST+SGST)
 place_of_supply TEXT NOT NULL, -- Indian state code

 -- Line items
 line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
 -- Each: { description, hsn_code, quantity, unit, unit_price, discount_pct, gst_rate, amount, cgst, sgst, igst, total }

 -- Totals
 sub_total NUMERIC(12, 2) NOT NULL,
 cgst_amount NUMERIC(12, 2) DEFAULT 0,
 sgst_amount NUMERIC(12, 2) DEFAULT 0,
 igst_amount NUMERIC(12, 2) DEFAULT 0,
 cess_amount NUMERIC(12, 2) DEFAULT 0,
 discount_amount NUMERIC(12, 2) DEFAULT 0,
 round_off NUMERIC(10, 2) DEFAULT 0,
 grand_total NUMERIC(12, 2) NOT NULL,

 -- Reverse charge
 reverse_charge BOOLEAN DEFAULT FALSE,

 -- Notes
 notes TEXT,
 terms_and_conditions TEXT,

 -- PDF
 pdf_url TEXT,

 -- Status
 status TEXT DEFAULT 'draft' CHECK (
 status IN ('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled', 'void')
 ),
 viewed_at TIMESTAMPTZ,
 sent_at TIMESTAMPTZ,

 -- Source tracking
 source_type TEXT DEFAULT 'manual' CHECK (
 source_type IN ('manual', 'receipt_scan', 'import', 'api')
 ),
 source_receipt_id UUID REFERENCES receipts(id) ON DELETE SET NULL,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT grand_total_check CHECK (
 grand_total = sub_total
 + COALESCE(cgst_amount, 0)
 + COALESCE(sgst_amount, 0)
 + COALESCE(igst_amount, 0)
 + COALESCE(cess_amount, 0)
 - COALESCE(discount_amount, 0)
 + COALESCE(round_off, 0)
 ),
 CONSTRAINT unique_invoice_number_per_business UNIQUE (business_id, invoice_number)
);

CREATE TRIGGER set_invoices_updated_at
 BEFORE UPDATE ON invoices
 FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

### expenses

Business expenses logged manually or imported from receipt scans.

```sql
CREATE TABLE expenses (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 -- What was bought
 description TEXT NOT NULL,
 category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
 vendor_name TEXT,
 vendor_gstin TEXT,

 -- Amount
 amount NUMERIC(12, 2) NOT NULL,
 currency TEXT DEFAULT 'INR',

 -- GST breakdown
 gst_applicable BOOLEAN DEFAULT TRUE,
 gst_rate NUMERIC(5, 2) DEFAULT 0,
 cgst_amount NUMERIC(12, 2) DEFAULT 0,
 sgst_amount NUMERIC(12, 2) DEFAULT 0,
 igst_amount NUMERIC(12, 2) DEFAULT 0,
 hsn_code TEXT,

 -- Dates
 expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
 payment_date DATE,

 -- Payment
 payment_method TEXT CHECK (
 payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'wallet', 'other')
 ),

 -- Evidence
 receipt_id UUID REFERENCES receipts(id) ON DELETE SET NULL,

 -- For TDS
 tds_deducted NUMERIC(12, 2) DEFAULT 0,

 -- Source
 source_type TEXT DEFAULT 'manual' CHECK (
 source_type IN ('manual', 'receipt_scan', 'import', 'api')
 ),

 -- Notes
 notes TEXT,
 tags TEXT[] DEFAULT '{}',

 -- Attachments
 attachment_urls TEXT[] DEFAULT '{}',

 -- Soft delete
 deleted_at TIMESTAMPTZ,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT expense_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_expenses_user_business_date
 ON expenses(user_id, business_id, expense_date DESC)
 WHERE deleted_at IS NULL;
```

### payments

Tracks payments received against invoices. Supports multiple payment methods and partial payments.

```sql
CREATE TABLE payments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 -- The invoice being paid
 invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

 -- Amount
 amount NUMERIC(12, 2) NOT NULL,
 currency TEXT DEFAULT 'INR',
 payment_method TEXT NOT NULL CHECK (
 payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'wallet', 'other')
 ),

 -- Payment details
 reference_number TEXT, -- UPI txn ID, cheque number, etc.
 payment_date DATE NOT NULL DEFAULT CURRENT_DATE,

 -- Bank / UPI details
 bank_name TEXT,
 account_last_four TEXT,

 -- TDS on received payment
 tds_deducted NUMERIC(12, 2) DEFAULT 0,

 -- Notes
 notes TEXT,
 attachment_urls TEXT[] DEFAULT '{}', -- payment proof screenshots

 -- Status
 status TEXT DEFAULT 'completed' CHECK (
 status IN ('pending', 'completed', 'failed', 'refunded')
 ),

 -- Who recorded it
 recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT payment_amount_positive CHECK (amount > 0),

 -- Prevent duplicate payments on same invoice with same reference
 CONSTRAINT unique_payment_reference UNIQUE (invoice_id, reference_number, amount)
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_user_business_date ON payments(user_id, business_id, payment_date DESC);
```

### reminders

Automated payment reminders for overdue invoices.

```sql
CREATE TABLE reminders (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

 -- What it's for
 invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
 recipient_email TEXT NOT NULL,
 recipient_name TEXT,

 -- Scheduling
 reminder_type TEXT NOT NULL CHECK (
 reminder_type IN ('before_due', 'on_due', 'after_due_1', 'after_due_7', 'after_due_15', 'custom')
 ),
 scheduled_at TIMESTAMPTZ NOT NULL,

 -- Execution
 status TEXT DEFAULT 'scheduled' CHECK (
 status IN ('scheduled', 'sent', 'failed', 'cancelled')
 ),
 sent_at TIMESTAMPTZ,
 failed_reason TEXT,

 -- Email tracking
 email_message_id TEXT,
 email_opened BOOLEAN DEFAULT FALSE,
 email_clicked BOOLEAN DEFAULT FALSE,

 -- Template used
 template_id TEXT DEFAULT 'standard_reminder',

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminders_scheduled ON reminders(scheduled_at)
 WHERE status = 'scheduled';
```

### gst_returns

Quarterly GST return summaries generated from expense/invoice data.

```sql
CREATE TABLE gst_returns (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 -- Period
 financial_year TEXT NOT NULL, -- e.g., '2025-26'
 quarter TEXT NOT NULL CHECK (
 quarter IN ('Q1', 'Q2', 'Q3', 'Q4')
 ),
 quarter_start_date DATE NOT NULL,
 quarter_end_date DATE NOT NULL,

 -- GSTR-1 (Outward supplies / sales)
 total_taxable_value NUMERIC(15, 2) DEFAULT 0,
 total_cgst NUMERIC(12, 2) DEFAULT 0,
 total_sgst NUMERIC(12, 2) DEFAULT 0,
 total_igst NUMERIC(12, 2) DEFAULT 0,
 total_cess NUMERIC(12, 2) DEFAULT 0,

 -- GSTR-2A / GSTR-2B (Inward supplies / purchases — auto-populated by govt)
 input_cgst NUMERIC(12, 2) DEFAULT 0,
 input_sgst NUMERIC(12, 2) DEFAULT 0,
 input_igst NUMERIC(12, 2) DEFAULT 0,
 input_cess NUMERIC(12, 2) DEFAULT 0,

 -- Computed
 net_cgst NUMERIC(12, 2) GENERATED ALWAYS AS (total_cgst - input_cgst) STORED,
 net_sgst NUMERIC(12, 2) GENERATED ALWAYS AS (total_sgst - input_sgst) STORED,
 net_igst NUMERIC(12, 2) GENERATED ALWAYS AS (total_igst - input_igst) STORED,

 -- GSTR-3B (Monthly summary)
 gstr3b_total_liability NUMERIC(12, 2) GENERATED ALWAYS AS (
 (total_cgst - input_cgst)
 + (total_sgst - input_sgst)
 + (total_igst - input_igst)
 ) STORED,

 -- B2B invoice count
 b2b_invoice_count INTEGER DEFAULT 0,

 -- HSN-wise summary (JSONB)
 hsn_summary JSONB DEFAULT '[]'::jsonb,

 -- Filing
 filing_status TEXT DEFAULT 'draft' CHECK (
 filing_status IN ('draft', 'ready_to_file', 'filed', 'amended')
 ),
 filed_at TIMESTAMPTZ,
 acknowledgment_number TEXT,

 -- Metadata
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT unique_gst_period UNIQUE (business_id, financial_year, quarter)
);
```

---

## Audit & Logging Tables

```sql
-- Tracks all mutations for compliance and debugging
CREATE TABLE audit_logs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

 table_name TEXT NOT NULL,
 record_id UUID NOT NULL,
 operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),

 old_values JSONB,
 new_values JSONB,

 ip_address INET,
 user_agent TEXT,

 created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_table ON audit_logs(user_id, table_name, created_at DESC);
CREATE INDEX idx_audit_logs_record ON audit_logs(table_name, record_id, created_at DESC);

-- AI processing job tracking
CREATE TABLE ai_jobs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 receipt_id UUID REFERENCES receipts(id) ON DELETE CASCADE,

 job_type TEXT NOT NULL CHECK (
 job_type IN ('receipt_extraction', 'categorization', 'gst_prediction', 'anomaly_detection')
 ),

 status TEXT DEFAULT 'queued' CHECK (
 status IN ('queued', 'processing', 'completed', 'failed', 'retrying')
 ),

 -- AI metadata
 model_used TEXT,
 prompt_tokens INTEGER,
 completion_tokens INTEGER,
 total_cost_usd NUMERIC(10, 4),
 latency_ms INTEGER,

 -- Results
 result JSONB,
 error TEXT,

 -- Retry tracking
 retry_count INTEGER DEFAULT 0,
 max_retries INTEGER DEFAULT 3,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 started_at TIMESTAMPTZ,
 completed_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_jobs_receipt ON ai_jobs(receipt_id);
CREATE INDEX idx_ai_jobs_user_status ON ai_jobs(user_id, status, created_at DESC);
```

---

## Indexes

```sql
-- Composite indexes for common query patterns

-- Receipts: user's recent scans with category
CREATE INDEX idx_receipts_user_biz_date
 ON receipts(user_id, business_id, created_at DESC)
 WHERE processing_status = 'completed';

-- Invoices: user's invoices by status + date
CREATE INDEX idx_invoices_user_status_date
 ON invoices(user_id, status, due_date)
 WHERE status NOT IN ('void', 'cancelled');

-- Expenses: filtered reports
CREATE INDEX idx_expenses_user_category_date
 ON expenses(user_id, category_id, expense_date DESC)
 WHERE deleted_at IS NULL;

-- Payments: reconciliation lookups
CREATE INDEX idx_payments_invoice_status
 ON payments(invoice_id, status, payment_date);

-- AI jobs: queue processing
CREATE INDEX idx_ai_jobs_queued
 ON ai_jobs(status, created_at)
 WHERE status IN ('queued', 'retrying');

-- Full-text search on vendor names and descriptions
CREATE INDEX idx_receipts_vendor_fts
 ON receipts USING GIN (to_tsvector('english', COALESCE(vendor_name, '')));

CREATE INDEX idx_invoices_client_fts
 ON invoices USING GIN (to_tsvector('english', COALESCE(client_name, '')));
```

---

## Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gst_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES
-- ============================================================

-- Users can view/update their own profile
CREATE POLICY "Users view own profile"
 ON profiles FOR SELECT
 USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
 ON profiles FOR UPDATE
 USING (auth.uid() = id);

-- Service role bypasses all for backend operations
CREATE POLICY "Service role full access"
 ON profiles FOR ALL
 USING (auth.role() = 'service_role');

-- ============================================================
-- BUSINESSES
-- ============================================================

CREATE POLICY "Users view own businesses"
 ON businesses FOR SELECT
 USING (
 auth.uid() = owner_id
 OR EXISTS (
 SELECT 1 FROM business_members bm
 WHERE bm.business_id = businesses.id
 AND bm.user_id = auth.uid()
 AND bm.status = 'active'
 )
 );

CREATE POLICY "Users manage own businesses"
 ON businesses FOR INSERT
 WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users update own businesses"
 ON businesses FOR UPDATE
 USING (auth.uid() = owner_id);

CREATE POLICY "Users delete own businesses"
 ON businesses FOR DELETE
 USING (auth.uid() = owner_id);

-- ============================================================
-- CATEGORIES
-- ============================================================

-- System defaults are readable by all
CREATE POLICY "Anyone view active categories"
 ON categories FOR SELECT
 USING (
 is_system_default = TRUE
 OR owner_id = auth.uid()
 );

CREATE POLICY "Users create categories"
 ON categories FOR INSERT
 WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users update own categories"
 ON categories FOR UPDATE
 USING (auth.uid() = owner_id AND is_system_default = FALSE);

CREATE POLICY "Users delete own categories"
 ON categories FOR DELETE
 USING (auth.uid() = owner_id AND is_system_default = FALSE);

-- ============================================================
-- RECEIPTS
-- ============================================================

CREATE POLICY "Users manage own receipts"
 ON receipts FOR ALL
 USING (
 user_id = auth.uid()
 OR EXISTS (
 SELECT 1 FROM business_members bm
 WHERE bm.business_id = receipts.business_id
 AND bm.user_id = auth.uid()
 AND bm.status = 'active'
 )
 );

-- ============================================================
-- INVOICES
-- ============================================================

CREATE POLICY "Users manage own invoices"
 ON invoices FOR ALL
 USING (
 user_id = auth.uid()
 OR EXISTS (
 SELECT 1 FROM business_members bm
 WHERE bm.business_id = invoices.business_id
 AND bm.user_id = auth.uid()
 AND bm.status = 'active'
 )
 );

-- Public link access (read-only for shareable invoice links)
CREATE POLICY "Public read via token"
 ON invoices FOR SELECT
 USING (true); -- Frontend gates by validating share token before rendering

-- ============================================================
-- EXPENSES
-- ============================================================

CREATE POLICY "Users manage own expenses"
 ON expenses FOR ALL
 USING (
 user_id = auth.uid()
 OR EXISTS (
 SELECT 1 FROM business_members bm
 WHERE bm.business_id = expenses.business_id
 AND bm.user_id = auth.uid()
 AND bm.status = 'active'
 )
 );

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE POLICY "Users manage own payments"
 ON payments FOR ALL
 USING (
 user_id = auth.uid()
 OR EXISTS (
 SELECT 1 FROM business_members bm
 WHERE bm.business_id = payments.business_id
 AND bm.user_id = auth.uid()
 AND bm.status = 'active'
 )
 );

-- ============================================================
-- REMINDERS
-- ============================================================

CREATE POLICY "Users manage own reminders"
 ON reminders FOR ALL
 USING (user_id = auth.uid());

-- ============================================================
-- GST RETURNS
-- ============================================================

CREATE POLICY "Users manage own gst returns"
 ON gst_returns FOR ALL
 USING (
 user_id = auth.uid()
 OR EXISTS (
 SELECT 1 FROM business_members bm
 WHERE bm.business_id = gst_returns.business_id
 AND bm.user_id = auth.uid()
 AND bm.status = 'active'
 )
 );

-- ============================================================
-- AUDIT LOGS
-- ============================================================

CREATE POLICY "Users view own audit logs"
 ON audit_logs FOR SELECT
 USING (user_id = auth.uid());

CREATE POLICY "Service inserts audit logs"
 ON audit_logs FOR INSERT
 WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- AI JOBS
-- ============================================================

CREATE POLICY "Users view own ai jobs"
 ON ai_jobs FOR SELECT
 USING (user_id = auth.uid());

CREATE POLICY "Service manages ai jobs"
 ON ai_jobs FOR ALL
 USING (auth.role() = 'service_role');
```

---

## Database Triggers

```sql
-- Updated-at helper (idempotent guard)
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update invoice status based on payment
CREATE OR REPLACE FUNCTION update_invoice_payment_status()
RETURNS TRIGGER AS $$
DECLARE
 total_paid NUMERIC(12, 2);
 inv_grand_total NUMERIC(12, 2);
 current_status TEXT;
BEGIN
 SELECT grand_total INTO inv_grand_total
 FROM invoices WHERE id = NEW.invoice_id;

 SELECT COALESCE(SUM(amount), 0) INTO total_paid
 FROM payments
 WHERE invoice_id = NEW.invoice_id
 AND status = 'completed';

 SELECT status INTO current_status
 FROM invoices WHERE id = NEW.invoice_id;

 IF total_paid >= inv_grand_total AND current_status NOT IN ('paid', 'cancelled', 'void') THEN
 UPDATE invoices SET status = 'paid', updated_at = NOW() WHERE id = NEW.invoice_id;
 ELSIF total_paid > 0 AND total_paid < inv_grand_total AND current_status NOT IN ('partial', 'paid', 'cancelled', 'void') THEN
 UPDATE invoices SET status = 'partial', updated_at = NOW() WHERE id = NEW.invoice_id;
 END IF;

 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_invoice_payment_status
 AFTER INSERT OR UPDATE OF amount, status ON payments
 FOR EACH ROW
 WHEN (NEW.invoice_id IS NOT NULL)
 EXECUTE FUNCTION update_invoice_payment_status();

-- Audit log trigger (generic)
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
 IF auth.uid() IS NOT NULL THEN
 INSERT INTO audit_logs (user_id, table_name, record_id, operation, old_values, new_values)
 VALUES (
 auth.uid(),
 TG_TABLE_NAME,
 COALESCE(NEW.id, OLD.id),
 TG_OP,
 CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
 CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
 );
 END IF;
 RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to key tables
CREATE TRIGGER audit_receipts AFTER INSERT OR UPDATE OR DELETE ON receipts
 FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_invoices AFTER INSERT OR UPDATE OR DELETE ON invoices
 FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_expenses AFTER INSERT OR UPDATE OR DELETE ON expenses
 FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
 FOR EACH ROW EXECUTE FUNCTION log_audit();
```

---

## Supporting Table: business_members

For teams/multi-user access:

```sql
CREATE TABLE business_members (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

 role TEXT DEFAULT 'member' CHECK (
 role IN ('owner', 'admin', 'accountant', 'member', 'viewer')
 ),

 status TEXT DEFAULT 'pending' CHECK (
 status IN ('pending', 'active', 'inactive')
 ),

 invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
 invited_at TIMESTAMPTZ DEFAULT NOW(),
 accepted_at TIMESTAMPTZ,

 created_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT unique_business_member UNIQUE (business_id, user_id)
);

CREATE INDEX idx_business_members_business ON business_members(business_id, status);
```

---

## Sample Seed Data

```sql
-- ============================================================
-- SYSTEM CATEGORIES
-- ============================================================

INSERT INTO categories (id, owner_id, name, slug, type, category_group, gst_rate, is_system_default) VALUES
-- Expense categories
(uuid_generate_v4(), NULL, 'Office Supplies', 'office-supplies', 'expense', 'office', 18, TRUE),
(uuid_generate_v4(), NULL, 'Travel & Transport', 'travel-transport', 'expense', 'travel', 5, TRUE),
(uuid_generate_v4(), NULL, 'Meals & Entertainment', 'meals-entertainment', 'expense', 'food', 5, TRUE),
(uuid_generate_v4(), NULL, 'Electricity & Utilities', 'electricity-utilities', 'expense', 'utilities', 18, TRUE),
(uuid_generate_v4(), NULL, 'Internet & Phone', 'internet-phone', 'expense', 'utilities', 18, TRUE),
(uuid_generate_v4(), NULL, 'Marketing & Advertising', 'marketing-advertising', 'expense', 'marketing', 18, TRUE),
(uuid_generate_v4(), NULL, 'Software & Subscriptions', 'software-subscriptions', 'expense', 'software', 18, TRUE),
(uuid_generate_v4(), NULL, 'Equipment & Hardware', 'equipment-hardware', 'expense', 'equipment', 18, TRUE),
(uuid_generate_v4(), NULL, 'Professional Services', 'professional-services', 'expense', 'professional', 18, TRUE),
(uuid_generate_v4(), NULL, 'Salary & Wages', 'salary-wages', 'expense', 'salary', NULL, TRUE),
(uuid_generate_v4(), NULL, 'Rent & Office Space', 'rent-office', 'expense', 'office', NULL, TRUE),
(uuid_generate_v4(), NULL, 'Insurance', 'insurance', 'expense', 'professional', 18, TRUE),
(uuid_generate_v4(), NULL, 'Fuel', 'fuel', 'expense', 'travel', 5, TRUE),
(uuid_generate_v4(), NULL, 'Courier & Shipping', 'courier-shipping', 'expense', 'other', 18, TRUE),
(uuid_generate_v4(), NULL, 'Training & Courses', 'training-courses', 'expense', 'professional', 18, TRUE),

-- Income categories
(uuid_generate_v4(), NULL, 'Client Payment', 'client-payment', 'income', 'client_payment', NULL, TRUE),
(uuid_generate_v4(), NULL, 'Freelance Project', 'freelance-project', 'income', 'client_payment', NULL, TRUE),
(uuid_generate_v4(), NULL, 'Consulting', 'consulting', 'income', 'professional', NULL, TRUE),
(uuid_generate_v4(), NULL, 'Royalties', 'royalties', 'income', 'other', NULL, TRUE),
(uuid_generate_v4(), NULL, 'Interest Income', 'interest-income', 'income', 'other', NULL, TRUE);

-- ============================================================
-- DEMO USER
-- ============================================================

-- (In real app, this is created via auth.signup)
-- The UUID below matches the auth.users entry
INSERT INTO profiles (id, full_name, phone, gstin, gst_registration_type, onboarding_completed)
VALUES (
 '00000000-0000-0000-0000-000000000001',
 'Rahul Sharma',
 '+919876543210',
 '27AAPCS1234R1ZN',
 'regular',
 TRUE
);

INSERT INTO businesses (id, owner_id, name, state, gstin, pan_number, gst_applicable) VALUES
(
 '10000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 'Rahul Design Studio',
 'MH',
 '27AAPCS1234R1ZN',
 'AAPCS1234R',
 TRUE
);

-- ============================================================
-- DEMO INVOICE
-- ============================================================

INSERT INTO invoices (
 id, user_id, business_id, invoice_number, invoice_date, due_date,
 client_name, client_email, client_gstin, place_of_supply,
 line_items, sub_total, cgst_amount, sgst_amount, grand_total,
 status, source_type
) VALUES (
 '20000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000001',
 'INV-001',
 '2026-01-15',
 '2026-02-14',
 'TechCorp Solutions Pvt Ltd',
 'billing@techcorp.in',
 '27AABCT1234R1ZX',
 'MH',
 '[
 {
 "description": "UI/UX Design Services — Website Redesign",
 "hsn_code": "998314",
 "quantity": 1,
 "unit": "project",
 "unit_price": 50000.00,
 "discount_pct": 0,
 "gst_rate": 18,
 "amount": 50000.00,
 "cgst": 4500.00,
 "sgst": 4500.00,
 "igst": 0,
 "total": 59000.00
 }
 ]'::jsonb,
 50000.00, 4500.00, 4500.00, 59000.00,
 'paid',
 'manual'
);

-- ============================================================
-- DEMO PAYMENT
-- ============================================================

INSERT INTO payments (
 id, user_id, business_id, invoice_id, amount, payment_method, reference_number, payment_date
) VALUES (
 '30000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000001',
 '20000000-0000-0000-0000-000000000001',
 59000.00,
 'upi',
 'UPI123456789',
 '2026-01-20'
);

-- ============================================================
-- DEMO RECEIPT
-- ============================================================

INSERT INTO receipts (
 id, user_id, business_id, original_image_url, thumbnail_url,
 processing_status, vendor_name, invoice_number, invoice_date, total_amount,
 sub_total, cgst_amount, sgst_amount, line_items, category_id, review_status
) VALUES (
 '40000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000001',
 'https://storage.example.com/receipts/40000000-0000-0000-0000-000000000001.jpg',
 'https://storage.example.com/receipts/thumbs/40000000-0000-0000-0000-000000000001.jpg',
 'completed',
 'Amazon Web Services',
 'INV-AWS-2026-001',
 '2026-01-10',
 4240.00,
 4000.00, 360.00, 360.00,
 '[
 {"description": "AWS EC2 t3.medium (monthly)", "quantity": 1, "unit_price": 4000.00, "gst_rate": 18, "amount": 4000.00}
 ]'::jsonb,
 (SELECT id FROM categories WHERE slug = 'software-subscriptions' AND is_system_default = TRUE LIMIT 1),
 'approved'
);

-- ============================================================
-- DEMO EXPENSE
-- ============================================================

INSERT INTO expenses (
 id, user_id, business_id, description, category_id, vendor_name,
 amount, gst_applicable, gst_rate, cgst_amount, sgst_amount, hsn_code,
 expense_date, payment_method, receipt_id
) VALUES (
 '50000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000001',
 'Office Supplies — Stationery',
 (SELECT id FROM categories WHERE slug = 'office-supplies' AND is_system_default = TRUE LIMIT 1),
 'Navketan Stationers',
 2360.00, TRUE, 18, 212.40, 212.40, '9608',
 '2026-01-12', 'cash',
 '40000000-0000-0000-0000-000000000001'
);

-- ============================================================
-- DEMO GST RETURN
-- ============================================================

INSERT INTO gst_returns (
 id, user_id, business_id, financial_year, quarter,
 quarter_start_date, quarter_end_date,
 total_taxable_value, total_cgst, total_sgst, total_igst,
 input_cgst, input_sgst, input_igst,
 b2b_invoice_count, filing_status
) VALUES (
 '60000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000001',
 '10000000-0000-0000-0000-000000000001',
 '2025-26', 'Q3',
 '2025-10-01', '2025-12-31',
 50000.00, 4500.00, 4500.00, 0,
 360.00, 212.40, 0,
 1, 'draft'
);
```

---

## Schema Diagram (Textual ERD)

```
profiles (1) ─────< (N) businesses
 │
 ├─< (N) categories
 ├─< (N) receipts ────> categories
 ├─< (N) invoices ─────> businesses
 │ ├─ (1) ──> (N) payments
 │ └─ (1) ──> (N) reminders
 ├─< (N) expenses ─────> categories
 ├─< (N) payments ─────> invoices
 ├─< (N) reminders ────> invoices
 ├─< (N) gst_returns ──> businesses
 ├─< (N) ai_jobs ──────> receipts
 └─< (N) audit_logs

businesses (1) ──< (N) business_members ──> profiles (many-to-many)
```

---

## Migration Order

```
1. Extensions
2. Helper functions (handle_updated_at)
3. profiles
4. businesses
5. categories
6. receipts
7. invoices
8. expenses
9. payments
10. reminders
11. gst_returns
12. business_members
13. audit_logs
14. ai_jobs
15. Indexes
16. RLS Policies
17. Triggers
18. Seed Data
```
