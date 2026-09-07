# Khatabook AI - Frontend

AI-powered accounting and invoicing platform for Indian MSMEs. Built with Next.js 14 App Router, TypeScript, Tailwind CSS.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts
- **QR Codes**: qrcode
- **Theme**: next-themes (dark mode support)

## Features

- 📊 Dashboard with balance, quick actions, charts
- 📷 AI Receipt Scanner (camera + upload)
- 🧾 GST-ready Invoice generation
- 💰 UPI Payment links & QR codes
- 🗂️ Expense tracking with categories
- 📋 GST returns (GSTR-1, GSTR-3B)
- 🔔 Payment reminders (WhatsApp/Email)
- 🇮🇳 Indian number formatting (1,00,000)
- 🌐 Hindi/English language toggle
- 🌙 Dark mode support

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/ # Next.js App Router pages
│ ├── (app)/ # Authenticated app routes
│ │ ├── dashboard/
│ │ ├── receipts/
│ │ ├── invoices/
│ │ ├── expenses/
│ │ ├── gst/
│ │ ├── payments/
│ │ ├── reminders/
│ │ └── settings/
│ ├── (auth)/ # Auth routes (login, signup)
│ ├── layout.tsx # Root layout
│ └── page.tsx # Landing page
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── layout/ # AppShell, Header, Sidebar, BottomNav
│ ├── dashboard/ # Dashboard widgets
│ ├── receipts/ # Receipt scanner & list
│ ├── invoices/ # Invoice CRUD
│ ├── expenses/ # Expense tracking
│ ├── gst/ # GST returns & reports
│ ├── payments/ # UPI payments & history
│ ├── reminders/ # Payment reminders
│ └── shared/ # Shared utilities
├── hooks/ # Custom React Query hooks
├── lib/
│ ├── api.ts # API client
│ ├── utils.ts # cn() helper
│ ├── format.ts # Indian number/date formatting
│ ├── store/ # Zustand stores
│ ├── types/ # TypeScript interfaces
│ └── validators/ # Zod schemas
```

## Design

- Primary: Indigo (#6366F1)
- Font: Inter (with Devanagari support)
- Mobile-first responsive design
- Dark mode support
