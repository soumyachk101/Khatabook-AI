# Khatabook AI — REST API Specification

> **Base URL:** `https://api.khatabookai.com/v1`
> **Authentication:** Bearer JWT (Supabase Auth) via `Authorization: <access_token>` header
> **Content-Type:** `application/json` (except file uploads → `multipart/form-data`)
> **Rate Limit:** 100 req/min per user (pro: 500 req/min), burst 20 req/10s
> **Response Envelope:** `{ "success": true, "data": ..., "error": null }` or `{ "success": false, "data": null, "error": { "code": "...", "message": "...", "details": {} } }`

---

## Table of Contents

1. [Common Patterns](#common-patterns)
2. [Authentication](#authentication)
3. [Receipts](#receipts)
4. [Invoices](#invoices)
5. [Expenses](#expenses)
6. [Payments](#payments)
7. [Dashboard](#dashboard)
8. [GST](#gst)
9. [Categories](#categories)
10. [Reminders](#reminders)
11. [AI Services](#ai-services)
12. [Export](#export)
13. [Webhooks](#webhooks)
14. [Error Codes](#error-codes)

---

## Common Patterns

### Pagination

All list endpoints support:

```
?page=1&limit=20
```

Response includes:

```json
{
 "success": true,
 "data": { "items": [...], "pagination": { "page": 1, "limit": 20, "total": 142, "pages": 8 } }
}
```

### Date Filtering

```
?from=2024-01-01&to=2024-03-31
```

### Sorting

```
?sort=date&order=desc
```

### Business Context

For users with multiple businesses, pass `?business_id=<uuid>`. Defaults to the user's default business.

---

## Authentication

### Sign Up

```
POST /auth/signup
```

**Request Body:**

```json
{
 "email": "freelancer@example.com",
 "password": "SecurePass123!",
 "name": "Rahul Sharma",
 "phone": "+919876543210",
 "language": "en"
}
```

**Response (201):**

```json
{
 "success": true,
 "data": {
 "user": { "id": "uuid", "email": "freelancer@example.com", "name": "Rahul Sharma" },
 "session": { "access_token": "eyJ...", "refresh_token": "eyJ...", "expires_in": 3600 },
 "profile": { "onboarding_completed": false, "plan": "free" }
 }
}
```

**Errors:** 409 (email/phone exists), 422 (validation), 500 (server)

---

### Send OTP (Phone)

```
POST /auth/otp/send
```

**Request Body:**

```json
{ "phone": "+919876543210" }
```

**Response (200):**

```json
{ "success": true, "data": { "message": "OTP sent successfully", "expires_in": 300 } }
```

---

### Verify OTP

```
POST /auth/otp/verify
```

**Request Body:**

```json
{
 "phone": "+919876543210",
 "otp": "123456"
}
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "user": { "id": "uuid", "phone": "+919876543210" },
 "session": { "access_token": "eyJ...", "refresh_token": "eyJ..." }
 }
}
```

---

### Login

```
POST /auth/login
```

**Request Body:**

```json
{
 "email": "freelancer@example.com",
 "password": "SecurePass123!"
}
```

**or**

```json
{
 "phone": "+919876543210",
 "otp": "123456"
}
```

**Response (200):** Same as signup.

---

### Forgot Password

```
POST /auth/password/forgot
```

**Request Body:**

```json
{ "email": "freelancer@example.com" }
```

**Response (200):**

```json
{ "success": true, "data": { "message": "Password reset email sent" } }
```

---

### Reset Password

```
POST /auth/password/reset
```

**Request Body:**

```json
{
 "token": "reset-token-from-email",
 "new_password": "NewSecurePass456!"
}
```

---

### Refresh Token

```
POST /auth/refresh
```

**Request Body:**

```json
{ "refresh_token": "eyJ..." }
```

**Response:** New `access_token` + `refresh_token`.

---

### Logout

```
POST /auth/logout
```

**Auth:** Required. Invalidates current session.

---

## Receipts

### Upload Receipt

```
POST /receipts/upload
```

**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | File | Yes | Image file (JPEG, PNG, HEIC, PDF). Max 10MB. |
| `business_id` | string (UUID) | No | Target business. Defaults to user's default. |
| `auto_categorize` | boolean | No | Auto-categorize after scan. Default: true. |
| `tags` | string[] | No | Tags to apply. |

**Request (cURL):**

```bash
curl -X POST "https://api.khatabookai.com/v1/receipts/upload" \
 -H "Authorization: Bearer <token>" \
 -F "image=@/path/to/receipt.jpg" \
 -F "business_id=<uuid>" \
 -F "auto_categorize=true"
```

**Response (201) — Job queued:**

```json
{
 "success": true,
 "data": {
 "id": "receipt-uuid",
 "status": "processing",
 "message": "Receipt queued for AI scanning. Check status at GET /receipts/{id}",
 "estimated_completion_ms": 3000
 }
}
```

**Response (201) — Fast path (already extracted):**

```json
{
 "success": true,
 "data": {
 "id": "receipt-uuid",
 "status": "completed",
 "image_url": "https://storage.supabase.co/...",
 "raw_text": "Big Bazaar...\nTotal: ₹2,450.00",
 "extracted_data": {
 "vendor": "Big Bazaar",
 "date": "2024-01-15",
 "total": 2450.00,
 "items": [...]
 },
 "category": "Shopping",
 "amount": 2450.00,
 "vendor": "Big Bazaar",
 "gst_details": {
 "cgst": [{"rate": 2.5, "amount": 56.25}],
 "sgst": [{"rate": 2.5, "amount": 56.25}],
 "total_tax": 112.50
 },
 "ai_confidence_score": 94.2
 }
}
```

---

### List Receipts

```
GET /receipts
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `business_id` | UUID | Filter by business |
| `from` | date | Start date (YYYY-MM-DD) |
| `to` | date | End date |
| `category` | string | Filter by category |
| `vendor` | string | Vendor name (partial match) |
| `min_amount` | number | Minimum amount |
| `max_amount` | number | Maximum amount |
| `tags` | string | Comma-separated tags |
| `status` | string | `pending`, `processing`, `completed`, `failed`, `review_required` |
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 20, max: 100) |
| `sort` | string | `date`, `amount`, `vendor`, `created_at` (default: `date`) |
| `order` | string | `asc`, `desc` (default: `desc`) |

**Response (200):**

```json
{
 "success": true,
 "data": {
 "items": [
 {
 "id": "uuid",
 "vendor": "Big Bazaar",
 "date": "2024-01-15",
 "amount": 2450.00,
 "category": "Shopping",
 "ai_confidence_score": 94.2,
 "reviewed": false,
 "created_at": "2024-01-15T10:30:00Z"
 }
 ],
 "pagination": { "page": 1, "limit": 20, "total": 42, "pages": 3 }
 }
}
```

---

### Get Receipt

```
GET /receipts/{id}
```

**Response (200):** Full receipt object with `extracted_data`, `gst_details`, `raw_text`.

---

### Update Receipt

```
PATCH /receipts/{id}
```

**Auth:** Required (owner or accountant)

**Request Body:**

```json
{
 "category": "Groceries",
 "amount": 2400.00,
 "vendor": "Big Bazaar Andheri",
 "date": "2024-01-15",
 "is_expense": true,
 "tags": ["food", "groceries"],
 "notes": "Monthly grocery run",
 "reviewed": true
}
```

**Response (200):** Updated receipt.

---

### Delete Receipt

```
DELETE /receipts/{id}
```

**Auth:** Required (owner only)

**Response (200):** `{ "success": true, "data": { "message": "Receipt deleted" } }`

---

### Re-scan Receipt

```
POST /receipts/{id}/rescan
```

**Auth:** Required

**Response (200):** Queued for re-processing. Returns updated receipt once done.

---

### Batch Upload Receipts

```
POST /receipts/batch-upload
```

**Auth:** Required
**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| `images` | File[] | Yes (1-10 files) |
| `business_id` | UUID | No |

**Response (201):**

```json
{
 "success": true,
 "data": {
 "receipts": [
 { "id": "uuid-1", "status": "processing" },
 { "id": "uuid-2", "status": "completed", "extracted_data": {...} }
 ],
 "summary": { "queued": 2, "completed": 1, "failed": 0 }
 }
}
```

---

## Invoices

### Create Invoice

```
POST /invoices
```

**Auth:** Required

**Request Body:**

```json
{
 "business_id": "uuid",
 "invoice_type": "invoice",
 "invoice_number": "INV-2024-001",
 "client_name": "Acme Corp Pvt Ltd",
 "client_email": "billing@acme.com",
 "client_phone": "+919876543210",
 "client_address": {
 "line1": "123 Business Park",
 "city": "Mumbai",
 "state": "Maharashtra",
 "pincode": "400001"
 },
 "client_gstin": "27AABCA1234R1ZX",
 "client_state": "Maharashtra",
 "client_state_code": "27",
 "items": [
 {
 "description": "Website Redesign",
 "hsn_sac": "998314",
 "quantity": 1,
 "unit": "project",
 "rate": 50000,
 "discount": 0,
 "taxable_value": 50000,
 "cgst_rate": 9,
 "cgst_amount": 4500,
 "sgst_rate": 9,
 "sgst_amount": 4500,
 "igst_rate": 0,
 "igst_amount": 0,
 "total": 59000
 }
 ],
 "subtotal": 50000,
 "cgst": 4500,
 "sgst": 4500,
 "igst": 0,
 "total_tax": 9000,
 "total": 59000,
 "grand_total": 59000,
 "amount_in_words": "Fifty Nine Thousand Only",
 "discount_amount": 0,
 "round_off": 0,
 "terms_conditions": "Payment due within 15 days.",
 "notes": "Thank you for your business!",
 "place_of_supply": "Maharashtra",
 "issue_date": "2024-01-20",
 "due_date": "2024-02-04",
 "status": "draft"
}
```

**Response (201):**

```json
{
 "success": true,
 "data": {
 "id": "uuid",
 "invoice_number": "INV-2024-001",
 "client_name": "Acme Corp Pvt Ltd",
 "subtotal": 50000,
 "cgst": 4500,
 "sgst": 4500,
 "igst": 0,
 "grand_total": 59000,
 "status": "draft",
 "pdf_url": null,
 "balance_due": 59000,
 "created_at": "2024-01-20T..."
 }
}
```

---

### List Invoices

```
GET /invoices
```

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `business_id` | UUID | Filter by business |
| `status` | string | `draft`, `sent`, `paid`, `overdue`, `cancelled` |
| `client_gstin` | string | Filter by client GSTIN |
| `from` / `to` | date | Date range on issue_date |
| `min_amount` / `max_amount` | number | Amount range |
| `search` | string | Search invoice number or client name |
| `page`, `limit`, `sort`, `order` | — | Pagination & sorting |

**Response (200):** Paginated list.

---

### Get Invoice

```
GET /invoices/{id}
```

**Response (200):** Full invoice with line items.

---

### Update Invoice

```
PATCH /invoices/{id}
```

Same body as Create — partial updates allowed. Cannot change `invoice_number` or `business_id` after creation.

---

### Delete Invoice

```
DELETE /invoices/{id}
```

Only allowed if `status = draft`. Otherwise returns 409.

---

### Send Invoice

```
POST /invoices/{id}/send
```

**Request Body:**

```json
{
 "channel": "email", // "email" | "whatsapp"
 "recipient": "billing@acme.com",
 "message": "Please find attached invoice..."
}
```

Sends invoice PDF via email or WhatsApp, updates `status` to `sent`.

---

### Mark as Paid

```
POST /invoices/{id}/mark-paid
```

**Request Body:**

```json
{
 "amount": 59000,
 "payment_method": "upi",
 "paid_at": "2024-02-01T10:00:00Z"
}
```

Creates a payment record and updates invoice status.

---

### Get Invoice PDF

```
GET /invoices/{id}/pdf
```

Returns PDF binary. Also available as `GET /invoices/{id}/pdf-url` for the signed URL.

---

### Invoice Counters

```
GET /invoices/counters?business_id=<uuid>
```

```json
{ "success": true, "data": { "series": "INV", "last_number": 156, "next_number": 157 } }
```

---

## Expenses

### Create Expense

```
POST /expenses
```

**Request Body:**

```json
{
 "business_id": "uuid",
 "category": "Travel",
 "subcategory": "Local Transport",
 "description": "Metro to client office",
 "amount": 120.00,
 "date": "2024-01-22",
 "payment_method": "upi",
 "is_input_tax_credit": false,
 "receipt_id": "receipt-uuid",
 "vendor_name": "Mumbai Metro",
 "tags": ["commute", "client-meeting"],
 "notes": "Return trip"
}
```

---

### List Expenses

```
GET /expenses?from=2024-01-01&to=2024-01-31&category=Travel&page=1&limit=20
```

---

### Get Expense

```
GET /expenses/{id}
```

---

### Update Expense

```
PATCH /expenses/{id}
```

Same body as Create.

---

### Delete Expense

```
DELETE /expenses/{id}
```

---

### Bulk Import Expenses (CSV)

```
POST /expenses/import
```

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| `file` | File (CSV) | Yes |
| `business_id` | UUID | No |

**CSV columns:** `date, category, description, amount, payment_method, vendor_name, notes, tags`

**Response (202):**

```json
{
 "success": true,
 "data": {
 "job_id": "uuid",
 "status": "processing",
 "total_rows": 150,
 "message": "Import queued. Check status at GET /expenses/import/{job_id}"
 }
}
```

---

### Import Status

```
GET /expenses/import/{job_id}
```

```json
{
 "success": true,
 "data": {
 "job_id": "uuid",
 "status": "completed", // processing | completed | failed
 "total_rows": 150,
 "imported": 148,
 "failed": 2,
 "errors": [
 { "row": 23, "error": "Invalid date format", "data": {"date": "15/01/2024"} }
 ]
 }
}
```

---

### Convert Receipt to Expense

```
POST /receipts/{id}/convert-to-expense
```

Creates an expense linked to the receipt.

---

## Payments

### Create Payment Link

```
POST /payments/links
```

**Request Body:**

```json
{
 "invoice_id": "uuid",
 "amount": 59000,
 "method": "razorpay",
 "description": "Payment for INV-2024-001"
}
```

**Response (201):**

```json
{
 "success": true,
 "data": {
 "id": "uuid",
 "payment_link": "https://rzp.io/i/abc123",
 "amount": 59000,
 "status": "pending",
 "expires_at": "2024-02-04T23:59:59Z",
 "short_url": "https://rzp.io/i/abc123"
 }
}
```

---

### Verify Payment (Webhook handler — also called by webhook)

```
POST /payments/verify
```

**Request Body:**

```json
{
 "invoice_id": "uuid",
 "razorpay_payment_id": "pay_ABC123",
 "razorpay_order_id": "order_XYZ789",
 "razorpay_signature": "abc123def456..."
}
```

**Response (200):** Payment verified, invoice updated.

---

### List Payments

```
GET /payments?invoice_id=<uuid>&status=completed&page=1&limit=20
```

---

### Refund Payment

```
POST /payments/{id}/refund
```

**Request Body:**

```json
{
 "amount": 59000,
 "reason": "Client cancelled",
 "notes": "Full refund processed"
}
```

---

## Dashboard

### Summary

```
GET /dashboard/summary?business_id=<uuid>
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "period": { "from": "2024-01-01", "to": "2024-01-31" },
 "revenue": {
 "total": 250000.00,
 "invoiced": 280000.00,
 "received": 250000.00,
 "pending": 30000.00,
 "overdue": 10000.00
 },
 "expenses": {
 "total": 45000.00,
 "by_category": {
 "Rent": 15000,
 "Travel": 8000,
 "Salaries": 20000,
 "Software": 2000
 }
 },
 "gst": {
 "output_tax": 22500.00,
 "input_tax": 4050.00,
 "net_payable": 18450.00,
 "itc_available": 4050.00
 },
 "receipts": {
 "scanned_this_month": 45,
 "pending_review": 3
 },
 "invoices": {
 "total": 12,
 "paid": 8,
 "pending": 3,
 "overdue": 1,
 "draft": 0
 },
 "cash_flow": {
 "opening": 100000,
 "inflows": 250000,
 "outflows": 45000,
 "closing": 305000
 }
 }
}
```

---

### Monthly Stats

```
GET /dashboard/monthly-stats?from=2023-07&to=2024-01
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "months": [
 {
 "month": "2024-01",
 "revenue": 250000,
 "expenses": 45000,
 "profit": 205000,
 "invoices_count": 12,
 "receipts_count": 45,
 "gst_payable": 18450
 }
 ],
 "totals": {
 "revenue": 1750000,
 "expenses": 315000,
 "profit": 1435000
 }
 }
}
```

---

### Category Breakdown

```
GET /dashboard/category-breakdown?type=expense&from=2024-01-01&to=2024-01-31&business_id=<uuid>
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "categories": [
 { "name": "Rent", "amount": 15000, "percentage": 33.3, "transaction_count": 1 },
 { "name": "Salaries", "amount": 20000, "percentage": 44.4, "transaction_count": 2 },
 { "name": "Travel", "amount": 8000, "percentage": 17.8, "transaction_count": 15 }
 ],
 "total": 45000
 }
}
```

---

### Top Clients

```
GET /dashboard/top-clients?from=2024-01-01&to=2024-03-31&limit=10
```

---

### Cash Flow

```
GET /dashboard/cash-flow?from=2024-01-01&to=2024-01-31
```

Daily or weekly cash flow data.

---

## GST

### Generate GSTR-1

```
POST /gst/gstr1/generate
```

**Request Body:**

```json
{
 "business_id": "uuid",
 "quarter": "Q1-2024",
 "financial_year": "2024-25"
}
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "id": "gst-return-uuid",
 "quarter": "Q1-2024",
 "gstr1_data": {
 "b2b_invoices": [...],
 "b2cl_invoices": [...],
 "total_taxable_value": 500000,
 "total_cgst": 22500,
 "total_sgst": 22500,
 "total_igst": 0
 },
 "status": "calculated"
 }
}
```

---

### Generate GSTR-3B

```
POST /gst/gstr3b/generate
```

**Request Body:**

```json
{ "business_id": "uuid", "quarter": "Q1-2024", "financial_year": "2024-25" }
```

**Response:** GSTR-3B summary with outward/inward supplies, ITC, net liability.

---

### List GST Returns

```
GET /gst/returns?business_id=<uuid>&quarter=Q1-2024
```

---

### Get GST Return

```
GET /gst/returns/{id}
```

---

### File GST Return

```
POST /gst/returns/{id}/file
```

**Request Body:**

```json
{ "acknowledgement_number": "AAACGN1234R1AR", "filed_at": "2024-04-11T10:00:00Z" }
```

**Response:** Updates `gstr1_status` / `gstr3b_status` to `filed`.

---

### GST Reconciliation

```
GET /gst/reconciliation?business_id=<uuid>&quarter=Q1-2024
```

Matches inward vs outward supplies, flags mismatches.

---

## Categories

### List Categories

```
GET /categories?type=expense
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "income": [
 { "id": "uuid", "name": "Sales / Revenue", "color": "#10b981", "icon": "💰", "is_system": true }
 ],
 "expense": [
 { "id": "uuid", "name": "Rent", "color": "#ef4444", "icon": "🏢", "is_system": true },
 { "id": "uuid", "name": "Client Travel", "color": "#eab308", "icon": "✈️", "is_system": false }
 ]
 }
}
```

---

### Create Category

```
POST /categories
```

**Request Body:**

```json
{
 "name": "Advertising",
 "type": "expense",
 "color": "#ec4899",
 "icon": "📢",
 "parent_id": null
}
```

---

### Update Category

```
PATCH /categories/{id}
```

---

### Delete Category

```
DELETE /categories/{id}
```

Cannot delete system categories. Expenses using this category will have `category` set to null.

---

## Reminders

### Create Reminder

```
POST /reminders
```

**Request Body:**

```json
{
 "invoice_id": "uuid",
 "type": "invoice_due_3days",
 "channel": "email",
 "scheduled_at": "2024-02-01T09:00:00Z",
 "subject": "Reminder: Payment due in 3 days",
 "body_text": "Dear Client, your payment of ₹59,000 is due on 2024-02-04."
}
```

**Response (201):** Created reminder.

---

### List Reminders

```
GET /reminders?status=pending&page=1&limit=20
```

---

### Cancel Reminder

```
POST /reminders/{id}/cancel
```

---

## AI Services

### Scan Receipt (Manual Trigger)

```
POST /ai/scan-receipt
```

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| `image` | File | Yes |
| `business_id` | UUID | No |

**Response (200):** Same as `POST /receipts/upload` — returns full extracted data.

---

### Categorize Receipt

```
POST /ai/categorize
```

**Request Body:**

```json
{
 "receipt_id": "uuid",
 "force": false
}
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "category": "Groceries",
 "confidence": 0.92,
 "alternatives": [{"name": "Food", "confidence": 0.65}]
 }
}
```

---

### Extract GST Details

```
POST /ai/extract-gst
```

**Request Body:**

```json
{ "receipt_id": "uuid" }
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "gst_details": {
 "cgst": [{"rate": 2.5, "amount": 56.25}, {"rate": 6, "amount": 129.00}],
 "sgst": [{"rate": 2.5, "amount": 56.25}, {"rate": 6, "amount": 129.00}],
 "igst": [],
 "total_tax": 370.50
 },
 "vendor_gstin": "27AABCA1234R1ZX",
 "confidence": 0.88
 }
}
```

---

### Suggest Invoice Items

```
POST /ai/suggest-items
```

**Request Body:**

```json
{ "description": "Logo design for my brand", "business_id": "uuid" }
```

**Response (200):**

```json
{
 "success": true,
 "data": {
 "suggestions": [
 {
 "description": "Logo Design",
 "hsn_sac": "998382",
 "suggested_rate": 15000,
 "sgst_rate": 9,
 "cgst_rate": 9,
 "igst_rate": 0
 }
 ]
 }
}
```

---

## Export

### Export Expenses (CSV)

```
GET /export/expenses/csv?from=2024-01-01&to=2024-01-31&business_id=<uuid>
```

Returns `text/csv` with columns: `Date, Category, Description, Amount, Payment Method, Vendor, GST Available`.

---

### Export Invoices (CSV)

```
GET /export/invoices/csv?from=2024-01-01&to=2024-03-31
```

---

### Export GST Report (CSV)

```
GET /export/gst/{return_id}/csv
```

---

### Export Invoice PDF

```
GET /export/invoices/{id}/pdf
```

---

### Bulk Export

```
POST /export/bulk
```

**Request Body:**

```json
{
 "type": "invoices", // "expenses" | "receipts" | "gst"
 "format": "xlsx", // "csv" | "xlsx" | "pdf"
 "from": "2024-01-01",
 "to": "2024-03-31",
 "business_id": "uuid"
}
```

**Response (202):** Job queued. Returns download URL when ready.

---

## Webhooks

### Razorpay Payment Webhook

```
POST /webhooks/razorpay
```

**Headers:** `X-Razorpay-Signature: <signature>`

**Body:** Raw Razorpay event payload. Verified against webhook secret.

**Handled events:**
- `payment.captured` → marks payment as `completed`, sends notification
- `payment.failed` → marks payment as `failed`
- `refund.processed` → marks payment as `refunded`
- `order.paid` → links order to payment

---

### WhatsApp Webhook (Twilio / Meta)

```
POST /webhooks/whatsapp
```

Handles incoming WhatsApp messages (payment confirmations, queries).

---

### File Processing Webhook (Internal)

```
POST /webhooks/internal/file-processed
```

Called by AI worker when receipt processing completes.

---

## Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `AUTH_REQUIRED` | 401 | Missing or invalid token |
| `AUTH_INVALID` | 401 | Token expired or revoked |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body validation failed |
| `DUPLICATE_RESOURCE` | 409 | Unique constraint violation |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `PAYMENT_REQUIRED` | 402 | Plan limit exceeded (pro feature on free) |
| `AI_PROCESSING_FAILED` | 422 | OCR/AI extraction failed |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | AI service temporarily unavailable |

---

## Full API Reference (Quick Lookup)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | No | Create account |
| `POST` | `/auth/login` | No | Login with email/password |
| `POST` | `/auth/otp/send` | No | Send OTP to phone |
| `POST` | `/auth/otp/verify` | No | Verify OTP |
| `POST` | `/auth/password/forgot` | No | Request password reset |
| `POST` | `/auth/password/reset` | No | Reset password |
| `POST` | `/auth/refresh` | No | Refresh access token |
| `POST` | `/auth/logout` | Yes | Logout |
| `POST` | `/receipts/upload` | Yes | Upload & scan receipt |
| `POST` | `/receipts/batch-upload` | Yes | Upload up to 10 receipts |
| `GET` | `/receipts` | Yes | List receipts |
| `GET` | `/receipts/{id}` | Yes | Get receipt |
| `PATCH` | `/receipts/{id}` | Yes | Update receipt |
| `DELETE` | `/receipts/{id}` | Yes | Delete receipt |
| `POST` | `/receipts/{id}/rescan` | Yes | Re-scan receipt |
| `POST` | `/receipts/{id}/convert-to-expense` | Yes | Convert to expense |
| `POST` | `/invoices` | Yes | Create invoice |
| `GET` | `/invoices` | Yes | List invoices |
| `GET` | `/invoices/{id}` | Yes | Get invoice |
| `PATCH` | `/invoices/{id}` | Yes | Update invoice |
| `DELETE` | `/invoices/{id}` | Yes | Delete (draft only) |
| `POST` | `/invoices/{id}/send` | Yes | Send invoice |
| `POST` | `/invoices/{id}/mark-paid` | Yes | Mark as paid |
| `GET` | `/invoices/{id}/pdf` | Yes | Download PDF |
| `GET` | `/invoices/counters` | Yes | Invoice number counters |
| `POST` | `/expenses` | Yes | Create expense |
| `GET` | `/expenses` | Yes | List expenses |
| `GET` | `/expenses/{id}` | Yes | Get expense |
| `PATCH` | `/expenses/{id}` | Yes | Update expense |
| `DELETE` | `/expenses/{id}` | Yes | Delete expense |
| `POST` | `/expenses/import` | Yes | Bulk import CSV |
| `GET` | `/expenses/import/{job_id}` | Yes | Check import status |
| `POST` | `/payments/links` | Yes | Create payment link |
| `POST` | `/payments/verify` | Yes | Verify payment |
| `GET` | `/payments` | Yes | List payments |
| `POST` | `/payments/{id}/refund` | Yes | Refund payment |
| `GET` | `/dashboard/summary` | Yes | Dashboard summary |
| `GET` | `/dashboard/monthly-stats` | Yes | Monthly revenue/expense |
| `GET` | `/dashboard/category-breakdown` | Yes | Category breakdown |
| `GET` | `/dashboard/top-clients` | Yes | Top clients by revenue |
| `GET` | `/dashboard/cash-flow` | Yes | Cash flow data |
| `POST` | `/gst/gstr1/generate` | Yes | Generate GSTR-1 |
| `POST` | `/gst/gstr3b/generate` | Yes | Generate GSTR-3B |
| `GET` | `/gst/returns` | Yes | List GST returns |
| `GET` | `/gst/returns/{id}` | Yes | Get GST return |
| `POST` | `/gst/returns/{id}/file` | Yes | File GST return |
| `GET` | `/gst/reconciliation` | Yes | GST reconciliation |
| `GET` | `/categories` | Yes | List categories |
| `POST` | `/categories` | Yes | Create category |
| `PATCH` | `/categories/{id}` | Yes | Update category |
| `DELETE` | `/categories/{id}` | Yes | Delete category |
| `POST` | `/reminders` | Yes | Create reminder |
| `GET` | `/reminders` | Yes | List reminders |
| `POST` | `/reminders/{id}/cancel` | Yes | Cancel reminder |
| `POST` | `/ai/scan-receipt` | Yes | Manual scan receipt |
| `POST` | `/ai/categorize` | Yes | Categorize receipt |
| `POST` | `/ai/extract-gst` | Yes | Extract GST from receipt |
| `POST` | `/ai/suggest-items` | Yes | AI invoice suggestions |
| `GET` | `/export/expenses/csv` | Yes | Export expenses CSV |
| `GET` | `/export/invoices/csv` | Yes | Export invoices CSV |
| `GET` | `/export/gst/{id}/csv` | Yes | Export GST CSV |
| `GET` | `/export/invoices/{id}/pdf` | Yes | Export invoice PDF |
| `POST` | `/export/bulk` | Yes | Bulk export |
| `POST` | `/webhooks/razorpay` | No | Razorpay webhook |
| `POST` | `/webhooks/whatsapp` | No | WhatsApp webhook |
| `POST` | `/webhooks/internal/file-processed` | No | Internal webhook |
