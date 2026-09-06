-- ============================================================
-- Khatabook AI — Initial Schema Migration
-- PostgreSQL 15+ · Supabase-compatible · RLS enabled
-- ============================================================

-- ============================================================
-- Extensions
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- Helper Functions
-- ============================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
 NEW.updated_at = NOW();
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_invoice_counter(p_business_id UUID)
RETURNS TEXT AS $$
DECLARE
 prefix TEXT;
 next_num INTEGER;
 result TEXT;
BEGIN
 SELECT default_invoice_prefix, invoice_number_counter
 INTO prefix, next_num
 FROM businesses
 WHERE id = p_business_id;

 prefix := COALESCE(prefix, 'INV');
 next_num := COALESCE(next_num, 0) + 1;

 UPDATE businesses
 SET invoice_number_counter = next_num
 WHERE id = p_business_id;

 result := prefix || '-' || LPAD(next_num::TEXT, 4, '0');
 RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Profiles (extends auth.users)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
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
 gstin TEXT,
 gst_registration_type TEXT CHECK (
 gst_registration_type IN ('regular', 'composition', 'casual', 'non_resident', 'unregistered')
 ),
 gst_annual_turnover NUMERIC(15, 2),

 -- Account
 email_verified BOOLEAN DEFAULT FALSE,
 onboarding_completed BOOLEAN DEFAULT FALSE,
 free_trial_ends_at TIMESTAMPTZ,
 subscription_plan TEXT DEFAULT 'free' CHECK (
 subscription_plan IN ('free', 'starter', 'pro', 'enterprise')
 ),

 -- AI Usage
 ai_credits_used INTEGER DEFAULT 0,
 ai_credits_limit INTEGER DEFAULT 50,

 -- Metadata
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT gstin_format CHECK (
 gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
 )
);

CREATE TRIGGER set_profiles_updated_at
 BEFORE UPDATE ON profiles
 FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- Businesses
-- ============================================================

