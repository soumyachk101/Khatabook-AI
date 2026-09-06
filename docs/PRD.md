# Product Requirements Document — Khatabook AI

> **AI-Powered Invoice & Receipt Scanner for Indian Freelancers & Small Businesses**
> **Version:** 1.0 | **Date:** 2026-09-06 | **Owner:** Product Team

---

## Table of Contents

1. [Product Vision & Mission](#1-product-vision--mission)
2. [Target Users](#2-target-users)
3. [Problem Statement](#3-problem-statement)
4. [Core Features](#4-core-features)
5. [User Stories](#5-user-stories)
6. [Feature Prioritization](#6-feature-prioritization)
7. [Success Metrics](#7-success-metrics)
8. [Competitive Analysis](#8-competitive-analysis)
9. [Monetization Strategy](#9-monetization-strategy)
10. [Launch Roadmap](#10-launch-roadmap)
11. [Risk Assessment](#11-risk-assessment)
12. [Appendix: User Personas](#12-appendix-user-personas)

---

## 1. Product Vision & Mission

### Vision

To become the most trusted AI-powered financial companion for every freelancer, small shop owner, and MSME in India — making bookkeeping effortless, GST compliance stress-free, and financial growth accessible to all.

### Mission

Khatabook AI leverages cutting-edge AI and computer vision to eliminate the drudgery of manual receipt entry, UPI transaction tracking, and GST filing. We turn every smartphone into a personal accountant, empowering India's 60M+ small businesses to stay organized, compliant, and profitable without needing specialized accounting knowledge.

### Core Value Propositions

| Pillar | Promise |
|---|---|
| **Scan & Forget** | Snap a receipt or invoice — AI extracts every detail in under 3 seconds |
| **UPI-Ready** | Auto-read and categorize UPI transaction screenshots |
| **GST-Safe** | Auto-generated GST reports ready for GSTR-1 / GSTR-3B filing |
| **Hindi + English** | Full bilingual support for maximum accessibility |
| **Privacy-First** | All data encrypted; user owns their financial data |

---

## 2. Target Users

### Primary Segments

| Segment | Size (India) | Typical Annual Turnover | Tech Savviness |
|---|---|---|---|
| **Freelancers** (designers, writers, developers, consultants) | ~15M | ₹2L–₹25L | Medium–High |
| **Small Shop Owners** (kirana, apparel, electronics retail) | ~20M | ₹5L–₹50L | Low–Medium |
| **Micro Enterprises (MSMEs)** | ~25M | ₹10L–₹2Cr | Medium |

### Secondary Segments

- Home-based food businesses (cloud kitchen, tiffin services)
- Delivery partners & gig workers tracking expenses
- Small service providers (plumbers, electricians, salons)

### User Characteristics

- **Age:** 22–55
- **Smartphone:** Android-first (85%), some iOS (15%)
- **Languages:** Hindi (55%), English (20%), Regional languages (25%)
- **Pain awareness:** High — they know manual bookkeeping is painful but feel helpless
- **Budget sensitivity:** Extremely price-sensitive; prefer freemium entry points

---

## 3. Problem Statement

### The Core Problem

India's small businesses and freelancers lose **40–60 hours per month** on manual bookkeeping. 70% of them dread GST filing season. UPI has exploded (100B+ transactions/year) but nobody systematically tracks what each payment was *for*. Receipts pile up in drawers or get lost. When it's time to file GST returns, they scramble to piece together data from dozens of apps, WhatsApp forwards, and handwritten notes.

### Sub-Problems

1. **Manual Receipt/Invoice Entry**
 - Every purchase generates a physical or digital receipt that must be typed into a ledger or spreadsheet.
 - A small shop owner may handle 30–50 receipts daily. At 2 minutes each, that's 1–2 hours of pure data entry.
 - Human error rate: 15–25% in manual transcription.

2. **UPI Transaction Tracking**
 - PhonePe, GPay, Paytm generate notifications and screenshots but none link the transaction to *what* was bought or *which* client paid.
 - Business UPI IDs mix personal and business transactions.
 - At tax time, categorizing 1,000+ UPI transactions manually is a nightmare.

3. **GST Compliance Anxiety**
 - GSTR-1 (outward supplies) and GSTR-3B (summary return) require precise sales and purchase data.
 - 60% of small businesses hire a CA (₹5,000–₹20,000/year) just for GST filing.
 - Late filing penalties: ₹50/day (nil liability) to ₹200/day — a real cash drain.

4. **Expense Visibility**
 - Most small businesses operate on "gut feel" for profitability.
 - They cannot quickly answer: "How much did I spend on raw materials this month?" or "Which client is most profitable?"
 - No dashboards exist that are simple enough for non-accountants.

5. **Payment Reminders & Collections**
 - Freelancers and small vendors routinely wait 30–90 days for payments.
 - Manually chasing clients via WhatsApp/call is time-consuming and awkward.
 - Cash flow gaps hurt business continuity.

6. **Language Barrier**
 - Most accounting software is English-only or poorly translated.
 - 60% of target users are more comfortable with Hindi or their regional language.

### Impact

Without a solution, small businesses:
- Waste productive hours on non-revenue activities
- Risk GST penalties due to late or incorrect filings
- Make poor financial decisions due to lack of data
- Experience cash flow stress from uncollected payments
- Feel excluded from the digital economy

---

## 4. Core Features

### 4.1 AI Receipt & Invoice Scanning

**Description:** Users snap a photo of any receipt, invoice, or bill — printed or handwritten. The app uses OCR + NLP to extract structured data: vendor name, date, items, quantities, prices, GSTIN, total amount, payment mode.

**Technical Approach:**
- On-device OCR (Tesseract / ML Kit) for privacy and speed
- Cloud-based LLM (Gemini/Claude) for complex/invoice layout understanding
- Custom NER model fine-tuned on Indian receipt formats
- Confidence score displayed; user can correct fields
- Auto-save to expense or sales ledger

**Supported Formats:**
- Paper receipts (retail, restaurant, fuel, medical)
- Printed invoices
- Handwritten bills (moderate accuracy)
- Digital invoice images (screenshots, PDFs saved as images)

**Extracted Fields:**
- Vendor name
- Invoice number
- Date
- Line items (description, quantity, unit price)
- Subtotal, CGST, SGST, IGST
- Grand total
- Payment mode (Cash, Card, UPI, etc.)
- Vendor GSTIN (if present)

---

### 4.2 UPI Transaction Auto-Categorization

**Description:** Users share UPI transaction screenshots (GPay, PhonePe, Paytm) or connect their UPI app via notification access. The app reads the transaction details and auto-categorizes them.

**Technical Approach:**
- Notification Listener API (Android) / Screen Time / Share Extension (iOS)
- OCR on UPI notification screenshots
- Rule-based + ML categorization engine
- Vendor matching against a growing Indian merchant database

**Categories:**
- Raw materials / Inventory
- Rent / Utilities
- Salary / Contractor payments
- Marketing / Ads
- Travel / Fuel
- Office supplies
- Personal (user-tagged, excluded from business reports)
- Sales / Incoming payments

**Smart Features:**
- Suggest recurring transactions (monthly rent, electricity)
- Flag duplicate transactions
- Link UPI payments to specific invoices/clients

---

### 4.3 GST-Ready Reports & Filing Assistance

**Description:** Auto-generated GST reports (GSTR-1, GSTR-3B) with one-click export in the government's JSON/Excel format. Users can review, confirm, and file directly or share with their CA.

**Reports Generated:**

| Report | Purpose | Frequency |
|---|---|---|
| **Sales Summary (GSTR-1)** | All outward taxable supplies | Monthly |
| **Purchase Summary (GSTR-3B)** | All inward taxable purchases | Monthly |
| **HSN-wise Summary** | Goods/services breakdown | Monthly |
| **Input Tax Credit (ITC) Report** | Eligible GST credit claims | Monthly |
| **Tax Liability Summary** | Total CGST/SGST/IGST payable | Monthly |
| **Annual Summary** | FY-wise consolidated report | Annual |

**Filing Assistance:**
- Pre-filled JSON in GSTN portal format
- Validation checks (missing invoices, mismatched totals)
- Filing checklist / reminders
- Option to share report directly with CA via WhatsApp/Email

---

### 4.4 Expense Tracking Dashboard

**Description:** A clean, visual dashboard showing real-time financial health — income, expenses, profit, top spending categories, and trends.

**Dashboard Widgets:**

1. **Income vs Expense Chart** — monthly bar chart
2. **Category Breakdown** — pie chart (donut) of top expense categories
3. **Profit Trend** — line chart over 6/12 months
4. **Top Vendors** — who you spend the most with
5. **Top Clients** — who pays you the most
6. **GST Tracker** — how much GST collected vs paid this month
7. **Pending Invoices** — outstanding amounts
8. **Cash Flow** — money in vs money out this week
9. **Recent Transactions** — last 10 entries with search/filter

**Features:**
- Date range filtering (this week, this month, custom)
- Category-wise drill-down
- Export to CSV / Excel / PDF
- Dark mode support

---

### 4.5 Payment Reminders

**Description:** Automated, customizable reminders for pending invoices and upcoming expenses (rent, EMIs, supplier payments).

**Reminder Types:**

| Type | Trigger | Channel |
|---|---|---|
| **Payment Due Reminder** | 3 days before due date | In-app + WhatsApp |
| **Overdue Payment Alert** | 1 day after due date, then every 3 days | In-app + WhatsApp + SMS |
| **Recurring Expense Reminder** | Monthly (rent, subscriptions) | In-app notification |
| **GST Filing Reminder** | 10th, 20th of month (GSTR-1, GSTR-3B deadlines) | In-app notification |

**Customization:**
- Edit reminder message templates
- Set frequency (daily, every 3 days, weekly)
- Choose channel (in-app, WhatsApp, SMS — SMS is paid)
- Whitelist/blacklist clients

**WhatsApp Integration:**
- Send payment reminder messages directly from the app
- Pre-filled with invoice details and payment link
- Track if message was read (double-tick)

---

### 4.6 Hindi + English Bilingual Support

**Description:** Full app localization in Hindi and English, with seamless switching. All core flows — scanning, dashboard, reports, reminders — available in both languages.

**Scope:**
- App UI (all screens, buttons, menus)
- Onboarding flow
- AI scanning results & corrections
- Dashboard labels & reports
- Push notifications & reminders
- Help center & FAQs

**Phase 2 Languages (Roadmap):**
- Marathi, Gujarati, Tamil, Bengali, Kannada, Telugu

**Design Principles:**
- Native-sounding Hindi (not literal translations)
- Hinglish support (mixed language input for search/categories)
- Right-to-left layout considerations (not applicable, but culturally appropriate formatting of numbers — lakhs, crores)

**Number Formatting:**
- Indian numbering system: 1,00,000 (1 lakh), 1,00,00,000 (1 crore)
- Currency: ₹ symbol throughout

---

### 4.7 Bonus / Supporting Features

| Feature | Description | Priority |
|---|---|---|
| **Invoice Generator** | Create & share professional invoices from the app | Should-have |
| **Client Management** | Store client details, track per-client profitability | Should-have |
| **Multi-Business Support** | Manage multiple businesses under one account | Should-have |
| **Cloud Backup** | Auto-sync data across devices | Must-have |
| **Data Export** | Export all data as CSV, Excel, PDF | Must-have |
| **Receipt Search** | Full-text search across all scanned receipts | Should-have |
| **Receipt Tags** | Custom tags for organization (e.g., "project-alpha", "travel") | Nice-to-have |
| **Bank Statement Import** | Import bank statements (PDF) and auto-match transactions | Nice-to-have |
| **Integration with Tally / Zoho** | Push data to popular accounting tools | Nice-to-have |
| **Team / Accountant Access** | Share read-only access with CA | Should-have |

---

## 5. User Stories

### Epic 1: Onboarding & Account Setup

**US-01:** As a new user, I want to sign up using my phone number (OTP verification) so that I can quickly create an account without remembering another password.

**US-02:** As a new user, I want to select my business type (Freelancer, Retail Shop, MSME, Other) and preferred language (Hindi/English) during onboarding so that the app is personalized from the start.

**US-03:** As a returning user, I want to log in with my phone number + OTP or Google Sign-In so that I can access my account securely.

**US-04:** As a user, I want the onboarding walkthrough to highlight the three core features (Scan Receipt, Dashboard, GST Reports) so that I understand the app's value within 60 seconds.

---

### Epic 2: Receipt & Invoice Scanning

**US-05:** As a shop owner, I want to tap a big "Scan Receipt" button, point my camera at a paper bill, and have the app extract all line items, GST, and totals automatically so that I never have to type a receipt manually.

**US-06:** As a user, I want to review and edit the scanned data (correct vendor name, amount, category) before saving it so that errors from imperfect OCR can be fixed easily.

**US-07:** As a user, I want to choose whether a scanned receipt is an "Expense" or a "Sale" so that it goes to the correct ledger.

**US-08:** As a user, I want to add a photo of a physical receipt to an existing expense entry so that I have a digital archive of all my bills.

**US-09:** As a user, I want the scan to work even with poor lighting and slightly crumpled receipts so that I don't need a perfect scanning environment.

**US-10:** As a user, I want to batch-scan multiple receipts in one session so that I can clear a week's worth of bills in minutes.

---

### Epic 3: UPI Transaction Management

**US-11:** As a user, I want to share a GPay/PhonePe transaction screenshot from my phone's share menu and have Khatabook AI auto-extract the amount, sender/receiver, and transaction ID so that I don't have to enter UPI details manually.

**US-12:** As a user, I want the app to suggest a category for each UPI transaction (e.g., "Raw Materials" for a payment to a supplier) so that I can confirm with one tap.

**US-13:** As a user, I want to link an incoming UPI payment to an existing invoice so that I can mark that invoice as paid automatically.

---

### Epic 4: Dashboard & Reports

**US-14:** As a user, I want a home dashboard that shows my current month's income, expenses, and profit at a glance so that I always know my financial health without diving into spreadsheets.

**US-15:** As a user, I want to tap on any chart element (e.g., "Food" in the expense pie chart) and see all transactions under that category so that I can drill into details.

**US-16:** As a user, I want to generate a GSTR-1-ready sales report with one tap and export it as a JSON file compatible with the GSTN portal so that I can file my returns efficiently.

**US-17:** As a user, I want to see my pending invoices and overdue payments highlighted on the dashboard so that I can follow up promptly.

---

### Epic 5: Payment Reminders

**US-18:** As a freelancer, I want to set up an automatic WhatsApp payment reminder for a client who hasn't paid an invoice within 3 days of the due date so that I can improve my collections without awkward conversations.

**US-19:** As a user, I want to receive an in-app reminder 5 days before my monthly GST filing deadline so that I never miss a filing date and incur penalties.

**US-20:** As a user, I want to customize my reminder messages with my business name and payment details so that reminders feel personal and professional.

---

### Epic 6: Invoice Generation & Sharing

**US-21:** As a freelancer, I want to create a professional invoice from within the app with my logo, item details, and GST breakdown so that I can send it to clients directly.

**US-22:** As a user, I want to share my invoice as a PDF via WhatsApp, Email, or generate a shareable link so that my client receives it in their preferred format.

---

### Epic 7: Data Management & Preferences

**US-23:** As a user, I want to switch between Hindi and English at any time from the settings so that I can use the app comfortably in my preferred language.

**US-24:** As a user, I want all my data to be backed up to the cloud automatically so that I don't lose my financial records if I change phones.

**US-25:** As a user, I want to export all my data as a CSV/Excel file so that I can keep a local backup or share it with my CA.

---

## 6. Feature Prioritization

### Must-Have (Phase 1 — MVP, 4 Weeks)

These features are essential for the product to be viable and deliver on its core promise.

| # | Feature | Rationale |
|---|---|---|
| 1 | **Sign Up / Login (Phone + OTP)** | Access without friction |
| 2 | **AI Receipt Scanning (photo → structured data)** | Core value prop — "Scan & Forget" |
| 3 | **Manual Receipt Entry (fallback)** | Essential for when scanning fails or user prefers typing |
| 4 | **Expense & Income Categorization** | Basic bookkeeping |
| 5 | **Dashboard (Income, Expense, Profit overview)** | User needs to see value immediately |
| 6 | **GST Report Generation (basic)** | Key differentiator vs generic expense apps |
| 7 | **Data Export (CSV)** | Users must be able to get data out |
| 8 | **Cloud Backup** | Trust and data safety |
| 9 | **Hindi + English UI** | Critical for target market |
| 10 | **UPI Screenshot Scanning (basic)** | Addresses #1 user pain point |
| 11 | **Payment Mode Tagging** | Track Cash vs UPI vs Card |

### Should-Have (Phase 2 — Weeks 5–10)

Enhancements that make the product competitive and sticky.

| # | Feature | Rationale |
|---|---|---|
| 12 | **Invoice Generator** | Freelancers need to create invoices |
| 13 | **Payment Reminders (in-app + WhatsApp)** | Addresses payment collection pain |
| 14 | **Client Management** | Per-client tracking |
| 15 | **Multi-Business Support** | Users with side hustles |
| 16 | **Advanced GST Reports (ITC, HSN-wise)** | Deep compliance support |
| 17 | **Receipt Search** | Find past receipts quickly |
| 18 | **Accountant / CA Access** | CA collaboration is a use case |
| 19 | **Category Rules (auto-categorize by vendor)** | Reduces manual work over time |
| 20 | **Push Notifications** | Engagement and reminders |

### Nice-to-Have (Phase 3 — Weeks 11–20+)

Delight features and integrations that set Khatabook AI apart long-term.

| # | Feature | Rationale |
|---|---|---|
| 21 | **Bank Statement Import & Auto-Match** | Full automation of bookkeeping |
| 22 | **Tally / Zoho Integration** | Interoperability with existing tools |
| 23 | **Marathi, Gujarati, Tamil, Bengali support** | Expand regional reach |
| 24 | **Receipt Tags & Notes** | Better organization |
| 25 | **Budget Alerts** | Spend limit notifications |
| 26 | **Profit & Loss Statement (P&L)** | Formal financial statements |
| 27 | **Balance Sheet** | Full accounting suite |
| 28 | **AI Financial Insights** | "You spent 20% more on supplies this month" |
| 29 | **Recurring Invoice Templates** | Subscription-style billing |
| 30 | **Team Collaboration** | Multiple users on one business account |

---

## 7. Success Metrics

### North Star Metric

**Monthly Active Users (MAU)** who perform at least one scan and view their dashboard in a given month.

### Key Performance Indicators (KPIs)

#### User Acquisition

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|---|---|---|---|
| Total Sign-ups | 25,000 | 100,000 | 400,000 |
| Weekly Active Users (WAU) | 10,000 | 40,000 | 160,000 |
| Monthly Active Users (MAU) | 15,000 | 60,000 | 240,000 |
| MAU / Sign-up ratio (activation rate) | 60% | 65% | 70% |
| Organic vs Paid sign-up ratio | 70/30 | 75/25 | 80/20 |

#### Engagement & Retention

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|---|---|---|---|
| Daily Active Users (DAU) | 3,000 | 15,000 | 70,000 |
| DAU / MAU ratio | 20% | 25% | 30% |
| Average Scans per User / Week | 5 | 8 | 12 |
| 7-Day Retention | 45% | 50% | 55% |
| 30-Day Retention | 30% | 35% | 40% |
| 90-Day Retention | 20% | 25% | 30% |

#### Revenue (Monetization)

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|---|---|---|---|
| MRR (Monthly Recurring Revenue) | ₹50,000 | ₹3,00,000 | ₹15,00,000 |
| Free → Pro conversion rate | 3% | 5% | 7% |
| Free → Business conversion rate | 0.5% | 1% | 1.5% |
| Average Revenue Per User (ARPU) | ₹20 | ₹35 | ₹50 |
| ARPPU (paying users) | ₹500 | ₹500 | ₹500 |

#### Product Quality

| Metric | Target |
|---|---|
| OCR Accuracy (structured fields correct) | ≥ 85% |
| Average Scan Time | ≤ 3 seconds |
| App Crash Rate | < 0.5% |
| App Store Rating | ≥ 4.3 stars |
| NPS (Net Promoter Score) | ≥ 40 |

---

## 8. Competitive Analysis

### Competitors

| Competitor | Type | Strengths | Weaknesses | Khatabook AI Advantage |
|---|---|---|---|---|
| **Zoho Books** | Full accounting suite | Powerful, GST-ready, integrates with Zoho ecosystem | Overwhelming for non-accountants; steep learning curve; ₹299/month minimum | Simpler UX, AI-first scanning, Hindi support, lower entry price (₹0 free tier) |
| **Khatabook (existing app)** | Digital ledger / Udhar Khata | Huge user base (50M+), simple Khata management, WhatsApp integration | No AI scanning, no GST reports, manual entry, limited to ledger tracking | AI scanning, GST compliance, UPI categorization, receipt OCR |
| **Vyapar** | Business accounting & billing | Desktop + mobile, inventory, billing, GST | UI feels dated; mobile experience is secondary; English/Hindi but not AI-powered | AI-first, mobile-native, modern UX, auto-scanning |
| **QuickBooks India** | Cloud accounting | Brand trust, bank feeds, CA collaboration | Expensive (₹1,200+/month), English-only, complex for micro-businesses | Free entry, bilingual, simple AI-driven workflows |
| **ClearTax GST** | GST filing focus | GST-specific, CA network, reliable | Expensive for filing alone; not a daily expense tracker; no scanning | Daily use app + GST, scanning + filing in one |
| **Google Sheets / Excel** | Manual spreadsheets | Free, flexible, familiar | Zero automation; no scanning; no GST format; no reminders | Automated, purpose-built, zero data entry required |
| **WhatsApp Notes** | Informal tracking | Ubiquitous, no app needed | No structure; no reports; no GST; data scattered | Structured, searchable, compliant, AI-enhanced |

### Competitive Positioning Map

```
 High AI / Automation
 │
 │ Khatabook AI │ Zoho Books
 │ (Target) │
 Simple & Bilingual │─────────────────┤ Complex & English
 │ Khatabook │ QuickBooks
 │ Vyapar │
 │ │
 Low AI / Automation
 ─────────────────────────────
 Simple & Bilingual Complex & English
```

### Our Unique Differentiators

1. **AI Scanning as the Default:** Not an add-on — scanning is the primary way users add data.
2. **Bilingual AI:** OCR and NLP models fine-tuned for Hindi + English mixed content.
3. **UPI-Native:** First-class UPI screenshot parsing and categorization.
4. **Freemium at ₹0:** Generous free tier removes the "try before you buy" barrier.
5. **GST-Ready from Day 1:** Not an afterthought — built into every transaction flow.

---

## 9. Monetization Strategy

### Freemium Model

| Tier | Price | Target Users | Features Included |
|---|---|---|---|
| **Free** | ₹0/month | Casual users, trial users | Up to 50 scans/month, basic dashboard, manual entry, CSV export, 1 business, 1 GB cloud storage |
| **Pro** | ₹149/month | Freelancers, serious micro-businesses | Unlimited scans, all dashboard features, GST reports, invoice generator, payment reminders, 10 GB storage, WhatsApp reminders (50/month) |
| **Business** | ₹499/month | MSMEs, multi-user businesses | Everything in Pro + multi-business support, advanced GST reports (ITC, HSN), CA access, bulk export, API access, unlimited WhatsApp reminders, 50 GB storage, priority support |

### One-Time Purchase Option

- **Invoice Templates Pack:** ₹99 one-time for 20 professional invoice templates
- **CA Handoff Pack:** ₹199 one-time for full year GST report package

### Add-Ons ( à la carte)

| Add-On | Price | Description |
|---|---|---|
| Extra WhatsApp Reminders | ₹49/month | Additional 200 WhatsApp reminders beyond plan limit |
| Extra Cloud Storage | ₹29/month | Additional 25 GB |
| Priority Support | ₹99/month | Chat support with < 4 hour response time |

### Revenue Projections

| Period | Free Users | Pro Users | Business Users | MRR |
|---|---|---|---|---|
| Month 1 | 5,000 | 150 | 25 | ₹37,875 |
| Month 3 | 20,000 | 1,000 | 150 | ₹2,24,250 |
| Month 6 | 60,000 | 3,000 | 500 | ₹9,97,500 |
| Month 12 | 200,000 | 12,000 | 3,000 | ₹33,51,000 |

### Pricing Rationale

- **₹0 Free:** Removes adoption barrier in a price-sensitive market
- **₹149 Pro:** Less than the cost of one CA visit; positioned as "your assistant, not a luxury"
- **₹499 Business:** For MSMEs that currently spend ₹5,000–₹20,000/year on accounting — still 75–90% cheaper
- **Psychological pricing:** Under ₹500, under ₹150 — fits within common Indian digital payment habits

### Other Revenue Streams (Future)

- **Embedded Insurance:** Micro-accident/business insurance via partner insurtechs (commission-based)
- **Credit / Working Capital:** Partner with NBFCs to offer small business loans (origination fee)
- **Marketplace:** Recommend accounting CAs, GST consultants (lead-gen commission)
- **White-Label:** Offer Khatabook AI to banks, fintechs as a co-branded product

---

## 10. Launch Roadmap

### Overview

| Phase | Duration | Focus | Key Deliverable |
|---|---|---|---|
| **Phase 1: MVP** | Weeks 1–4 | Core scanning + dashboard + basic GST | Launch-ready app on Play Store |
| **Phase 2: Growth** | Weeks 5–10 | Reminders, invoices, multi-business | Competitive parity with Vyapar |
| **Phase 3: Scale** | Weeks 11–20 | Advanced features, integrations, new languages | Market leadership in AI-bookkeeping |

---

### Phase 1: MVP (Weeks 1–4)

**Goal:** Ship a lean, working product that solves the core problem — scanning receipts and viewing a basic dashboard.

#### Week 1: Foundations

| Day | Task | Owner |
|---|---|---|
| 1–2 | Project kickoff, architecture decisions, repo setup | Engineering Lead |
| 3–4 | Design system setup (colors, typography, components in Hindi + English) | Designer |
| 5–7 | Auth flow (Phone + OTP) + Onboarding screens | Mobile Dev |
| 5–7 | Backend: User auth API, database schema (PostgreSQL) | Backend Dev |

#### Week 2: Scanning Engine

| Day | Task | Owner |
|---|---|---|
| 8–10 | Camera integration, image capture, preprocessing | Mobile Dev |
| 11–12 | OCR integration (Google ML Kit / Tesseract), text extraction | ML Engineer |
| 13–14 | NLP pipeline for field extraction (vendor, date, amount, items, GST) | ML Engineer |
| 13–14 | Receipt → structured data JSON mapping | ML Engineer + Backend |

#### Week 3: Core App Flows

| Day | Task | Owner |
|---|---|---|
| 15–16 | Scan flow UI (camera → preview → review → save/edit → confirm) | Mobile Dev |
| 17–18 | Manual entry form (fallback) | Mobile Dev |
| 19–20 | Dashboard: income, expenses, profit, recent transactions | Mobile Dev |
| 19–20 | Dashboard API endpoints | Backend Dev |

#### Week 4: GST Reports & Launch Prep

| Day | Task | Owner |
|---|---|---|
| 21–22 | GST report generation (basic sales + purchase summary, CSV export) | Backend Dev |
| 22–23 | Hindi + English localization (all screens) | Mobile Dev + Translator |
| 23–24 | Cloud backup sync | Backend Dev |
| 24–25 | QA testing, bug fixes, performance optimization | QA + Full Team |
| 26–27 | Play Store listing, screenshots, description, privacy policy | Marketing + Designer |
| 28 | **Internal Beta Launch** (team + friends/family, 50–100 users) | — |
| 28 | Analytics integration (Firebase / Mixpanel) | Mobile Dev |

#### Phase 1 Launch Criteria

- [ ] App available on Google Play Store
- [ ] 100+ beta testers sign up organically
- [ ] OCR accuracy ≥ 75% on test receipt dataset (500 samples)
- [ ] < 2 second average scan-to-result time
- [ ] Zero crash-on-launch bugs
- [ ] Play Store rating ≥ 4.0 from beta testers

---

### Phase 2: Growth (Weeks 5–10)

**Goal:** Add features that drive retention, monetization, and competitive differentiation.

| Week | Focus | Key Features |
|---|---|---|
| **Week 5** | Invoice Generator | Create, preview, share invoices as PDF; invoice templates |
| **Week 6** | Payment Reminders | In-app reminders; WhatsApp integration via Twilio/Gupshup |
| **Week 7** | Client Management | Client list, per-client transaction history, client tags |
| **Week 8** | Advanced GST Reports | ITC calculation, HSN-wise summary, GSTR-1/3B JSON export |
| **Week 9** | Receipt Search & Tags | Full-text search, custom tagging, batch actions |
| **Week 10** | Pro Tier & Monetization | Paywall, subscription management (Razorpay/Play Billing), CA access sharing |

#### Phase 2 Launch Criteria

- [ ] 1,000+ paying users (Pro or Business)
- [ ] MRR ≥ ₹2,00,000
- [ ] 30-day retention ≥ 35%
- [ ] WhatsApp reminder delivery rate ≥ 95%
- [ ] 3 positive tech/media mentions

---

### Phase 3: Scale (Weeks 11–20)

**Goal:** Expand reach, deepen integration, and build moats.

| Week | Focus | Key Features |
|---|---|---|
| **Week 11–12** | Multi-Business Support | Add/manage multiple businesses per account |
| **Week 13–14** | Bank Statement Import | PDF parsing, auto-transaction matching |
| **Week 15–16** | Regional Language Expansion | Marathi, Gujarati, Tamil UI + OCR tuning |
| **Week 17–18** | Integrations | Tally sync, Zoho Books integration, Google Sheets export |
| **Week 19–20** | AI Insights & Advanced Analytics | Smart spending alerts, trend predictions, budget recommendations |

#### Phase 3 Launch Criteria

- [ ] 100,000+ total sign-ups
- [ ] MRR ≥ ₹10,00,000
- [ ] 30-day retention ≥ 40%
- [ ] 3+ regional languages live
- [ ] At least one third-party integration live

---

### Post-Phase 3: Long-Term Vision (Months 6–18)

| Quarter | Focus |
|---|---|
| **Q3 2026** | Embedded credit (small business loans), insurance partnerships |
| **Q4 2026** | Web app (cross-device sync), marketplace for CAs |
| **Q1 2027** | AI financial advisor ("Ask your accountant" chatbot) |
| **Q2 2027** | Expansion to Bangladesh, Sri Lanka (SaaS play) |

---

## 11. Risk Assessment

### Risk Matrix

| Risk | Likelihood | Impact | Severity | Mitigation |
|---|---|---|---|---|
| **OCR accuracy below expectations on real-world receipts** | High | High | **Critical** | Train on 10,000+ Indian receipt samples; use ensemble (on-device + cloud LLM); always allow manual correction; set user expectations with confidence scores |
| **Low user acquisition / poor organic reach** | Medium | High | **High** | Pre-launch content marketing (YouTube tutorials, Instagram reels); referral program; ASO optimization; micro-influencer partnerships with small business creators |
| **Users distrust AI with financial data (privacy)** | Medium | High | **High** | Transparent privacy policy; on-device processing option; end-to-end encryption; clear "your data, your control" messaging; no data selling |
| **Competitor (Khatabook/Zoho) adds AI scanning** | Medium | Medium | **Medium** | Move fast — ship before they do; build moat via Hindi + UPI specialization; community & CA network; superior UX |
| **GST rule changes break report generation** | Medium | High | **High** | Assign a GST domain expert as advisor; monitor CBIC notifications; build report engine with configurable rules; release updates within 72 hours of notification |
| **WhatsApp API pricing / policy changes** | Low | Medium | **Medium** | Support multiple channels (SMS, Email, in-app) as fallbacks; negotiate bulk pricing; monitor WhatsApp Business API policy |
| **App Store / Play Store rejection** | Low | High | **Medium** | Ensure compliance with store policies (privacy, permissions); thorough pre-submission QA; maintain clear permission justifications (camera for scanning, storage for backup) |
| **Scaling costs exceed revenue** | Medium | High | **High** | Monitor cloud costs per user; optimize OCR to run more on-device; use serverless for variable workloads; aggressive unit economics review at 10K users |
| **Team bandwidth / execution speed** | Medium | Medium | **Medium** | Hire aggressively for MVP; use no-code/low-code for non-core features; rigorous sprint planning; weekly review of progress vs roadmap |
| **Regulatory changes (IT/Data Protection)** | Low | High | **Medium** | Stay updated on DPDP Act; hire compliance consultant; implement data localization (India servers); user data export/deletion flows |

---

## 12. Appendix: User Personas

### Persona 1: Ravi — The Freelance Graphic Designer

| Attribute | Detail |
|---|---|
| **Name** | Ravi Sharma |
| **Age** | 28 |
| **Location** | Indore, Madhya Pradesh |
| **Occupation** | Freelance graphic designer (3 years) |
| **Income** | ₹40,000–₹80,000/month (variable) |
| **Tech Comfort** | High — uses Figma, Canva, GPay daily |
| **Languages** | Hindi, English (Hinglish mix) |
| **Devices** | Android (Samsung M-series), Laptop |

**Daily Routine:**
- Works from home, takes projects via Upwork and Instagram
- Receives payments via GPay, bank transfer, or PayPal
- Buys software subscriptions (Adobe, cloud storage) and occasionally hires subcontractors

**Pain Points:**
- "I have 20+ clients. I forget who paid and who didn't."
- "I don't know how much I actually earn after expenses."
- "GST filing feels like rocket science — I just file at the last minute with help from a friend."
- "I save payment screenshots in a WhatsApp folder — it's a mess."

**Goals:**
- Track income per client
- Know exact profit after expenses
- Simplify GST filing
- Get paid faster with professional reminders

**Quote:** *"Mujhe ek aisa tool chahiye jo meri receipts padh ke khud GST bana de. Maine Excel mein try kiya but bahut time lagta hai."*

---

### Persona 2: Sunita — The Kirana Store Owner

| Attribute | Detail |
|---|---|
| **Name** | Sunita Devi |
| **Age** | 42 |
| **Location** | Patna, Bihar |
| **Occupation** | Kirana (grocery) shop owner (8 years) |
| **Income** | ₹15,000–₹35,000/month |
| **Tech Comfort** | Low-Medium — uses WhatsApp, PhonePe for business |
| **Languages** | Hindi (primary), basic English |
| **Devices** | Android (Redmi), feature phone for calls |

**Daily Routine:**
- Opens shop at 7 AM, handles 50–80 customers daily
- Buys inventory from 2–3 wholesalers (cash + UPI)
- Maintains a handwritten ledger (bahi-khata)
- Uses PhonePe to receive customer payments

**Pain Points:**
- "My ledger gets torn and wet during monsoon. I lose data."
- "I don't know my exact profit. I just know I have money left at month end."
- "Wholesalers give bills but I throw them away — later I need them for GST."
| "My CA charges ₹8,000 every quarter for GST. Can I do it myself?"

**Goals:**
- Digital record-keeping that's simple
- Know monthly profit without calculating for hours
- Reduce CA fees
- Track what inventory costs and what sells best

**Quote:** *"GST ki file karwane ke liye har baar ₹8,000 deti hoon CA ko. Chahte hain khud karein par data collect karna bahut difficult hai."*

---

### Persona 3: Arjun — The Small IT Services MSME

| Attribute | Detail |
|---|---|
| **Name** | Arjun Mehta |
| **Age** | 35 |
| **Location** | Pune, Maharashtra |
| **Occupation** | Runs a 5-person IT services company (web dev, support) |
| **Income** | ₹2L–₹5L/month (company turnover ~₹40L/year) |
| **Tech Comfort** | High — manages Tally, uses multiple SaaS tools |
| **Languages** | English (primary), Hindi, Marathi |
| **Devices** | Android + iPhone (work), MacBook Pro |

**Daily Routine:**
- Manages 3–4 ongoing client projects
- Issues invoices monthly via email
- Receives payments via bank transfer, Razorpay, UPI
- Has an accountant but needs organized data to share with them
- Tracks office rent, salaries, software subscriptions

**Pain Points:**
- "My accountant calls me 5 times a month asking for invoices and receipts."
| "I lose track of project-specific expenses — was this server cost for Client A or Client B?"
- "I want real-time P&L visibility, not just at month end."
- "Bank statements don't match with my expense entries — reconciliation takes hours."

**Goals:**
- Auto-categorize expenses by project/client
- Share data seamlessly with CA
- Real-time financial dashboard
- Bank reconciliation

**Quote:** *"I spend more time preparing data for my CA than actually working with clients. Automation should help me here."*

---

### Persona 4: Priya — The Home Baker & Cloud Kitchen Owner

| Attribute | Detail |
|---|---|
| **Name** | Priya Patel |
| **Age** | 26 |
| **Location** | Ahmedabad, Gujarat |
| **Occupation** | Home baker (orders via Instagram, Swiggy) |
| **Income** | ₹20,000–₹45,000/month |
| **Tech Comfort** | Medium — active on Instagram, uses GPay |
| **Languages** | Gujarati (primary), Hindi, English |
| **Devices** | Android (Realme) |

**Daily Routine:**
- Takes orders on Instagram DMs and Swiggy
- Buys ingredients from local markets (cash)
- Pays for delivery via UPI
- Receives payments via GPay, cash on delivery

**Pain Points:**
- "I don't know if I'm making profit on each cake. I just know I'm earning."
- "Ingredient bills are all cash — I never save them."
- "When I file GST, I don't know what to put for purchases."
- "I forget which customer's order was paid and which is pending."

**Goals:**
- Track ingredient costs per recipe
- Know per-order profitability
- Simple GST tracking
- Payment follow-ups for pending orders

**Quote:** *"Baking is easy, accounting is hard. Mujhe bas batayein ki har cake pe kitna profit ho raha hai."*

---

### Persona 5: Deepak — The Delivery Partner / Gig Worker

| Attribute | Detail |
|---|---|
| **Name** | Deepak Kumar |
| **Age** | 24 |
| **Location** | Bangalore, Karnataka |
| **Occupation** | Swiggy/Zomato delivery partner |
| **Income** | ₹18,000–₹30,000/month (variable) |
| **Tech Comfort** | Medium — uses apps for work, WhatsApp for family |
| **Languages** | Hindi, Kannada (basic), English |
| **Devices** | Android (budget phone) |

**Daily Routine:**
- Works 10–12 hours/day delivering food
- Spends on fuel, vehicle maintenance, phone recharge
- Receives daily/weekly payouts via UPI
- Occasionally pays a helper

**Pain Points:**
- "I don't track my expenses — fuel, repair, phone. At tax time I have nothing."
- "My payout varies daily. I don't know my weekly or monthly average."
- "I pay income tax but have no records to show."

**Goals:**
- Track daily fuel and maintenance expenses
- Know monthly income and net savings
- Simple records for ITR filing
- Set a savings goal

**Quote:** *"Sab log kehte hain expense track karo par time nahi hai. Koi simple tareeka ho toh batayein."*

---

*End of Product Requirements Document — Khatabook AI*
