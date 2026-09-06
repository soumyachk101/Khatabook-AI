# UI_UX_DESIGN.md — Design System & Page Layouts
## Khatabook AI

---

## Table of Contents
1. [Design Principles](#design-principles)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Iconography](#iconography)
6. [Motion & Animation](#motion--animation)
7. [Dark Mode](#dark-mode)
8. [Mobile-Responsive Strategy](#mobile-responsive-strategy)
9. [Landing Page Layout](#landing-page-layout)
10. [Dashboard Layout](#dashboard-layout)
11. [Receipt Scanner Layout](#receipt-scanner-layout)
12. [Invoice Pages Layout](#invoice-pages-layout)
13. [Expenses Pages Layout](#expenses-pages-layout)
14. [GST Reports Layout](#gst-reports-layout)
15. [Settings Layout](#settings-layout)
16. [Component Style Guide](#component-style-guide)

---

## Design Principles

### Core Values
| Principle | Application |
|-----------|-------------|
| **Indian First** | RTL support for Hindi, Devanagari numerals, Indian number formatting (1,00,000), UPI-first payments |
| **Trust & Safety** | Green confirmations for financial actions, clear error states, verification badges |
| **Speed** | One-tap actions, skeleton loaders, instant feedback on every tap |
| **Simplicity** | Progressive disclosure — show only what's needed, hide advanced options behind "More" |
| **Accessibility** | WCAG 2.1 AA contrast ratios, 44px min touch targets, screen reader labels |

### Design Language
- **Style**: Material Design 3 with Indian cultural warmth
- **Corners**: 12px cards, 8px inputs, 50% for chips/tags, full for FAB
- **Elevation**: 3-level shadow system (sm/md/lg)
- **Feedback**: Green = success, Amber = warning, Red = error, Blue = info

---

## Color System

### Brand Palette

```
PRIMARY (Indigo — Trust, Professionalism)
┌──────────────────────────────────────────┐
│ Primary 50: #EEF2FF ─ background tint │
│ Primary 100: #E0E7FF ─ hover states │
│ Primary 200: #C7D2FE ─ borders │
│ Primary 300: #A5B4FC ─ secondary elements │
│ Primary 400: #818CF8 ─ accent │
│ Primary 500: #6366F1 ─ ─ ─ ─ PRIMARY │
│ Primary 600: #4F46E5 ─ ─ ─ pressed │
│ Primary 700: #4338CA ─ dark variant │
│ Primary 800: #3730A3 ─ darker │
│ Primary 900: #312E81 ─ darkest │
└──────────────────────────────────────────┘

SECONDARY (Emerald — Growth, Money, Success)
┌──────────────────────────────────────────┐
│ Secondary 50: #ECFDF5 │
│ Secondary 100: #D1FAE5 │
│ Secondary 400: #34D399 │
│ Secondary 500: #10B981 ── SUCCESS │
│ Secondary 600: #059669 │
│ Secondary 700: #047857 │
└──────────────────────────────────────────┘

ACCENT (Amber — Alerts, GST, Highlights)
┌──────────────────────────────────────────┐
│ Accent 50: #FFFBEB │
│ Accent 100: #FEF3C7 │
│ Accent 400: #FBBF24 │
│ Accent 500: #F59E0B ── WARNING │
│ Accent 600: #D97706 │
└──────────────────────────────────────────┘

ERROR (Rose — Danger, Overdue)
┌──────────────────────────────────────────┐
│ Error 50: #FFF1F2 │
│ Error 100: #FFE4E6 │
│ Error 400: #FB7185 │
│ Error 500: #F43F5E ── ERROR │
│ Error 600: #E11D48 │
└──────────────────────────────────────────┘

NEUTRALS (Slate)
┌──────────────────────────────────────────┐
│ Gray 50: #F8FAFC ─ page background │
│ Gray 100: #F1F5F9 ─ card background │
│ Gray 200: #E2E8F0 ─ borders │
│ Gray 300: #CBD5E1 ─ dividers │
│ Gray 400: #94A3B8 ─ disabled text │
│ Gray 500: #64748B ─ secondary text │
│ Gray 600: #475569 ─ body text │
│ Gray 700: #334155 ─ headings │
│ Gray 800: #1E293B ─ ─ ─ ─ BODY DARK │
│ Gray 900: #0F172A ─ darkest text │
└──────────────────────────────────────────┘

SEMANTIC COLORS
┌────────────┬─────────────┬──────────────────────────┐
│ Status │ Color │ Usage │
├────────────┼─────────────┼──────────────────────────┤
│ Paid │ #10B981 │ Invoice paid, success │
│ Pending │ #6366F1 │ Invoice sent, awaiting │
│ Overdue │ #F43F5E │ Past due date │
│ Draft │ #94A3B8 │ Unsaved/unsent │
│ Processing │ #F59E0B │ AI scanning, uploading │
│ Income │ #10B981 │ Money in, green arrows │
│ Expense │ #F43F5E │ Money out, red arrows │
│ GST │ #6366F1 │ Tax related, purple │
│ Info │ #3B82F6 │ Informational messages │
└────────────┴─────────────┴──────────────────────────┘

GRADIENTS
┌──────────────────────────────────────────┐
│ Primary Gradient: │
│ linear-gradient(135deg, #6366F1, #8B5CF6) │
│ │
│ Success Gradient: │
│ linear-gradient(135deg, #10B981, #34D399) │
│ │
│ Hero Gradient: │
│ linear-gradient(135deg, #6366F1, #A855F7, #EC4899) │
│ │
│ Card Shine: │
│ linear-gradient(180deg, rgba(255,255,255,0.1), transparent) │
└──────────────────────────────────────────┘
```

### Dark Mode Colors

```
DARK MODE PALETTE
┌──────────────────────────────────────────┐
│ Background: #0F172A (Gray 900) │
│ Surface: #1E293B (Gray 800) │
│ Card: #1E293B (Gray 800) │
│ Elevated: #334155 (Gray 700) │
│ Border: #334155 (Gray 700) │
│ Text Primary: #F1F5F9 (Gray 100) │
│ Text Secondary: #94A3B8 (Gray 400) │
│ Text Tertiary: #64748B (Gray 500) │
│ │
│ Primary Dark: #818CF8 (Primary 400) │
│ Success Dark: #34D399 (Secondary 400) │
│ Warning Dark: #FBBF24 (Accent 400) │
│ Error Dark: #FB7185 (Error 400) │
└──────────────────────────────────────────┘
```

---

## Typography

### Font Stack

```css
/* Primary Font — Inter for Latin */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Devanagari Font — Noto Sans Devanagari for Hindi */
--font-devanagari: 'Noto Sans Devanagari', 'Inter', sans-serif;

/* Monospace for numbers/codes */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
```

### Type Scale

```
┌────────┬────────────┬────────┬───────────────────────┐
│ Name │ Size │ Weight │ Line Height │ Usage │
├────────┼────────────┼────────┼───────────────────────┤
│ Display│ 36px / 2.25rem │ 700 │ 1.2 │ Hero headings │
│ H1 │ 30px / 1.875rem│ 700 │ 1.3 │ Page titles │
│ H2 │ 24px / 1.5rem │ 600 │ 1.35│ Section titles │
│ H3 │ 20px / 1.25rem │ 600 │ 1.4 │ Card titles │
│ H4 │ 18px / 1.125rem│ 600 │ 1.5 │ Sub-headings │
│ H5 │ 16px / 1rem │ 600 │ 1.5 │ Label headings │
│ Body │ 14px / 0.875rem│ 400 │ 1.6 │ Body text (DEFAULT)│
│ Small │ 12px / 0.75rem │ 400 │ 1.5 │ Captions │
│ Tiny │ 10px / 0.625rem│ 400 │ 1.4 │ Overlines, badges │
└────────┴────────────┴────────┴───────────────────────┘

INDIAN NUMBER FORMATTING
• 1,00,000 (not 100,000)
• ₹ 1,25,400.50
• Uses Indian numbering system (lakh, crore)
• Font: JetBrains Mono for all monetary values
```

### Font Loading Strategy

```html
<!-- Google Fonts — preload critical -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?
 family=Inter:wght@400;500;600;700&
 family=Noto+Sans+Devanagari:wght@400;500;600;700&
 family=JetBrains+Mono:wght@400;500&
 display=swap" rel="stylesheet">
```

---

## Spacing & Layout

### Spacing Scale (8px base)

```
┌────┬───────┬─────────────────────────────────┐
│ 0 │ 0px │ None │
│ 1 │ 4px │ xs — tight padding │
│ 2 │ 8px │ sm — default gap │
│ 3 │ 12px │ md — card internal padding │
│ 4 │ 16px │ lg — section spacing │
│ 5 │ 20px │ xl — between major sections │
│ 6 │ 24px │ 2xl — card margins │
│ 8 │ 32px │ 3xl — screen edges │
│ 10 │ 40px │ 4xl — large gaps │
│ 12 │ 48px │ 5xl — hero spacing │
│ 16 │ 64px │ 6xl — page sections │
└────┴───────┴─────────────────────────────────┘
```

### Layout Grid

```
MOBILE (< 640px)
┌──────────────────┐
│ 16px padding │
│ │
│ Full-width cards │
│ Single column │
│ Bottom nav bar │
└──────────────────┘

TABLET (640px - 1024px)
┌──────────────────────┐
│ 24px padding │
│ │
│ 2-column grid │
│ Collapsible sidebar │
│ Bottom nav (compact) │
└──────────────────────┘

DESKTOP (> 1024px)
┌──────────────────────────────────────────┐
│ 240px sidebar │ 24px │ content area │ 24px │
│ │ │ │ │
│ │ │ max-width │ │
│ │ │ 1200px │ │
│ │ │ centered │ │
└──────────────────────────────────────────┘
```

### Breakpoints

```css
/* Mobile First Approach */
--bp-sm: 640px; /* Large phones / small tablets */
--bp-md: 768px; /* Tablets */
--bp-lg: 1024px; /* Small laptops / tablets landscape */
--bp-xl: 1280px; /* Desktops */
--bp-2xl: 1536px; /* Large desktops */

/* Container widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1200px;
```

### Touch Target Sizes

```
Minimum: 44x44px (iOS HIG, WCAG 2.5.5)
Recommended: 48x48px with 8px gap between targets

Primary CTA: Full width on mobile, auto on desktop
Secondary CTA: Full width on mobile, auto on desktop
Icon buttons: 44x44px minimum
Bottom nav: 56px height
FAB: 56x56px
List items: 48px minimum height
```

---

## Iconography

### Icon System
- **Library**: Lucide React (consistent stroke width, clean lines)
- **Size**: 20px default, 16px small, 24px large, 32px extra large
- **Weight**: 2px stroke, 1.5px for small icons
- **Color**: Inherits text color, overridable per context

### Core Icon Set

```
Navigation
 Home, Scan, Plus, FileText, BarChart3, User
 ChevronLeft, ChevronRight, Menu, X, Search, Bell

Actions
 Camera, Image, Upload, Download, Share2, Copy, Edit, Trash2
 Check, X, Plus, Minus, CheckCircle, XCircle, AlertCircle
 Send, Mail, MessageSquare, Phone

Finance
 IndianRupee, Wallet, CreditCard, Banknote, Receipt, TrendingUp
 TrendingDown, CircleDollarSign, Calculator

Business
 Building2, Users, ShoppingBag, Briefcase, FileSpreadsheet
 Printer, QrCode, Stamp

GST Specific
 FileCheck, FileX, Scale, BookOpen, CalendarClock

Status
 Clock, CheckCircle2, XCircle, AlertTriangle, HelpCircle
 Loader2 (spinning), RefreshCw
```

### Icon Usage Rules
- Primary actions: Filled icon + text label
- Secondary actions: Outline icon + text label
- Tertiary/icon-only: Outline icon in a circle/square
- Active tab: Filled icon
- Inactive tab: Outline icon
- Status indicators: 8px colored dot next to icon

---

## Motion & Animation

### Animation Principles
- **Purposeful**: Every animation communicates state change
- **Fast**: 150-300ms for micro-interactions, 300-500ms for transitions
- **Natural**: Ease-out for entrances, ease-in for exits
- **Respectful**: `prefers-reduced-motion` media query support

### Animation Tokens

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1); /* Material standard */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1); /* Entrance */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1); /* Exit */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce */

--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;
```

### Animation Catalog

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Button press | 150ms | ease-in | Tap |
| Card hover lift | 250ms | ease-out | Hover |
| Modal enter | 300ms | ease-out | Open |
| Modal exit | 200ms | ease-in | Close |
| Page slide | 300ms | ease-in-out | Navigation |
| Toast enter | 350ms | spring | Event |
| Toast exit | 250ms | ease-in | Dismiss |
| Skeleton shimmer | 1500ms | linear | Load |
| Progress bar | 500ms | ease-out | Update |
| FAB expand | 300ms | ease-out | Tap |
| List item stagger | 50ms per item | ease-out | Render |
| Number count-up | 800ms | ease-out | Data update |
| Checkmark draw | 400ms | ease-out | Success |
| Shake (error) | 400ms | ease-in-out | Validation error |
| Pull-to-refresh | 600ms | ease-out | Release |

---

## Dark Mode

### Dark Mode Implementation

```css
/* Automatic theme switching */
@media (prefers-color-scheme: dark) {
 :root:not([data-theme="light"]) {
 /* Dark mode variables applied */
 }
}

/* Manual override */
[data-theme="dark"] {
 /* Dark mode variables applied */
}

[data-theme="light"] {
 /* Light mode variables (explicit) */
}
```

### Dark Mode Design Rules

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Page background | `#F8FAFC` | `#0F172A` |
| Surface/Card | `#FFFFFF` | `#1E293B` |
| Elevated surface | `#FFFFFF` with shadow | `#334155` with subtle glow |
| Primary color | `#6366F1` | `#818CF8` (slightly lighter) |
| Border color | `#E2E8F0` | `#334155` |
| Text primary | `#0F172A` | `#F1F5F9` |
| Text secondary | `#64748B` | `#94A3B8` |
| Input background | `#FFFFFF` | `#1E293B` |
| Input border | `#E2E8F0` | `#334155` |
| Shadow | Dark shadows | Subtle glow (no heavy shadows) |
| Image treatment | Normal | Slight brightness increase (10%) |

### Dark Mode Transitions

```css
* {
 transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Only smooth-transition colors that support it */
.theme-transition {
 transition: background-color 0.3s ease, color 0.3s ease;
}
```

---

## Mobile-Responsive Strategy

### Responsive Philosophy
- **Mobile First**: Design for 375px, scale up
- **Progressive Enhancement**: Add features as screen grows
- **Touch First**: Every interaction designed for touch, works with mouse
- **Performance**: Lazy load below-fold content, optimize images

### Responsive Patterns

```
NAVIGATION
Mobile: Bottom tab bar (5 tabs + FAB)
Tablet: Bottom tab bar (5 tabs, compact)
Desktop: Sidebar (collapsible, 240px wide)

CARDS
Mobile: Full width, single column
Tablet: 2 columns
Desktop: 3 columns or sidebar + main

FORMS
Mobile: Full width inputs, stacked
Tablet: 2-column layout for short fields
Desktop: Max-width 600px, centered

TABLES
Mobile: Card view (each row = card)
Tablet: Condensed table with horizontal scroll
Desktop: Full table with sorting

MODALS
Mobile: Full screen bottom sheet
Tablet: Centered dialog (max-width 500px)
Desktop: Centered dialog (max-width 600px)
```

### Tablet Adaptations

```
┌─────────────────────────────────────────────┐
│ Sidebar │ Main Content Area │ Detail Panel │
│ (collaps.)│ (scrollable) │ (right drawer) │
│ │ │ │
│ Dashboard│ Charts & Lists │ Detail view │
│ Scan │ │ when item │
│ Invoice │ │ is selected │
│ Expense │ │ │
│ GST │ │ │
│ Reports │ │ │
│ Settings │ │ │
└─────────────────────────────────────────────┘
```

---

## Landing Page Layout

### Hero Section

```
┌──────────────────────────────────────────────────────────┐
│ │
│ │
│ 🧾 Khatabook AI │
│ │
│ The Smartest Way to │
│ Manage Your Business Money │
│ │
│ Track expenses · Scan receipts · │
│ Auto GST reports · Get paid faster │
│ │
│ ┌──────────────────────────────────────┐ │
│ │ 🚀 Start for Free [Arrow →] │ │
│ └──────────────────────────────────────┘ │
│ │
│ [📷 Try Demo] [▶ Watch How It Works (2:30)] │
│ │
│ [App Screenshot Mockup] │
│ Floating phone screens showing │
│ receipt scan → invoice → payment │
│ │
│ │
│ ⭐ 4.8/5 on Play Store │ 50K+ Businesses │ ₹500Cr+ │
└──────────────────────────────────────────────────────────┘
```

### Features Section

```
┌──────────────────────────────────────────────────────────┐
│ EVERYTHING YOU NEED TO RUN YOUR BUSINESS │
│ │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ 📷 │ │ 📄 │ │ 🧾 │ │
│ │ AI Receipt │ │ Smart │ │ Auto GST │ │
│ │ Scanner │ │ Invoices │ │ Reports │ │
│ │ │ │ │ │ │ │
│ │ Snap a │ │ Create & │ │ GSTR-1 & │ │
│ │ photo of │ │ send │ │ GSTR-3B │ │
│ │ any receipt│ │ invoices │ │ auto-filled│ │
│ │ │ │ in seconds │ │ │ │
│ │ • AI reads │ │ • WhatsApp │ │ • ITC │ │
│ │ all data │ │ share │ │ tracking │ │
│ │ • Auto │ │ • GST calc │ │ • Deadline │ │
│ │ categoriz│ │ • Payment │ │ alerts │ │
│ │ ation │ │ tracking │ │ │ │
│ │ │ │ │ │ │ │
│ │ [Try Now →] │ │ [Create →] │ │ [View →] │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │
│ ┌─────────────┐ │
│ │ 💰 │ │
│ │ Payments │ │
│ │ │ │
│ │ Track all │ │
│ │ payments │ │
│ │ │ │
│ │ • UPI QR │ │
│ │ codes │ │
│ │ • Auto │ │
│ │ reminders│ │
│ │ • Payment │ │
│ │ links │ │
│ │ │ │
│ │ [Learn →] │ │
│ └─────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### How It Works

```
┌──────────────────────────────────────────────────────────┐
│ HOW IT WORKS — 3 SIMPLE STEPS │
│ │
│ ┌────────┐ ┌────────┐ ┌────────┐ │
│ │ │ │ │ │ │ │
│ │ (1) │ │ (2) │ │ (3) │ │
│ │ │ │ │ │ │ │
│ │ 📷 │─────▶│ 🤖 │─────▶│ 💰 │ │
│ │ │ │ │ │ │ │
│ │ SNAP │ │ AI │ │ PAID │ │
│ │ │ │ DOES │ │ │ │
│ │ Take │ │ THE │ │ Get │ │
│ │ a pic │ │ MAGIC│ │ paid │ │
│ │ of │ │ │ │ fast │ │
│ │ your │ │ Auto- │ │ │ │
│ │ bill │ │ reads │ │ Share │ │
│ │ │ │ amount │ │ pay- │ │
│ │ │ │ vendor │ │ ment │ │
│ │ │ │ date │ │ links │ │
│ │ │ │ GST % │ │ via │ │
│ │ │ │ │ │ UPI/WA │ │
│ └────────┘ └────────┘ └────────┘ │
│ │
│ 2 sec capture 3 sec AI Instant payment │
└──────────────────────────────────────────────────────────┘
```

### Pricing Section

```
┌──────────────────────────────────────────────────────────┐
│ SIMPLE, TRANSPARENT PRICING │
│ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ FREE │ │ PRO ⭐ │ │ BUSINESS │ │
│ │ │ │ │ │ │ │
│ │ ₹0/month │ │ ₹149/month │ │ ₹399/month │ │
│ │ │ │ │ │ │ │
│ │ ✓ 10 scans │ │ ✓ Unlimited │ │ ✓ Unlimited │ │
│ │ /month │ │ scans │ │ scans │ │
│ │ ✓ 5 invoices │ │ ✓ Unlimited │ │ ✓ Unlimited │ │
│ │ /month │ │ invoices │ │ invoices │ │
│ │ ✓ Basic GST │ │ ✓ Advanced │ │ ✓ Advanced │ │
│ │ reports │ │ GST reports│ │ GST + CA │ │
│ │ ✓ Email │ │ ✓ WhatsApp │ │ support │ │
│ │ support │ │ support │ │ ✓ Multi-user │ │
│ │ │ │ ✓ Priority │ │ access │ │
│ │ │ │ support │ │ ✓ Custom │ │
│ │ │ │ ✓ No ads │ │ branding │ │
│ │ │ │ │ │ ✓ API access │ │
│ │ [Get Started]│ │ [Start Pro] │ │ [Contact] │ │
│ └──────────────┘ └──────────────┘ └──────────────┘ │
│ │
│ All plans include: 256-bit encryption, GST compliant, │
│ Indian number formatting, UPI integration │
└──────────────────────────────────────────────────────────┘
```

---

## Dashboard Layout

### Desktop Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌────────┐ │
│ │ Khat. │ Namaste, Rajesh 👋 🔔 (3) 👤 │
│ │ AI │ Rajesh Graphics · Freelancer │
│ │ ────── │ │
│ │ 🏠 Home│ │
│ │ 📷 Scan│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ 📄 Inv │ │ ₹45,200 │ │ ₹12,800 │ │ 3 Pending│ │ ₹3,240 │ │
│ │ 💸 Exp │ │ Income ↑ │ │ Expense ↓│ │ Invoices │ │ GST Due │ │
│ │ 🧾 GST │ │ +12% MoM │ │ +5% MoM │ │ Action → │ │ File Soon│ │
│ │ 📊 Rep │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│ │ ⚙️ Set │ │
│ └────────┘ ┌──────────────────────────┐ ┌──────────────────────┐ │
│ │ 📊 Income vs Expenses │ │ 📈 Category Spend │ │
│ │ ┌──────────────────────┐ │ │ │ │
│ │ │ ████████████████ │ │ │ Supplies ████ 45% │ │
│ │ │ ████████████ │ │ │ Travel ██ 25% │ │
│ │ │ ██████████ │ │ │ Software █ 15% │ │
│ │ │ ██████ │ │ │ Food █ 10% │ │
│ │ │ ███ │ │ │ Other █ 5% │ │
│ │ └──────────────────────┘ │ │ │ │
│ └──────────────────────────┘ └──────────────────────┘ │
│ ┌──────────────────────────────────────────────────┐ │
│ │ 🕐 Recent Activity [View All] │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ 📷 Receipt ₹2,400 BigBasket 2h ago │ │ │
│ │ │ 📄 Invoice #104 ₹7,670 Sent 5h ago │ │ │
│ │ │ 💸 Expense ₹800 Petrol 1d ago │ │ │
│ │ │ 📄 Invoice #103 ₹3,200 Paid 2d ago │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ └──────────────────────────────────────────────────┘ │
│ │
│ [📷 Scan] [📄 New Invoice] [💸 Add Expense] [🧾 GST Report] │
└──────────────────────────────────────────────────────────────────────┘
```

### Mobile Dashboard

```
┌──────────────────────────────┐
│ 🧾 Khatabook AI 🔔(3) 👤 │
├──────────────────────────────┤
│ Namaste, Rajesh 👋 │
│ Rajesh Graphics │
│ │
│ ┌──────┐ ┌──────┐ │
│ │₹45K │ │₹12K │ │
│ │Income│ │Expens│ │
│ ├──────┤ ├──────┤ │
│ │+12% │ │+5% │ │
│ └──────┘ └──────┘ │
│ [scroll right for more →] │
│ │
│ 📊 Income vs Expenses │
│ ┌──────────────────────┐ │
│ │ ████████████████ │ │
│ │ ████████████ │ │
│ │ ██████████ │ │
│ │ ██████ │ │
│ │ ███ │ │
│ └──────────────────────┘ │
│ │
│ 🕐 Recent Activity [See All] │
│ ┌──────────────────────────┐ │
│ │ 📷 ₹2,400 BigBasket 2h │ │
│ │ 📄 INV-104 ₹7,670 5h │ │
│ │ 💸 ₹800 Petrol 1d │ │
│ └──────────────────────────┘ │
│ │
│ ➕ Quick Actions │
│ [📷 Scan] [📄 Invoice] │
│ [💸 Expense] [🧾 GST] │
│ │
│ 🏠 📷 ➕ 📄 📊 👤 │
└──────────────────────────────┘
```

---

## Receipt Scanner Layout

### Camera View (Full Screen)

```
┌───────────────────────────────────────────────┐
│ 0% [⚡] [🔄] │
│ │
│ ┌───────────────────────┐ │
│ │ │ │
│ │ │ │
│ │ [Camera View] │ │
│ │ │ │
│ │ │ │
│ │ ╔═══════════════╗ │ │
│ │ ║ ║ │ │
│ │ ║ 📷 Frame ║ │ │
│ │ ║ Guide ║ │ │
│ │ ║ ║ │ │
│ │ ╚═══════════════╝ │ │
│ │ │ │
│ └───────────────────────┘ │
│ │
│ Align the receipt within the frame │
│ │
│ ┌──────────┐ │
│ │ 📷 │ ← 64x64 FAB │
│ │ Capture │ │
│ └──────────┘ │
│ │
│ [🖼️ Gallery] [Camera] │
└───────────────────────────────────────────────┘

Processing Screen:
┌───────────────────────────────────────────────┐
│ │
│ ┌─────────────┐ │
│ │ 🤖 │ │
│ │ [Spinner] │ │
│ │ │ │
│ │ Analyzing │ │
│ │ receipt... │ │
│ │ │ │
│ │ ████████░░ │ ← 80% progress │
│ └─────────────┘ │
│ │
│ Step 1: OCR ✅ │
│ Step 2: Extract data ⏳ │
│ Step 3: Categorizing... │
│ │
└───────────────────────────────────────────────┘
```

### Receipt Edit Form

```
┌───────────────────────────────────────────────┐
│ ← Back Receipt Details [🗑️] │
├───────────────────────────────────────────────┤
│ │
│ [Receipt Image Preview] │
│ ┌───────────────────────────────────────┐ │
│ │ 📷 [Thumbnail of captured receipt] │ │
│ └───────────────────────────────────────┘ │
│ │
│ Amount * ₹ [2,450 ] │
│ │
│ Vendor * [BigBasket ] │
│ │
│ Date [06 Sep 2026 📅] │
│ │
│ Category [Groceries ▾] │
│ │
│ Payment Mode [UPI ▾] │
│ │
│ Items (AI detected) │
│ ┌───────────────────────────────────────┐ │
│ │ Milk 2L ₹60 │ │
│ │ Bread ₹40 │ │
│ │ Eggs (12) ₹90 │ │
│ │ [Add/Edit Items] │ │
│ └───────────────────────────────────────┘ │
│ │
│ CGST (9%) ₹ [78 ] │
│ SGST (9%) ₹ [78 ] │
│ │
│ Notes [Optional notes...] │
│ │
│ [💾 Save as Expense] │
│ [📄 Convert to Invoice] │
│ [🔄 Scan Another] │
│ │
└───────────────────────────────────────────────┘
```

---

## Invoice Pages Layout

### Invoice List (Mobile)

```
┌──────────────────────────────┐
│ ← Invoices [+ New] 🔍 │
├──────────────────────────────┤
│ Filter: All ▼ │
│ │
│ ┌──────────────────────────┐ │
│ │ INV-104 PAID 🟢 │ │
│ │ Rajesh Kumar │ │
│ │ ₹7,670 · 06 Sep 2026 │ │
│ │ Paid on 05 Oct 2026 │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ INV-103 SENT 🔵 │ │
│ │ Priya Sharma │ │
│ │ ₹3,200 · 05 Sep 2026 │ │
│ │ Viewed 1 time · Due 5 Oct │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ INV-102 VIEWED 🟣 │ │
│ │ Amit Patel │ │
│ │ ₹12,000 · 01 Sep 2026 │ │
│ │ Viewed 3 times · Due 1 Oct│ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ INV-101 OVERDUE 🔴 │ │
│ │ Sneha Gupta │ │
│ │ ₹5,400 · 15 Aug 2026 │ │
│ │ 22 days overdue │ │
│ └──────────────────────────┘ │
│ ┌──────────────────────────┐ │
│ │ INV-100 DRAFT ⚪ │ │
│ │ New Client │ │
│ │ ₹8,000 · Not sent yet │ │
│ └──────────────────────────┘ │
│ │
│ Total: ₹36,270 │
│ Paid: ₹7,670 | Due: ₹28,600 │
└──────────────────────────────┘
```

### Invoice Detail View

```
┌───────────────────────────────────────────────┐
│ ← Invoice #104 [⋯] [📤] [✏️] │
├───────────────────────────────────────────────┤
│ │
│ ┌───────────────────────────────────────┐ │
│ │ INVOICE │ │
│ │ │ │
│ │ Rajesh Graphics │ │
│ │ 123 Main Street, Mumbai - 400001 │ │
│ │ GSTIN: 27AAPFU1234F1ZX │ │
│ │ │ │
│ │ Bill To: │ │
│ │ Rajesh Kumar │ │
│ │ rajesh@email.com │ │
│ │ GSTIN: 27XXXXXX1234X1ZX │ │
│ │ │ │
│ │ Invoice #: INV-104 │ │
│ │ Date: 06 Sep 2026 │ │
│ │ Due Date: 06 Oct 2026 │ │
│ │ │ │
│ │ ───────────────────────────── │ │
│ │ Item Qty Rate Amt │ │
│ │ ───────────────────────────── │ │
│ │ Logo Design 10 ₹500 ₹5,000 │ │
│ │ Revision 5 ₹300 ₹1,500 │ │
│ │ │ │
│ │ Subtotal: ₹6,500 │ │
│ │ CGST @9%: ₹585 │ │
│ │ SGST @9%: ₹585 │ │
│ │ Round Off: -₹0 │ │
│ │ ───────────────────────────── │ │
│ │ TOTAL: ₹7,670 │ │
│ │ │ │
│ │ [PAID ✅] │ │
│ │ │ │
│ │ Bank: HDFC ****1234 │ │
│ │ UPI: rajesh.graphics@okaxis │ │
│ │ │ │
│ │ Notes: Thank you! │ │
│ └───────────────────────────────────────┘ │
│ │
│ Payment Info │
│ ┌───────────────────────────────────────┐ │
│ │ Status: PAID │ │
│ │ Paid on: 05 Oct 2026 │ │
│ │ Method: UPI │ │
│ │ Txn ID: 432567890123 │ │
│ └───────────────────────────────────────┘ │
│ │
│ [📤 Send Again] [📥 Download PDF] [🗑️ Delete] │
└───────────────────────────────────────────────┘
```

---

## Expenses Pages Layout

### Expense Dashboard

```
┌───────────────────────────────────────────────┐
│ ← Expenses [+ Add] [📷 Scan] │
├───────────────────────────────────────────────┤
│ September 2026 [◀] [▶] │
│ │
│ Total: ₹12,800 │
│ ↑ 8% from last month │
│ │
│ 📊 Category Breakdown │
│ ┌──────────────┐ ┌──────────────────────────┐│
│ │ │ │ Supplies ████░ ₹4,500 ││
│ │ [Donut │ │ Travel ██░ ₹3,200 ││
│ │ Chart] │ │ Software █░ ₹1,920 ││
│ │ │ │ Food █ ₹1,280 ││
│ │ │ │ Marketing █ ₹1,000 ││
│ │ │ │ Other █░ ₹900 ││
│ └──────────────┘ └──────────────────────────┘│
│ │
│ 💰 Budget Status │
│ Office Supplies ████████░░ ₹8,000 / ₹10,000 │
│ Travel ████████░░ ₹6,400 / ₹8,000 │
│ Software ██████░░░░ ₹1,920 / ₹3,000 │
│ │
│ 🕐 Recent Expenses │
│ ┌───────────────────────────────────────────┐ │
│ │ 💸 Petrol ₹800 Cash Today │ │
│ │ Shell Station │ │
│ ├───────────────────────────────────────────┤ │
│ │ 💸 Groceries ₹2,450 UPI 2d ago │ │
│ │ BigBasket │ │
│ ├───────────────────────────────────────────┤ │
│ │ 💸 Internet ₹1,200 Card 5d ago │ │
│ │ Airtel Xtreme │ │
│ └───────────────────────────────────────────┘ │
│ │
│ [View All Expenses] │
└───────────────────────────────────────────────┘
```

### Expense Detail

```
┌───────────────────────────────────────────────┐
│ ← Expense Detail [✏️] [🗑️] [📷] │
├───────────────────────────────────────────────┤
│ │
│ 💸 Petrol │
│ │
│ Amount ₹ 800 │
│ Category Travel & Transport │
│ Date 06 Sep 2026 │
│ Payment Cash │
│ Notes Shell Station, Western Expy │
│ │
│ Receipt │
│ ┌───────────────────────────────────────┐ │
│ │ [Receipt image thumbnail] │ │
│ │ [View Full] [Replace] │ │
│ └───────────────────────────────────────┘ │
│ │
│ Recurring: No │
│ │
│ Created: 06 Sep 2026, 10:30 AM │
│ Updated: 06 Sep 2026, 10:30 AM │
└───────────────────────────────────────────────┘
```

---

## GST Reports Layout

```
┌───────────────────────────────────────────────┐
│ ← GST Reports FY 2026-27 [📅 Q2 ▾] │
├───────────────────────────────────────────────┤
│ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ Output │ │ Input │ │ Net GST │ │
│ │ GST │ │ GST │ │ Payable │ │
│ │₹52,400 │ │₹18,200 │ │₹34,200 │ │
│ │↑ 12% │ │↑ 8% │ │ Due: │ │
│ │ │ │ │ │20 Sep │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ │
│ 📅 Compliance Calendar │
│ ┌───────────────────────────────────────┐ │
│ │ Sep 2026 │ │
│ │ 1 2 3 4 5 6 7 │ │
│ │ 8 9 10🔴11 12 13 14 │ │
│ │ 15 16 17 18 19 20🔴21 22 │ │
│ │ 23 24 25 26 27 28 29 30 │ │
│ │ 🔴=Due 🟢=Filed ⬜=No data │ │
│ └───────────────────────────────────────┘ │
│ │
│ ┌───────────────────────────────────────┐ │
│ │ 📋 GSTR-1 — Outward Supplies │ │
│ │ 24 invoices · ₹4,85,000 · Tax ₹87,300 │ │
│ │ [Review & File →] │ │
│ └───────────────────────────────────────┘ │
│ │
│ ┌───────────────────────────────────────┐ │
│ │ 📋 GSTR-3B — Return Summary │ │
│ │ Tax Payable: ₹34,200 · ITC: ₹18,200 │ │
│ │ [Review & File →] │ │
│ └───────────────────────────────────────┘ │
│ │
│ ┌───────────────────────────────────────┐ │
│ │ 🧮 ITC — Input Tax Credit │ │
│ │ Available: ₹18,200 · Claimed: ₹18,200 │ │
│ │ [View Details →] │ │
│ └───────────────────────────────────────┘ │
│ │
│ [📥 Download GSTR-1 JSON] │
│ [📥 Download GSTR-3B Excel] │
│ [📊 Annual Summary PDF] │
└───────────────────────────────────────────────┘
```

---

## Settings Layout

```
┌───────────────────────────────────────────────┐
│ ← Settings │
├───────────────────────────────────────────────┤
│ 👤 Profile │
│ Rajesh Kumar │
│ rajesh@email.com · +91 98765 43210 │
│ [Edit Profile] │
├───────────────────────────────────────────────┤
│ 🏢 Business │
│ Rajesh Graphics │
│ GSTIN: 27AAPFU1234F1ZX │
│ [Edit Business Details] │
├───────────────────────────────────────────────┤
│ 📄 Invoice Defaults │
│ Prefix: INV- | Due: 30 days | GST: 18% │
│ [Customize] │
├───────────────────────────────────────────────┤
│ 🔔 Notifications │
│ Push: All ON | Email: Payments only │
│ WhatsApp: ON | SMS: OFF │
│ [Manage Notifications] │
├───────────────────────────────────────────────┤
│ 🌐 Preferences │
│ Language: English ▾ │
│ Theme: System ▾ (Light / Dark / Auto) │
│ Date: DD/MM/YYYY ▾ │
│ Number Format: Indian (1,00,000) ▾ │
├───────────────────────────────────────────────┤
│ 📤 Data & Privacy │
│ Export as CSV / Excel / PDF / JSON │
│ Backup & Restore │
│ Delete Account │
├───────────────────────────────────────────────┤
│ 💳 Subscription │
│ Current: Free Plan │
│ Scans: 5/10 used · Invoices: 2/5 used │
│ [Upgrade to Pro →] │
├───────────────────────────────────────────────┤
│ ❓ Support │
│ FAQs | Contact Us | Rate App | Privacy Policy │
│ Version 1.0.0 │
└───────────────────────────────────────────────┘
```

---

## Component Style Guide

### Buttons

```
PRIMARY BUTTON (Filled)
┌─────────────────────────────┐
│ [Icon] Action Text → │ ← 48px height, 16px radius
│ Blue-500 bg, White text │
│ Hover: Blue-600 │
│ Active: Blue-700 │
│ Disabled: Gray-300 bg │
└─────────────────────────────┘

SECONDARY BUTTON (Outlined)
┌─────────────────────────────┐
│ Action Text → │ ← 48px height, Blue border
│ Transparent bg, Blue text │
│ Hover: Blue-50 bg │
└─────────────────────────────┘

TERTIARY BUTTON (Text only)
 Action Text → ← 48px, no bg, Blue text
 Underline on hover ← 44px min touch target

FAB (Floating Action Button)
┌─────────┐
│ + │ ← 56x56, Primary-500, shadow-lg
│ (Scan) │ Round, + icon, bottom-right
└─────────┘ Elevates on scroll

GHOST BUTTON
┌─────────────┐ ← No border, no bg
│ Icon Only │ Icon + tooltip on hover
└─────────────┘ Gray-500 → Gray-700 on hover
```

### Cards

```
STANDARD CARD
┌─────────────────────────────────────┐
│ Title [Action] │ ← White bg, Gray-100 border
│ │ shadow-sm, 12px radius
│ Content text goes here. │ padding: 16px
│ │
│ [Footer action] │
└─────────────────────────────────────┘

STATS CARD
┌─────────────────────────────────────┐
│ Income ↑ +12% │ ← Colored top border (4px)
│ ₹ 45,200 │ Large number (24px, bold)
│ vs last month │ Trend indicator (green/red)
└─────────────────────────────────────┘

INTERACTIVE CARD
┌─────────────────────────────────────┐
│ 📷 Receipt ₹2,400 2h ago │ ← Hover: shadow-md, lift
│ BigBasket · Groceries │ Active: primary-50 bg
│ [View Details] │
└─────────────────────────────────────┘

GLASS CARD (Hero/Feature cards)
┌─────────────────────────────────────┐
│ │ ← Semi-transparent
│ blur(10px) backdrop │ White with 10% opacity
│ border: 1px solid rgba(255,255,255, 0.2)│
└─────────────────────────────────────┘
```

### Form Elements

```
TEXT INPUT
┌─────────────────────────────────────┐
│ Label * │
│ ┌─────────────────────────────────┐ │ ← 48px height, 12px radius
│ │ Placeholder text here [🔍] │ │ Gray-200 border → Blue on focus
│ └─────────────────────────────────┘ │ Label: 12px, Gray-500
│ Error message │ Error text: 12px, Red-500
└─────────────────────────────────────┘

TEXTAREA
┌─────────────────────────────────────┐
│ Notes │
│ ┌─────────────────────────────────┐ │
│ │ │ │ ← 4 rows min, auto-resize
│ │ │ │ Resize: vertical only
│ │ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

SELECT / DROPDOWN
┌─────────────────────────────────────┐
│ Category * [▼] │
│ ┌─────────────────────────────────┐ │ ← Same as input + chevron
│ │ Select category [▼] │ │ Options: 200ms slide down
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

CHECKBOX
┌─────────────────────────────────────┐
│ ☐ Enable notifications │ ← 20x20, rounded-md
│ 24px hit area │ Checked: primary-500 bg
└─────────────────────────────────────┘

RADIO
┌─────────────────────────────────────┐
│ ◉ Freelancer │ ← 20px circle
│ ○ Small Business │ Checked: primary-500 fill
│ ○ Both │ 24px hit area
└─────────────────────────────────────┘

TOGGLE SWITCH
┌─────────────────────────────────────┐
│ Notifications [═══○──] ON │ ← 44x24 track, 20px thumb
│ │ Track: Gray-200 → Primary-500
│ │ Thumb: White circle
└─────────────────────────────────────┘
```

### Lists & Tables

```
LIST ITEM
┌─────────────────────────────────────┐
│ 📷 BigBasket ₹2,400 → │ ← 48px min height, 16px padding
│ Groceries · 2 hours ago │ Leading: Icon 40x40
│ │ Trailing: Chevron (optional)
└─────────────────────────────────────┘

SECTION LIST (iOS-style grouped)
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │ 👤 Profile [→] │ │ ← 16px corner radius
│ │ 🏢 Business [→] │ │ Card background, dividers
│ │ 📄 Invoice Defaults [→] │ │
│ └─────────────────────────────────┘ │
│ │
│ ┌─────────────────────────────────┐ │
│ │ 🔔 Notifications [→] │ │
│ │ 🌐 Preferences [→] │ │
│ │ 📤 Data & Privacy [→] │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Status Badges & Chips

```
STATUS BADGES
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ PAID │ │ SENT │ │ VIEWED │ │ DRAFT │
│ 🟢 │ │ 🔵 │ │ 🟣 │ │ ⚪ │
└────────┘ └────────┘ └────────┘ └────────┘
 Green bg Blue bg Purple bg Gray bg
 Green text Blue text Purple text Gray text

GST CHIPS
┌──────────┐ ┌──────────┐ ┌──────────┐
│ CGST 9% │ │ SGST 9% │ │ IGST 18% │
│ ₿ Purple │ │ 💜 Purple │ │ 🟣 Purple │
└──────────┘ └──────────┘ └──────────┘

CATEGORY CHIPS
┌──────────┐ ┌──────────┐ ┌──────────┐
│ 📁 Office │ │ 🚗 Travel │ │ 💻 Soft │
│ Gray bg │ │ Blue bg │ │ Purple bg │
└──────────┘ └──────────┘ └──────────┘
```

### Toast & Alert Components

```
SUCCESS TOAST
┌─────────────────────────────────────┐
│ ✅ Invoice sent successfully! │ ← Slide in from top
│ [Close ×] │ Green left border
└─────────────────────────────────────┘ Auto-dismiss after 4s

ERROR TOAST
┌─────────────────────────────────────┐
│ ⚠️ Failed to process receipt │ ← Red left border
│ [Retry] [Dismiss] │ Action buttons
└─────────────────────────────────────┘

ALERT DIALOG
┌─────────────────────────────────────┐
│ ⚠️ Confirm Delete │
│ │
│ Are you sure you want to delete │ ← Centered, 400px max
│ this invoice? This action cannot │ Scrim behind
│ be undone. │
│ │
│ [Cancel] [Delete] │
└─────────────────────────────────────┘

SNACKBAR (Bottom)
┌─────────────────────────────────────┐
│ ✅ Saved [Undo] │ ← Slide up from bottom
└─────────────────────────────────────┘ 600px max width, centered
```

### Loading States

```
SKELETON LOADER
┌─────────────────────────────────────┐
│ ██████████░░░░░░░░░░ │ ← Shimmer animation
│ ███████░░░░░░░░░░░░░░ │ 1500ms cycle
│ ██████████████░░░░░ │ Pulse effect
│ █████████████████░ │
└─────────────────────────────────────┘

SPINNER
┌─────────┐
│ ╱╲ │ ← 24px, Primary-500
│ ╱ ╲ │ 800ms rotation
│ ╲ ╱ │ Centered
│ ╲╱╲ │
│ ╲╱ │
└─────────┘

PROGRESS BAR
██████████████████████████░░░░░░ 75% ← 4px height, rounded-full
```

### Empty States

```
EMPTY STATE
┌─────────────────────────────────────┐
│ │
│ 📭 │ ← 64px icon
│ │
│ No receipts yet │ ← H3 heading
│ │
│ Scan your first receipt to get │ ← Body text
│ started with expense tracking │
│ │
│ [📷 Scan First Receipt] │ ← Primary CTA
│ │
└─────────────────────────────────────┘

ZERO STATE (GST)
┌─────────────────────────────────────┐
│ │
│ 🧾 │
│ │
│ No GST data available │
│ │
│ Create invoices with GST to │
│ see your reports here │
│ │
│ [📄 Create First Invoice] │
│ │
└─────────────────────────────────────┘
```

---

## Accessibility Checklist

- [ ] All interactive elements: 44x44px min touch target
- [ ] Color contrast: 4.5:1 for text, 3:1 for UI components
- [ ] Focus indicators: 2px outline, 2px offset, primary color
- [ ] Alt text for all images and icons with meaning
- [ ] Screen reader labels for all icon-only buttons
- [ ] Form labels properly associated with inputs
- [ ] Error messages linked to form fields via `aria-describedby`
- [ ] Semantic HTML (header, nav, main, section, article)
- [ ] Keyboard navigation: Tab order follows visual order
- [ ] `prefers-reduced-motion` respected
- [ ] `prefers-contrast` high mode supported
- [ ] Zoom up to 200% without content loss
- [ ] Hindi/regional language font rendering tested
- [ ] Indian number format screen-reader friendly