CREATE TABLE IF NOT EXISTS businesses (
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
 state TEXT NOT NULL,
 pincode TEXT,
 country TEXT DEFAULT 'India',

 -- Legal
 gstin TEXT,
 pan_number TEXT,
 udyam_registration TEXT,

 -- Fiscal settings
 financial_year_start_month INTEGER DEFAULT 4,
 gst_applicable BOOLEAN DEFAULT TRUE,
 tcs_applicable BOOLEAN DEFAULT FALSE,
 tds_applicable BOOLEAN DEFAULT FALSE,

 -- Billing defaults
 default_payment_terms INTEGER DEFAULT 30,
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

-- ============================================================
-- Categories
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
 parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,

 -- Identity
 name TEXT NOT NULL,
 slug TEXT NOT NULL,
 description TEXT,
 icon TEXT,
 color TEXT DEFAULT '#6B7280',

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
 gst_rate NUMERIC(5, 2) DEFAULT 0,

 -- System
 is_system_default BOOLEAN DEFAULT FALSE,
 is_active BOOLEAN DEFAULT TRUE,

 created_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT unique_category_per_owner UNIQUE (owner_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_owner_type ON categories(owner_id, type) WHERE is_active = TRUE;

-- ============================================================
-- Receipts
// ============================================================

CREATE TABLE IF NOT EXISTS receipts (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,

 -- File storage
 original_image_url TEXT NOT NULL,
 original_filename TEXT,
 file_size_bytes INTEGER,
 mime_type TEXT DEFAULT 'image/jpeg',

 -- Preprocessing
 thumbnail_url TEXT,
 preprocessed_image_url TEXT,

 -- AI Extraction
 ai_confidence NUMERIC(3, 2),
 ai_model_version TEXT,
 ai_raw_response JSONB,
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

 -- Amounts (all in INR)
 sub_total NUMERIC(12, 2),
 cgst_amount NUMERIC(12, 2),
 sgst_amount NUMERIC(12, 2),
 igst_amount NUMERIC(12, 2),
 cess_amount NUMERIC(12, 2) DEFAULT 0,
 discount_amount NUMERIC(12, 2) DEFAULT 0,
 total_amount NUMERIC(12, 2),
 currency TEXT DEFAULT 'INR',

 -- Line items (JSONB array)
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

-- ============================================================
-- Invoices
// ============================================================

CREATE TABLE IF NOT EXISTS invoices (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 -- Invoice Identity
 invoice_number TEXT NOT NULL,
 invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
 due_date DATE NOT NULL,

 -- Client info
 client_name TEXT NOT NULL,
 client_email TEXT,
 client_phone TEXT,
 client_gstin TEXT,
 client_billing_address JSONB DEFAULT '{}'::jsonb,
 client_shipping_address JSONB DEFAULT '{}'::jsonb,

 -- Place of supply
 place_of_supply TEXT NOT NULL,

 -- Line items
 line_items JSONB NOT NULL DEFAULT '[]'::jsonb,

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

-- ============================================================
-- Expenses
// ============================================================

CREATE TABLE IF NOT EXISTS expenses (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 description TEXT NOT NULL,
 category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
 vendor_name TEXT,
 vendor_gstin TEXT,

 amount NUMERIC(12, 2) NOT NULL,
 currency TEXT DEFAULT 'INR',

 gst_applicable BOOLEAN DEFAULT TRUE,
 gst_rate NUMERIC(5, 2) DEFAULT 0,
 cgst_amount NUMERIC(12, 2) DEFAULT 0,
 sgst_amount NUMERIC(12, 2) DEFAULT 0,
 igst_amount NUMERIC(12, 2) DEFAULT 0,
 hsn_code TEXT,

 expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
 payment_date DATE,

 payment_method TEXT CHECK (
 payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'wallet', 'other')
 ),

 receipt_id UUID REFERENCES receipts(id) ON DELETE SET NULL,

 tds_deducted NUMERIC(12, 2) DEFAULT 0,

 source_type TEXT DEFAULT 'manual' CHECK (
 source_type IN ('manual', 'receipt_scan', 'import', 'api')
 ),

 notes TEXT,
 tags TEXT[] DEFAULT '{}',
 attachment_urls TEXT[] DEFAULT '{}',

 deleted_at TIMESTAMPTZ,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT expense_amount_positive CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_business_date
 ON expenses(user_id, business_id, expense_date DESC)
 WHERE deleted_at IS NULL;

-- ============================================================
-- Payments
// ============================================================

CREATE TABLE IF NOT EXISTS payments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

 amount NUMERIC(12, 2) NOT NULL,
 currency TEXT DEFAULT 'INR',
 payment_method TEXT NOT NULL CHECK (
 payment_method IN ('cash', 'upi', 'bank_transfer', 'cheque', 'card', 'wallet', 'other')
 ),

 reference_number TEXT,
 payment_date DATE NOT NULL DEFAULT CURRENT_DATE,

 bank_name TEXT,
 account_last_four TEXT,

 tds_deducted NUMERIC(12, 2) DEFAULT 0,

 notes TEXT,
 attachment_urls TEXT[] DEFAULT '{}',

 status TEXT DEFAULT 'completed' CHECK (
 status IN ('pending', 'completed', 'failed', 'refunded')
 ),

 recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT payment_amount_positive CHECK (amount > 0),
 CONSTRAINT unique_payment_reference UNIQUE (invoice_id, reference_number, amount)
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_business_date ON payments(user_id, business_id, payment_date DESC);

-- ============================================================
-- Reminders
// ============================================================

CREATE TABLE IF NOT EXISTS reminders (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

 invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
 recipient_email TEXT NOT NULL,
 recipient_name TEXT,

 reminder_type TEXT NOT NULL CHECK (
 reminder_type IN ('before_due', 'on_due', 'after_due_1', 'after_due_7', 'after_due_15', 'custom')
 ),
 scheduled_at TIMESTAMPTZ NOT NULL,

 status TEXT DEFAULT 'scheduled' CHECK (
 status IN ('scheduled', 'sent', 'failed', 'cancelled')
 ),
 sent_at TIMESTAMPTZ,
 failed_reason TEXT,

 email_message_id TEXT,
 email_opened BOOLEAN DEFAULT FALSE,
 email_clicked BOOLEAN DEFAULT FALSE,

 template_id TEXT DEFAULT 'standard_reminder',

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_scheduled
 ON reminders(scheduled_at)
 WHERE status = 'scheduled';

-- ============================================================
-- GST Returns
// ============================================================

CREATE TABLE IF NOT EXISTS gst_returns (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

 user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
 business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

 financial_year TEXT NOT NULL,
 quarter TEXT NOT NULL CHECK (quarter IN ('Q1', 'Q2', 'Q3', 'Q4')),
 quarter_start_date DATE NOT NULL,
 quarter_end_date DATE NOT NULL,

 -- GSTR-1 (Outward)
 total_taxable_value NUMERIC(15, 2) DEFAULT 0,
 total_cgst NUMERIC(12, 2) DEFAULT 0,
 total_sgst NUMERIC(12, 2) DEFAULT 0,
 total_igst NUMERIC(12, 2) DEFAULT 0,
 total_cess NUMERIC(12, 2) DEFAULT 0,

 -- GSTR-2A (Inward)
 input_cgst NUMERIC(12, 2) DEFAULT 0,
 input_sgst NUMERIC(12, 2) DEFAULT 0,
 input_igst NUMERIC(12, 2) DEFAULT 0,
 input_cess NUMERIC(12, 2) DEFAULT 0,

 -- Computed (generated columns)
 net_cgst NUMERIC(12, 2) GENERATED ALWAYS AS (total_cgst - input_cgst) STORED,
 net_sgst NUMERIC(12, 2) GENERATED ALWAYS AS (total_sgst - input_sgst) STORED,
 net_igst NUMERIC(12, 2) GENERATED ALWAYS AS (total_igst - input_igst) STORED,

 -- GSTR-3B
 gstr3b_total_liability NUMERIC(12, 2) GENERATED ALWAYS AS (
 (total_cgst - input_cgst)
 + (total_sgst - input_sgst)
 + (total_igst - input_igst)
 ) STORED,

 -- Invoice data
 b2b_invoice_count INTEGER DEFAULT 0,
 hsn_summary JSONB DEFAULT '[]'::jsonb,

 -- Filing
 filing_status TEXT DEFAULT 'draft' CHECK (
 filing_status IN ('draft', 'ready_to_file', 'filed', 'amended')
 ),
 filed_at TIMESTAMPTZ,
 acknowledgment_number TEXT,

 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),

 CONSTRAINT unique_gst_period UNIQUE (business_id, financial_year, quarter)
);

-- ============================================================
-- Business Members (multi-user access)
// ============================================================

CREATE TABLE IF NOT EXISTS business_members (
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

CREATE INDEX IF NOT EXISTS idx_business_members_business ON business_members(business_id, status);

-- ============================================================
-- Audit Logs
// ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
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

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_table ON audit_logs(user_id, table_name, created_at DESC);

-- ============================================================
-- AI Jobs
// ============================================================

CREATE TABLE IF NOT EXISTS ai_jobs (
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

CREATE INDEX IF NOT EXISTS idx_ai_jobs_receipt ON ai_jobs(receipt_id);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_user_status ON ai_jobs(user_id, status, created_at DESC);

-- ============================================================
-- Indexes
// ============================================================

CREATE INDEX IF NOT EXISTS idx_receipts_user_biz_date
 ON receipts(user_id, business_id, created_at DESC)
 WHERE processing_status = 'completed';

CREATE INDEX IF NOT EXISTS idx_receipts_vendor_fts
 ON receipts USING GIN (to_tsvector('english', COALESCE(vendor_name, '')));

CREATE INDEX IF NOT EXISTS idx_invoices_user_status_date
 ON invoices(user_id, status, due_date)
 WHERE status NOT IN ('void', 'cancelled');

CREATE INDEX IF NOT EXISTS idx_invoices_client_fts
 ON invoices USING GIN (to_tsvector('english', COALESCE(client_name, '')));

CREATE INDEX IF NOT EXISTS idx_expenses_user_category_date
 ON expenses(user_id, category_id, expense_date DESC)
 WHERE deleted_at IS NULL;

-- ============================================================
-- Triggers
// ============================================================

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

-- ============================================================
-- Row Level Security
// ============================================================

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
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role full access" ON profiles FOR ALL USING (auth.role() = 'service_role');

-- BUSINESSES
CREATE POLICY "Users view own businesses" ON businesses FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users insert own businesses" ON businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users update own businesses" ON businesses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users delete own businesses" ON businesses FOR DELETE USING (auth.uid() = owner_id);

-- CATEGORIES
CREATE POLICY "Anyone view active categories" ON categories FOR SELECT USING (is_system_default = TRUE OR owner_id = auth.uid());
CREATE POLICY "Users create categories" ON categories FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users update own categories" ON categories FOR UPDATE USING (auth.uid() = owner_id AND is_system_default = FALSE);
CREATE POLICY "Users delete own categories" ON categories FOR DELETE USING (auth.uid() = owner_id AND is_system_default = FALSE);

-- RECEIPTS
CREATE POLICY "Users manage own receipts" ON receipts FOR ALL USING (user_id = auth.uid());

-- INVOICES
CREATE POLICY "Users manage own invoices" ON invoices FOR ALL USING (user_id = auth.uid());

-- EXPENSES
CREATE POLICY "Users manage own expenses" ON expenses FOR ALL USING (user_id = auth.uid());

-- PAYMENTS
CREATE POLICY "Users manage own payments" ON payments FOR ALL USING (user_id = auth.uid());

-- REMINDERS
CREATE POLICY "Users manage own reminders" ON reminders FOR ALL USING (user_id = auth.uid());

-- GST RETURNS
CREATE POLICY "Users manage own gst returns" ON gst_returns FOR ALL USING (user_id = auth.uid());

-- AUDIT LOGS
CREATE POLICY "Users view own audit logs" ON audit_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service inserts audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- AI JOBS
CREATE POLICY "Users view own ai jobs" ON ai_jobs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Service manages ai jobs" ON ai_jobs FOR ALL USING (auth.role() = 'service_role');

-- BUSINESS MEMBERS
CREATE POLICY "Users view own memberships" ON business_members FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- Seed Data (System Categories)
// ============================================================

INSERT INTO categories (id, owner_id, name, slug, type, category_group, gst_rate, is_system_default) VALUES
 (uuid_generate_v4(), NULL, 'Office Supplies', 'office-supplies', 'expense', 'office', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Travel & Transport', 'travel-transport', 'expense', 'travel', 5, TRUE),
 (uuid_generate_v4(), NULL, 'Meals & Entertainment', 'meals-entertainment', 'expense', 'food', 5, TRUE),
 (uuid_generate_v4(), NULL, 'Electricity & Utilities', 'electricity-utilities', 'expense', 'utilities', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Internet & Phone', 'internet-phone', 'expense', 'utilities', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Marketing & Advertising', 'marketing-advertising', 'expense', 'marketing', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Software & Subscriptions', 'software-subscriptions', 'expense', 'software', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Equipment & Hardware', 'equipment-hardware', 'expense', 'equipment', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Professional Services', 'professional-services', 'expense', 'professional', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Salary & Wages', 'salary-wages', 'expense', 'salary', 0, TRUE),
 (uuid_generate_v4(), NULL, 'Rent & Office Space', 'rent-office', 'expense', 'office', 0, TRUE),
 (uuid_generate_v4(), NULL, 'Insurance', 'insurance', 'expense', 'professional', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Fuel', 'fuel', 'expense', 'travel', 5, TRUE),
 (uuid_generate_v4(), NULL, 'Courier & Shipping', 'courier-shipping', 'expense', 'other', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Training & Courses', 'training-courses', 'expense', 'professional', 18, TRUE),
 (uuid_generate_v4(), NULL, 'Client Payment', 'client-payment', 'income', 'client_payment', 0, TRUE),
 (uuid_generate_v4(), NULL, 'Freelance Project', 'freelance-project', 'income', 'client_payment', 0, TRUE),
 (uuid_generate_v4(), NULL, 'Consulting', 'consulting', 'income', 'professional', 0, TRUE),
 (uuid_generate_v4(), NULL, 'Royalties', 'royalties', 'income', 'other', 0, TRUE),
 (uuid_generate_v4(), NULL, 'Interest Income', 'interest-income', 'income', 'other', 0, TRUE)
 ON CONFLICT (owner_id, slug) DO NOTHING;
