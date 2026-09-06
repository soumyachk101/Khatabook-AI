# WIREFRAMES.md — ASCII Wireframes
## Khatabook AI

All wireframes below are ASCII representations of mobile-first layouts (375px width).
Desktop variants are noted where applicable.

---

## Table of Contents
1. [Landing Page](#1-landing-page)
2. [Auth Page (Login/Signup)](#2-auth-page)
3. [Onboarding Wizard](#3-onboarding-wizard)
4. [Dashboard](#4-dashboard)
5. [Receipt Scanner](#5-receipt-scanner)
6. [Invoice List](#6-invoice-list)
7. [Invoice Creation (3-Step Wizard)](#7-invoice-creation)
8. [Invoice Detail](#8-invoice-detail)
9. [Expense List](#9-expense-list)
10. [Expense Detail](#10-expense-detail)
11. [GST Reports Dashboard](#11-gst-reports-dashboard)
12. [Payments Dashboard](#12-payments-dashboard)
13. [Settings](#13-settings)

---

## 1. Landing Page

```
╔══════════════════════════════════════════════════╗
║ 🧾 Khatabook AI 🔍 Login [Sign Up →] ⚙️ ║ ← Navbar
╠══════════════════════════════════════════════════╣
║ ║
║ 🧾 Khatabook AI ║
║ ║
║ The Smartest Way to ║
║ Manage Your Business Money ║
║ ║
║ Track expenses · Scan receipts · ║
║ Auto GST reports · Get paid faster ║
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ 🚀 Start for Free → ║ ║ ← Primary CTA
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ [📷 Try Demo] [▶ Watch Video (2:30)] ║ ← Secondary
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ ║ ║
║ ║ 📱 App Screenshot Mockup ║ ║
║ ║ ║ ║
║ ║ [Floating phone screens showing] ║ ║
║ ║ receipt scan → invoice → payment ║ ║
║ ║ ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
╠══════════════════════════════════════════════════╣
║ ║
║ ⭐ 4.8/5 ║ 50K+ Businesses ║ ₹500Cr+ ║
║ ║
╠══════════════════════════════════════════════════╣
║ ║
║ EVERYTHING YOU NEED ║ ← Section title
║ ║
║ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ║
║ │ 📷 │ │ 📄 │ │ 🧾 │ │ 💰 │ ║ ← Feature cards
║ │ AI Receipt │ │ Smart │ │ Auto GST │ │ Payments │ ║
║ │ Scanner │ │ Invoices │ │ Reports │ │ & Settle │ ║
║ │ │ │ │ │ │ │ │
║ │ Snap photo │ │ Create & │ │ GSTR-1 & │ │ Track all │ ║
║ │ of any bill │ │ send WApp │ │ GSTR-3B │ │ payments │ ║
║ │ │ │ │ auto-fill │ │ │ │
║ │ • AI reads │ │ • WhatsApp │ │ • ITC │ │ • UPI QR │ ║
║ │ all data │ │ share │ │ tracking │ │ codes │ ║
║ │ • Auto GST │ │ • GST calc │ │ • Deadlines│ │ • Auto │ ║
║ │ • Categorize│ │ • Tracking │ │ • Alerts │ │ reminders│ ║
║ │ │ │ │ │ │ │ │
║ │ [Try Now →]│ │ [Create →]│ │ [View →]│ │ [Learn →]│ ║
║ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ ║
║ ║
╠══════════════════════════════════════════════════╣
║ ║
║ HOW IT WORKS — 3 SIMPLE STEPS ║
║ ║
║ (1) (2) (3) ║
║ ┌──────┐ ┌──────┐ ┌──────┐ ║
║ │ 📷 │ │ 🤖 │ │ 💰 │ ║
║ │ SNAP│───▶│ AI │───▶│ PAID│ ║
║ │ │ │ MAGIC│ │ │ ║
║ │Take │ │Auto- │ │Get │ ║
║ │photo│ │reads │ │paid │ ║
║ │of bill│ │data │ │fast │ ║
║ └──────┘ └──────┘ └──────┘ ║
║ ║
╠══════════════════════════════════════════════════╣
║ ║
║ SIMPLE PRICING ║
║ ║
║ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ║
║ │ FREE │ │ PRO ⭐ │ │ BUSINESS │ ║
║ │ ₹0/mo │ │ ₹149/mo │ │ ₹399/mo │ ║
║ │ │ │ │ │ │
║ │ ✓ 10 scans │ │ ✓ Unlimited│ │ ✓ Unlimited│ ║
║ │ ✓ 5 invoices│ │ ✓ Unlimited│ │ ✓ Custom │ ║
║ │ ✓ Basic GST│ │ ✓ Advanced │ │ branding │ ║
║ │ ✓ Email │ │ GST │ │ ✓ Multi- │ ║
║ │ │ │ ✓ WhatsApp │ │ user │ ║
║ │ [Get Started]│ │ [Start Pro]│ │ [Contact]│ ║
║ └──────────────┘ └──────────────┘ └──────────────┘ ║
║ ║
╠══════════════════════════════════════════════════╣
║ ║
║ TESTIMONIALS ║
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ ⭐⭐⭐⭐⭐ ║ ║
║ ║ "Saved me 10 hours/month on GST!" ║ ║
║ ║ — Rajesh, Freelance Designer ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
╠══════════════════════════════════════════════════╣
║ ║
║ Ready to simplify your finances? ║
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ Start Free Today → ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ © 2026 Khatabook AI | Privacy | Terms ║ ← Footer
╚══════════════════════════════════════════════════╝
```

---

## 2. Auth Page

```
╔══════════════════════════════════════════════════╗
║ [← Back] Sign In ║ ← Header
╠══════════════════════════════════════════════════╣
║ ║
║ 🧾 Khatabook AI ║ ← Logo
║ ║
║ Welcome back! ║ ← Title
║ Sign in to continue managing your business ║
║ ║
║ Phone Number ║ ← Form
║ ╔════════════════════════════════════════════╗ ║
║ ║ +91 [98765 43210] [📋] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Password ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [••••••••••] 👁 ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ [Forgot Password?] ║ ← Link
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ Sign In ║ ║ ← Primary button
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ ──── or continue with ──── ║ ← Divider
║ ║
║ ┌──────────┐ ┌──────────┐ ┌──────────┐ ║ ← OAuth
║ │ 🔵 Google │ │ 🍎 Apple │ │ 📱 OTP │ ║
║ └──────────┘ └──────────┘ └──────────┘ ║
║ ║
║ Don't have an account? [Sign Up] ║ ← Toggle
╚══════════════════════════════════════════════════╝
```

---

## 3. Onboarding Wizard

### Slide 1: Welcome

```
╔══════════════════════════════════════════════════╗
║ Skip → ║ ← Skip
╠══════════════════════════════════════════════════╣
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ ║ ║ ← Illustration
║ ║ 📷 Scan Receipt ║ ║
║ ║ ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Track Every Expense ║ ← Title
║ ║
║ Snap a photo of any receipt and our AI ║
║ will automatically extract all the details ║
║ and categorize your expenses. ║ ← Description
║ ║
║ ○ ○ ● ○ ║ ← Dots (active: slide 2)
║ ║
║ [Continue →] ║ ← CTA
╚══════════════════════════════════════════════════╝
```

### Slide 2-4: Features

```
Slide 2 (AI Scanning):
 Illustration: 🤖 Receipt with highlighted fields
 Title: AI-Powered OCR
 Desc: Extract vendor, amount, GST, items in 3 seconds

Slide 3 (GST):
 Illustration: 🧾 GSTR-1/3B forms
 Title: Auto GST Reports
 Desc: GSTR-1, GSTR-3B auto-filled. ITC tracked.

Slide 4 (Payments):
 Illustration: 💰 UPI + Payment link
 Title: Get Paid Faster
 Desc: Share payment links via WhatsApp/UPI
```

### Language Selection

```
╔══════════════════════════════════════════════════╗
║ ← Onboarding ║
╠══════════════════════════════════════════════════╣
║ ║
║ Choose Your Language ║
║ ║
║ ┌──────────────┐ ┌──────────────┐ ║
║ │ English │ │ हिंदी │ ║
║ │ 🇬🇧 │ │ 🇮🇳 │ ║ ← Language cards
║ └──────────────┘ └──────────────┘ ║
║ ║
║ ┌──────────────┐ ┌──────────────┐ ║
║ │ Hinglish │ │ தமிழ் │ ║
║ │ 🇮🇳 │ │ 🇮🇳 │ ║
║ └──────────────┘ └──────────────┘ ║
║ ║
║ ┌──────────────┐ ┌──────────────┐ ║
║ │ తెలుగు │ │ বাংলা │ ║
║ │ 🇮🇳 │ │ 🇮🇳 │ ║
║ └──────────────┘ └──────────────┘ ║
║ ║
║ ┌──────────────┐ ┌──────────────┐ ║
║ │ मराठी │ │ ગુજરાતી │ ║
║ │ 🇮🇳 │ │ 🇮🇳 │ ║
║ └──────────────┘ └──────────────┘ ║
║ ║
║ [Continue →] ║
╚══════════════════════════════════════════════════╝
```

### User Type Selection

```
╔══════════════════════════════════════════════════╗
║ ← Onboarding ║
╠══════════════════════════════════════════════════╣
║ ║
║ What describes you best? ║
║ ║
║ ┌──────────────────────────────────────┐ ║
║ │ 👤 ║ ← Freelancer card
║ │ ║ ║
║ │ Freelancer ║ ║
║ │ ║ ║
║ │ I work independently as a ║ ║
║ │ designer, developer, consultant ║ ║
║ │ ║ ║
║ │ Examples: Designer, Developer, ║ ║
║ │ Writer, Consultant ║ ║
║ └──────────────────────────────────────┘ ║
║ ║
║ ┌──────────────────────────────────────┐ ║
║ │ 🏢 ║ ← Business card
║ │ ║ ║
║ │ Small Business ║ ║
║ │ ║ ║
║ │ I run a shop or small business ║ ║
║ │ ║ ║
║ │ Examples: Retail shop, Restaurant, ║ ║
║ │ Cafe, Agency ║ ║
║ └──────────────────────────────────────┘ ║
║ ║
║ ┌──────────────────────────────────────┐ ║
║ │ 👥 ║ ← Both card
║ │ ║ ║
║ │ Both ║ ║
║ │ ║ ║
║ │ I freelance AND run a business ║ ║
║ └──────────────────────────────────────┘ ║
║ ║
║ [Continue →] ║
╚══════════════════════════════════════════════════╝
```

### Permissions Request

```
╔══════════════════════════════════════════════════╗
║ ← Onboarding ║
╠══════════════════════════════════════════════════╣
║ ║
║ We Need a Few Permissions ║
║ ║
║ ┌──────────────────────────────────────┐ ║
║ │ 📷 ║ ← Permission card
║ │ Camera Access ║ ║
║ │ ║ ║
║ │ To scan receipts and invoices, ║ ║
║ │ we need access to your camera. ║ ║
║ │ ║ ║
║ │ [Allow Camera] [Skip] ║ ║
║ └──────────────────────────────────────┘ ║
║ ║
║ ┌──────────────────────────────────────┐ ║
║ │ 🔔 ║ ← Permission card
║ │ Notifications ║ ║
║ │ ║ ║
║ │ Get reminders for GST deadlines, ║ ║
║ │ invoice due dates, and payments. ║ ║
║ │ ║ ║
║ │ [Allow Notifications] [Skip] ║ ║
║ └──────────────────────────────────────┘ ║
║ ║
║ [Continue →] ║
╚══════════════════════════════════════════════════╝
```

---

## 4. Dashboard

### Mobile Dashboard

```
╔══════════════════════════════════════════════════╗
║ 🧾 Khatabook AI 🔔(3) 👤 ║ ← Header
╠══════════════════════════════════════════════════╣
║ ║
║ Namaste, Rajesh 👋 ║ ← Greeting
║ Rajesh Graphics ║ ← Business name
║ ║
║ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ║
║ │ ₹45K │ │ ₹12K │ │ 3 Due │ │₹3,240│ ║ ← Stats
║ │ Income│ │Expense│ │Pending│ │ GST │ ║
║ │ ↑12% │ │ ↑5% │ │ → │ │Soon │ ║
║ └────────┘ └────────┘ └────────┘ └────────┘ ║
║ ║
║ [← Swipe for more stats →] ║
║ ║
║ 📊 Income vs Expenses ║
║ ┌──────────────────────────────────────────┐ ║
║ │ ██████████████████████ ████████████ ██ │ ║ ← Chart
║ │ ██████████████████ ██████████ ████ │ ║
║ │ ███████████████ █████████ ██████ │ ║
║ │ █████████████ ███████ ████████ │ ║
║ │ ██████████ ██████ ██████████ │ ║
║ │ Jul Aug Sep │ ║
║ └──────────────────────────────────────────┘ ║
║ ║
║ 🕐 Recent Activity [See All] ║
║ ┌──────────────────────────────────────────┐ ║
║ │ 📷 ₹2,400 BigBasket · 2 hours ago │ ║ ← Activity
║ ├──────────────────────────────────────────┤ ║
║ │ 📄 INV-104 ₹7,670 Sent · 5 hours ago │ ║
║ ├──────────────────────────────────────────┤ ║
║ │ 💸 ₹800 Petrol · 1 day ago │ ║
║ ├──────────────────────────────────────────┤ ║
║ │ 📄 INV-103 ₹3,200 Paid · 2 days ago │ ║
║ └──────────────────────────────────────────┘ ║
║ ║
║ ➕ Quick Actions ║
║ ┌──────────┐ ┌──────────┐ ║
║ │ 📷 Scan │ │ 📄 New │ ║
║ │ Receipt │ │ Invoice │ ║
║ ├──────────┤ ├──────────┤ ║
║ │ 💸 Add │ │ 🧾 GST │ ║
║ │ Expense │ │ Report │ ║
║ └──────────┘ └──────────┘ ║
║ ║
╠══════════════════════════════════════════════════╣
║ 🏠 Home 📷 Scan ➕ 📄 📊 👤 ║ ← Bottom Nav
╚══════════════════════════════════════════════════╝
```

### Desktop Dashboard

```
╔══════════════════════════════════════════════════════════════════╗
║ ║
║ ╔════╦═══════════════════════════════════════════════════════════╗║
║ ║ Khat│ Namaste, Rajesh 👋 Rajesh Graphics 🔔(3) 👤 ║║
║ � .AI │ ║║
║ ║ │ ╔══════╦══════╦══════╦══════╦══════╦══════╗ ║║
║ ║ │ ║₹45K │ ║₹12K │ ║ 3 Due║₹3K │ ║₹32K │ ║₹18K │ ║║
║ ║ │ ║Income║Expens│ ║Pend. │ GST │ ║Profit║ITC │ ║║
║ ║ │ ╚══════╩══════╩══════╩══════╩══════╩══════╝ ║║
║ ║ │ ║║
║ ║ │ ╔═══════════════════╦═══════════════════════╗ ║║
║ ║Home│ ║ 📊 Income vs Exp. ║ 📈 Category Spend ║ ║║
║ ║ │ ║ │ ║ │ ║║
║ ║Scan│ ║ ████████████████ │ │Supplies ████░ ₹4,500║ ║║
║ ║ │ ║ ████████████ │ │Travel ██░ ₹3,200 ║ ║║
║ ║Inv│ ║ ██████████ │ │Software █░ ₹1,920 ║ ║║
║ ║ │ ║ ██████ │ │Food █ ₹1,280 ║ ║║
║ ║Exp│ ║ ███ │ │Other █░ ₹900 ║ ║║
║ ║ │ ║ │ ║ │ ║║
║ ║GST│ ║ Jul Aug Sep │ ║ │ ║║
║ ║ │ ╚═══════════════════╩═══════════════════════╝ ║║
║ ║Rep│ ║ ║║
║ ║ │ ╔═══════════════════════════════════════════╗ ║║
║ ║Set│ ║ 🕐 Recent Activity [View All] ║ ║║
║ ║ │ ║ │ ║║
║ ║ │ ║ 📷 ₹2,400 BigBasket · 2h │ ║ ║║
║ ║ │ ║ 📄 INV-104 ₹7,670 Sent · 5h ║ ║║
║ ║ │ ║ 💸 ₹800 Petrol · 1d ║ ║║
║ ║ │ ║ 📄 INV-103 ₹3,200 Paid · 2d ║ ║║
║ ║ │ ╚═══════════════════════════════════════════╝ ║║
║ ║ │ ║║
║ ╚════╩═══════════════════════════════════════════════════════════╝║
║ ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 5. Receipt Scanner

### Camera View

```
╔══════════════════════════════════════════════════╗
║ [← Back] Receipt Scanner [⚡] [🔄] ║ ← Header
╠══════════════════════════════════════════════════╣
║ ║
║ ┌──────────────────────────────────────────┐ ║
║ │ ║ ║
║ │ ║ ║
║ │ ╔══════════════════════════════════════╗ ║ ║
║ │ ║ ║ ║
║ │ ║ ╔══════════════════════════════════╗ ║ ║
║ │ ║ ║ ║ ║
║ │ ║ ║ ╔══════════════════════════════╗ ║ ║
║ │ ║ ║ ║ ║ ║ ← Frame guide
║ │ ║ ║ ║ Place Receipt Here ║ ║ ║
║ │ ║ ║ ║ ║ ║
║ │ ║ ║ ╚══════════════════════════════╝ ║ ║
║ │ ║ ║ ║ ║
║ │ ║ ╚══════════════════════════════════╝ ║ ║
║ │ ║ ║ ║
║ │ ╚══════════════════════════════════════╝ ║ ║
║ │ ║ ║
║ │ ║ ║
║ └──────────────────────────────────────────┘ ║
║ ║
║ Align the receipt within the frame ║ ← Instruction
║ ║
║ ┌──────────────────┐ ║
║ │ 📷 │ ║ ← Capture FAB
║ │ Capture │ ║
║ └──────────────────┘ ║
║ ║
║ [🖼️ Gallery] [📸 Camera] ║ ← Options
╚══════════════════════════════════════════════════╝
```

### Processing Screen

```
╔══════════════════════════════════════════════════╗
║ Processing... ║
╠══════════════════════════════════════════════════╣
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ ║ ║
║ ║ ┌─────────────────┐ ║ ║
║ ║ │ ║ ║
║ ║ │ (Spinning) ║ ║
║ ║ │ ║ ║
║ ║ │ 🤖 ║ ║ ← Spinner + icon
║ ║ │ ║ ║
║ ║ │ Processing ║ ║
║ ║ │ your receipt... ║ ║
║ ║ │ ║ ║
║ ║ │ ████████░░ 80% ║ ║ ← Progress
║ ║ │ ║ ║
║ ║ └─────────────────┘ ║ ║
║ ║ ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ ✓ Step 1: OCR Extraction ║
║ ⏳ Step 2: Structuring data... ║ ← Steps
║ ⬜ Step 3: Categorizing ║
║ ║
╚══════════════════════════════════════════════════╝
```

### Receipt Edit Form

```
╔══════════════════════════════════════════════════╗
║ ← Back Edit Receipt [🗑️] ║
╠══════════════════════════════════════════════════╣
║ ║
║ ┌──────────────────────────────────────────┐ ║
║ │ 📷 [Receipt Image Preview] │ ║ ← Image
║ │ [Retake] [Rotate] │ ║
║ └──────────────────────────────────────────┘ ║
║ ║
║ AI Extracted: ║
║ ║
║ Amount ║ ← Editable fields
║ ╔════════════════════════════════════════════╗ ║
║ ║ ₹ [2,450 ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Vendor ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [BigBasket ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Date ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [06 Sep 2026 📅] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Category [Groceries ▾] ║
║ ║
║ Payment Mode [UPI ▾] ║
║ ║
║ Items detected by AI: ║
║ ┌──────────────────────────────────────────┐ ║
║ │ Milk 2L ₹60 ║ ║
║ │ Bread ₹40 ║ ║ ← Detected items
║ │ Eggs (12) ₹90 ║ ║
║ │ [Add/Edit Items] ║ ║
║ └──────────────────────────────────────────┘ ║
║ ║
║ CGST (9%) [₹78 ] SGST (9%) [₹78 ] ║
║ ║
║ Notes [Optional...] ║
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ 💾 Save as Expense ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ [📄 Convert to Invoice] [🔄 Scan Another] ║
╚══════════════════════════════════════════════════╝
```

---

## 6. Invoice List

```
╔══════════════════════════════════════════════════╗
║ ← Invoices [+ New] 🔍 ║
╠══════════════════════════════════════════════════╣
║ ║
║ Filter: All ▾ │ Sort: Date ▾ ║
║ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ INV-104 🟢 PAID ║ ║ ← Invoice card
║ │ Rajesh Kumar ║ ║
║ │ ₹7,670 · 06 Sep 2026 ║ ║
║ │ Paid on 05 Oct 2026 ║ ║
║ └──────────────────────────────────────────────┘ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ INV-103 🔵 SENT ║ ║
║ │ Priya Sharma ║ ║
║ │ ₹3,200 · 05 Sep 2026 ║ ║
║ │ Viewed 1 time · Due 5 Oct ║ ║
║ └──────────────────────────────────────────────┘ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ INV-102 🟣 VIEWED ║ ║
║ │ Amit Patel ║ ║
║ │ ₹12,000 · 01 Sep 2026 ║ ║
║ │ Viewed 3 times · Due 1 Oct ║ ║
║ └──────────────────────────────────────────────┘ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ INV-101 🔴 OVERDUE ║ ║
║ │ Sneha Gupta ║ ║
║ │ ₹5,400 · 15 Aug 2026 ║ ║
║ │ 22 days overdue ║ ║
║ └──────────────────────────────────────────────┘ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ INV-100 ⚪ DRAFT ║ ║
║ │ New Client ║ ║
║ │ ₹8,000 · Not sent yet ║ ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ ────────────────────────────────────────────── ║ ← Summary
║ Total: ₹36,270 │ Paid: ₹7,670 │ Due: ₹28,600 ║
║ ║
║ [Load More...] ║
╚══════════════════════════════════════════════════╝
```

---

## 7. Invoice Creation

### Step 1: Client Information

```
╔══════════════════════════════════════════════════╗
║ ← Back New Invoice ║
╠══════════════════════════════════════════════════╣
║ ║
║ Step 1 of 3: Client Information ║
║ ████████████░░░░░░░░░░ ║ ← Progress bar
║ ║
║ Client Name * ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [Rajesh Kumar ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Phone * ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [98765 43210 ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Email ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [rajesh@email.com ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ GSTIN ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [27XXXXXX1234X1ZX] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Billing Address ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [123 Main Street ] ║ ║
║ ║ [Mumbai, MH 400001 ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ [+ Save as New Client] ║
║ ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [← Back] [Continue →] ║ ║ ← Navigation
║ ╚════════════════════════════════════════════╝ ║
╚══════════════════════════════════════════════════╝
```

### Step 2: Line Items

```
╔══════════════════════════════════════════════════╗
║ ← Back New Invoice ║
╠══════════════════════════════════════════════════╣
║ ║
║ Step 2 of 3: Items & Services ║
║ ██████████████████░░░░ ║
║ ║
║ # Item Description Qty Rate GST% Amount ║ ← Table header
║ ══════════════════════════════════════════════ ║
║ 1 Design Logo 10 ₹500 18% ₹5,000 ║ ← Line item
║ 2 Revision Changes 5 ₹300 18% ₹1,500 ║
║ ║
║ [+ Add Item] ║ ← Add button
║ ║
║ ══════════════════════════════════════════════ ║
║ ║
║ Subtotal: ₹6,500 ║
║ CGST @9%: ₹585 ║
║ SGST @9%: ₹585 ║
║ Round Off: -₹0 ║
║ ─────────────────────────────── ║
║ Grand Total: ₹7,670 ║ ← Highlighted total
║ ║
║ [← Back] [Continue →] ║
╚══════════════════════════════════════════════════╝
```

### Step 3: Terms & Preview

```
╔══════════════════════════════════════════════════╗
║ ← Back New Invoice ║
╠══════════════════════════════════════════════════╣
║ ║
║ Step 3 of 3: Terms & Send ║
║ ████████████████████████ ║
║ ║
║ Invoice Number [INV-104 ] ║
║ Invoice Date [06 Sep 2026] ║
║ Due Date [06 Oct 2026] ║
║ Payment Terms [Net 30 days ▾] ║
║ ║
║ Your Bank Details (for payments) ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ Bank: HDFC Bank ║ ║
║ ║ Account: 50100XXXXX ║ ║
║ ║ IFSC: HDFC0001234 ║ ║
║ ║ Account Holder: Rajesh Graphics ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Notes / Terms ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [Thank you for your business! ] ║ ║
║ ║ [Payment due within 30 days. ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ │ ║ ← Preview
║ │ INVOICE PREVIEW │ ║
║ │ │ ║
║ │ Rajesh Graphics │ ║
║ │ 123 Main Street │ ║
║ │ │ ║
║ │ Bill To: Rajesh Kumar │ ║
║ │ │ ║
║ │ INV-104 Date: 06 Sep 2026 ║
║ │ │ ║
║ │ Items... Total: ₹7,670 │ ║
║ │ │ ║
║ │ [PAID / SENT / DRAFT badge] │ ║
║ │ │ ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ [💾 Save Draft] ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [✉️ Send Now] ║ ║
║ ╚════════════════════════════════════════════╝ ║
╚══════════════════════════════════════════════════╝
```

---

## 8. Invoice Detail

```
╔══════════════════════════════════════════════════╗
║ ← Invoice #104 [⋯] [📤] [✏️] ║
╠══════════════════════════════════════════════════╣
║ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ INVOICE 🟢 PAID ║
║ │ ║
║ │ Rajesh Graphics ║ ← From
║ │ 123 Main Street, Mumbai ║
║ │ GSTIN: 27AAPFU1234F1ZX ║
║ │ ║
║ │ Bill To: ║ ← Bill To
║ │ Rajesh Kumar ║
║ │ rajesh@email.com ║
║ │ ║
║ │ Invoice #: INV-104 ║
║ │ Date: 06 Sep 2026 ║
║ │ Due Date: 06 Oct 2026 ║
║ │ ║
║ │ ────────────────────────────────── ║
║ │ Item Qty Rate Amount ║
║ │ ────────────────────────────────── ║
║ │ Design 10 ₹500 ₹5,000 ║
║ │ Revision 5 ₹300 ₹1,500 ║
║ │ ║
║ │ Subtotal: ₹6,500 ║
║ │ CGST @9%: ₹585 ║
║ │ SGST @9%: ₹585 ║
║ │ Round Off: -₹0 ║
║ │ ║
║ │ ────────────────────────────────── ║
║ │ TOTAL: ₹7,670 ║ ← Highlighted
║ │ ║
║ │ Bank: HDFC ****1234 ║
║ │ UPI: rajesh.graphics@okaxis ║
║ │ ║
║ │ Notes: Thank you! ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ Payment Information ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ Status: 🟢 PAID ║
║ │ Paid on: 05 Oct 2026 ║
║ │ Method: UPI ║
║ │ Txn ID: 432567890123 ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ [📤 Send Again] [📥 Download PDF] [🗑️ Delete] ║
╚══════════════════════════════════════════════════╝
```

---

## 9. Expense List

```
╔══════════════════════════════════════════════════╗
║ ← Expenses [+ Add] [📷 Scan] ║
╠══════════════════════════════════════════════════╣
║ ║
║ September 2026 [◀] [▶] ║ ← Month selector
║ ║
║ Total: ₹12,800 ↑ 8% from last month ║
║ ║
║ 📊 Category Breakdown ║
║ ┌──────────┐ ┌──────────────────────────────┐ ║
║ │ [Donut] │ │ Supplies ████░ ₹4,500 ║ ← Chart
║ │ Chart ] │ │ Travel ██░ ₹3,200 ║
║ │ │ │ │ Software █░ ₹1,920 ║
║ │ │ │ │ Food █ ₹1,280 ║
║ │ │ │ │ Marketing █ ₹1,000 ║
║ └──────────┘ └──────────────────────────────┘ ║
║ ║
║ 💰 Budget Status ║
║ Office Supplies ████████░░ ₹8,000/₹10,000 ║ ← Progress
║ Travel ████████░░ ₹6,400/₹8,000 ║
║ Software ██████░░░░ ₹1,920/₹3,000 ║
║ ║
║ 🕐 Recent Expenses [See All] ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ 💸 Petrol ₹800 Cash Today ║ ← Expense card
║ │ Shell Station ║
║ ├──────────────────────────────────────────────┤ ║
║ │ 💸 Groceries ₹2,450 UPI 2d ago ║
║ │ BigBasket ║
║ ├──────────────────────────────────────────────┤ ║
║ │ 💸 Internet ₹1,200 Card 5d ago ║
║ │ Airtel Xtreme ║
║ ├──────────────────────────────────────────────┤ ║
║ │ 💸 Client Lunch ₹1,280 Cash 1w ago ║
║ │ Spice Kitchen ║
║ └──────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════╝
```

---

## 10. Expense Detail

```
╔══════════════════════════════════════════════════╗
║ ← Expense Detail [✏️] [🗑️] ║
╠══════════════════════════════════════════════════╣
║ ║
║ 💸 Petrol ║
║ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ [📷 Receipt Image] ║ ← Receipt
║ │ [View Full] [Replace] ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ Amount ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ ₹ 800 ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Category [Travel & Transport ▾] ║
║ ║
║ Date [06 Sep 2026 📅] ║
║ ║
║ Payment Method [Cash ▾] ║
║ ║
║ Notes ║
║ ╔════════════════════════════════════════════╗ ║
║ ║ [Shell Station, Western Expy ] ║ ║
║ ╚════════════════════════════════════════════╝ ║
║ ║
║ Recurring: [No] ║
║ ║
║ Created: 06 Sep 2026, 10:30 AM ║
║ Updated: 06 Sep 2026, 10:30 AM ║
║ ║
╚══════════════════════════════════════════════════╝
```

---

## 11. GST Reports Dashboard

```
╔══════════════════════════════════════════════════╗
║ ← GST Reports FY 2026-27 [Q2 ▾] ║
╠══════════════════════════════════════════════════╣
║ ║
║ ┌──────────┐ ┌──────────┐ ┌──────────┐ ║
║ │ Output │ │ Input │ │ Net GST │ ║ ← Summary cards
║ │ GST │ │ GST │ │ Payable │ ║
║ │ ₹52,400 │ │ ₹18,200 │ │ ₹34,200 │ ║
║ │ ↑ 12% │ │ ↑ 8% │ │ Due: │ ║
║ │ │ │ │ │ 20 Sep │ ║
║ └──────────┘ └──────────┘ └──────────┘ ║
║ ║
║ 📅 Compliance Calendar ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ Sep 2026 ║
║ │ 1 2 3 4 5 6 7 ║ ← Calendar
║ │ 8 9 10🔴11 12 13 14 ║ 🔴 = Due date
║ │ 15 16 17 18 19 20🔴21 22 ║ 🟢 = Filed
║ │ 23 24 25 26 27 28 29 30 ║ ⬜ = No data
║ └──────────────────────────────────────────────┘ ║
║ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ 📋 GSTR-1 — Outward Supplies ║
║ │ 24 invoices · ₹4,85,000 · Tax ₹87,300 ║
║ │ [Review & File →] ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ 📋 GSTR-3B — Return Summary ║
║ │ Tax Payable: ₹34,200 · ITC: ₹18,200 ║
║ │ [Review & File →] ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ 🧮 ITC — Input Tax Credit ║
║ │ Available: ₹18,200 · Claimed: ₹18,200 ║
║ │ [View Details →] ║
║ └──────────────────────────────────────────────┘ ║
║ ║
║ [📥 GSTR-1 JSON] [📥 GSTR-3B Excel] ║
║ [📊 Annual PDF] ║
╚══════════════════════════════════════════════════╝
```

---

## 12. Payments Dashboard

```
╔══════════════════════════════════════════════════╗
║ ← Payments ║
╠══════════════════════════════════════════════════╣
║ ║
║ ┌──────────┐ ┌──────────┐ ┌──────────┐ ║
║ │ Received │ │ Pending │ │ Overdue │ ║
║ │ ₹38,400 │ │ ₹12,600 │ │ ₹4,800 │ ║ ← Summary
║ └──────────┘ └──────────┘ └──────────┘ ║
║ ║
║ Payment Methods ║
║ ┌──────────┐ ┌──────────┐ ┌──────────┐ ║
║ │ 📱 UPI │ │ 🏦 Bank │ │ 💵 Cash │ ║
║ │ Show QR │ │ Details │ │ Received│ ║ ← Methods
║ └──────────┘ └──────────┘ └──────────┘ ║
║ ║
║ Record Payment ║
║ Select Invoice: [INV-104 — ₹7,670 ▾] ║
║ Payment Method: [UPI ▾] ║
║ Txn ID: [432567890123 ] ║
║ ║
║ [Mark as Paid] ║
║ ║
║ 💬 Reminders ║
║ 3 invoices due this week ║
║ ┌──────────────────────────────────────────────┐ ║
║ │ Remind Priya Sharma (INV-103) via WhatsApp │ ║
║ │ [Send Reminder] ║
║ ├──────────────────────────────────────────────┤ ║
║ │ Remind Amit Patel (INV-102) via WhatsApp │ ║
║ │ [Send Reminder] ║
║ ├──────────────────────────────────────────────┤ ║
║ │ Remind Sneha Gupta (INV-101) ║
║ │ Overdue by 22 days ║
║ │ [Send Urgent Reminder] ║
║ └──────────────────────────────────────────────┘ ║
╚══════════════════════════════════════════════════╝
```

---

## 13. Settings

```
╔══════════════════════════════════════════════════╗
║ ← Settings ║
╠══════════════════════════════════════════════════╣
║ ║
║ 👤 Profile ║
║ Rajesh Kumar ║
║ rajesh@email.com · +91 98765 43210 ║
║ [Edit Profile] ║
║ ═══════════════════════════════════════════════ ║
║ ║
║ 🏢 Business ║
║ Rajesh Graphics ║
║ GSTIN: 27AAPFU1234F1ZX ║
║ [Edit Business Details] ║
║ ═══════════════════════════════════════════════ ║
║ ║
║ 📄 Invoice Defaults ║
║ Prefix: INV- · Due: 30 days · GST: 18% ║
║ [Customize] ║
║ ═══════════════════════════════════════════════ ║
║ ║
║ 🔔 Notifications ║
║ Push: All ON ║
║ Email: Payments only ║
║ WhatsApp: ON ║
║ [Manage Notifications] ║
║ ═══════════════════════════════════════════════ ║
║ ║
║ 🌐 Preferences ║
║ Language: English ▾ ║
║ Theme: System ▾ (Light / Dark) ║
║ Date: DD/MM/YYYY ▾ ║
║ Number Format: Indian ▾ ║
║ ═══════════════════════════════════════════════ ║
║ ║
║ 📤 Data & Privacy ║
║ Export All Data ║
║ Backup & Restore ║
║ Delete Account ║
║ ═══════════════════════════════════════════════ ║
║ ║
║ 💳 Subscription ║
║ Current: Free Plan ║
║ Scans: 5/10 · Invoices: 2/5 ║
║ [Upgrade to Pro →] ║
║ ═══════════════════════════════════════════════ ║
║ ║
║ ❓ Support ║
║ FAQs · Contact Us · Rate App ║
║ ║
║ Khatabook AI v1.0.0 ║ ← Version
╚══════════════════════════════════════════════════╝
```

---

## Appendix: Desktop Wireframes (Key Pages)

### Desktop Invoice List (Table View)

```
╔══════════════════════════════════════════════════════════════════╗
║ ║
║ ╔════╦═══════════════════════════════════════════════════════════╗║
║ ║ Khat│ Invoices [+ New] [Export] 🔍 Filter ▾ ║║
║ � .AI │ ║║
║ ║ │ ║║
║ ║Home│ ┌──────────────────────────────────────────────────────────┐ ║║
║ ║Scan│ │ # │ Client │ Amount │ Date │ Due │ Status │ Actions │ ║║
║ ║Inv │ ├──────────────────────────────────────────────────────────┤ ║║
║ ║Exp │ │ INV-104 │ Rajesh │ ₹7,670 │ 06Sep│06Oct│ 🟢 Paid │ [⋯] │ ║║
║ ║GST │ │ INV-103 │ Priya │ ₹3,200 │ 05Sep│05Oct│ 🔵 Sent │ [⋯] │ ║║
║ ║Rep │ │ INV-102 │ Amit │ ₹12K │ 01Sep│01Oct│ 🟡 View │ [⋯] │ ║║
║ ║Set │ │ INV-101 │ Sneha │ ₹5,400 │ 15Aug│15Aug│ 🔴 O/due│ [⋯] │ ║║
║ ║ │ │ INV-100 │ New │ ₹8,000 │ - │ - │ ⚪ Draft│ [⋯] │ ║║
║ ╚════╩──────────────────────────────────────────────────────────┘ ║║
║ ║ ║║
╚══════════════════════════════════════════════════════════════════╝
║ ║
║ Showing 1-5 of 24 invoices │ Total: ₹36,270 ║
╚══════════════════════════════════════════════════════════════════╝
```

### Desktop Scanner (Split View)

```
╔══════════════════════════════════════════════════════════════════╗
║ ║
║ ╔════╦═══════════════════════════════════════════════════════════╗║
║ ║ Khat│ Scan Receipt ← Back ║║
║ � .AI │ ║║
║ ║ │ ╔═════════════════════════════════════╦═════════════════╗ ║║
║ ║ │ ║ ║ ║ ║║
║ ║Home│ ║ Camera View ║ │ Extracted Data ║ ║║
║ ║Scan│ ║ ║ │ ║ ║║
║ ║Inv │ ║ ║ │ Amount: ₹2,450 ║ ║║
║ ║Exp │ ║ ║ │ Vendor: BigBasket ║ ║║
║ ║GST │ ║ [📷 Capture] ║ │ Date: 06 Sep 2026 ║ ║║
║ ║Rep │ ║ ║ │ Category: [Groceries] ║ ║║
║ ║Set │ ║ ║ │ ║ ║║
║ ║ │ ║ ║ │ CGST: ₹78 │ ║║
║ ╚════╩ ║ ║ │ SGST: ₹78 │ ║║
║ ║ ║ │ ║ │ ║║
║ ║ ║ │ │ [💾 Save] ║║
║ ╚════╩═══════════════════════════╩═══════════════════════════╝ ║║
║ ║ ║║
╚══════════════════════════════════════════════════════════════════╝
║ ║
```

---

## Wireframe Conventions

### Legend
```
╔══════════╗ ← Screen border
║ Content ║ ← Section
╠══════════╣ ← Section divider
║ Input [ ]║ ← Text input field
║ [Button] ║ ← Button element
║ Label: ║ ← Text label
║ → ║ ← Navigation arrow
║ ← Back ║ ← Back button
║ 🔔(3) ║ ← Icon with badge count
║ 🟢/🔵/🟣/🔴/⚪ ║ ← Status indicators
║ [⋯] ║ ← More options (ellipsis)
║ [✓] ║ ← Checkbox
║ [◉] ║ ← Radio button
║ [▾] ║ ← Dropdown
║ 📅 ║ ← Date picker icon
║ 👁 ║ ← Visibility toggle
║ [📋] ║ ← Copy icon
║ [🗑️] ║ ← Delete icon
║ [✏️] ║ ← Edit icon
║ [📤] ║ ← Share icon
║ [📥] ║ ← Download icon
║ [📷] ║ ← Camera icon
║ [📱] ║ ← Mobile/WhatsApp icon
║ [🔄] ║ ← Refresh/retry
║ [⭐] ║ ← Featured/recommended
║ [🔴/🟢] ║ ← Status dot
║ ↑↓ ║ ← Trend arrows
║ ░/█ ║ ← Progress bar
║ ═══ ║ ← Divider line
║ ║ ← Empty space
```

### Screen States
```
Normal state = shown above
Loading state = replace content with [Spinner] or ████░░░░ blocks
Error state = show ⚠️ message with [Retry] button
Empty state = show 📭 icon + "No items yet" + CTA
Offline state = show 📴 banner at top
```
