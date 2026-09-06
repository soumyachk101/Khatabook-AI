# Khatabook AI — Frontend

> Next.js 14 client application — the web interface for Khatabook AI.

A modern, mobile-first web application built with Next.js 14 App Router that delivers the Khatabook AI experience: AI-powered receipt scanning, GST-compliant invoicing, expense tracking, and real-time financial dashboards for Indian freelancers and small businesses.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui |
| **State** | Zustand (client), TanStack Query (server) |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **i18n** | next-intl (English + Hindi) |
| **PDF** | @react-pdf/renderer |
| **Auth** | Clerk |
| **Payments** | Razorpay |
| **Monitoring** | Sentry |
| **Analytics** | PostHog |

## Prerequisites

- Node.js 20.x LTS
- npm 10.x
- Access to the parent monorepo's `shared/` package

## Local Development

### Install dependencies

From the **monorepo root**:

```bash
npm run install:all
```

### Configure environment

```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your values
```

### Start dev server

```bash
# From monorepo root (runs frontend + backend together)
npm run dev

# Or frontend only
npm run dev:frontend
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on `http://localhost:3000` |
| `npm run build` | Production build (standalone or via monorepo) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript validation (`tsc --noEmit`) |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run Playwright E2E tests |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values.

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Khatabook AI

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=https://...
```

See `.env.example` for the complete list with descriptions.

## Deployment

This app is deployed on **Vercel**. Configuration lives in `vercel.json`:

- **Region priority:** `bom1` (Mumbai) is first for low latency across India.
- **Crons:** `/api/cron/health-check` every 5 minutes; invoice reminders at 09:00 UTC daily.
- **Security headers:** HSTS, X-Frame-Options DENY, CSP, Permissions-Policy.
- **CORS:** Restricted to production origin + Vercel preview deployments.
- **Functions:** API routes get 30s timeout, 1024 MB memory; cron jobs 60s / 512 MB.

### Manual deploy

```bash
vercel --prod
```

### CI/CD deploy

Pushes to `main` automatically trigger a production deploy via GitHub Actions (`.github/workflows/deploy.yml`).

## Folder Structure

```
frontend/
├── src/
│ ├── app/ # App Router pages & layouts
│ │ ├── (auth)/ # Login, Signup, Forgot Password
│ │ ├── (dashboard)/ # Main app workspace
│ │ ├── api/ # Route handlers
│ │ │ ├── health/ # Health check endpoints
│ │ │ ├── cron/ # Scheduled tasks
│ │ │ └── webhooks/ # Razorpay, Clerk webhooks
│ │ ├── layout.tsx
│ │ └── page.tsx
│ ├── components/
│ │ ├── ui/ # shadcn/ui primitives
│ │ ├── layout/ # Sidebar, Navbar, DashboardShell
│ │ └── features/ # Receipt scanner, Invoice builder, etc.
│ ├── lib/
│ │ ├── monitoring/ # Sentry, analytics
│ │ ├── supabase/ # Supabase clients (server/client)
│ │ ├── api/ # API client helpers
│ │ └── utils/ # Date, currency, GST utilities
│ ├── hooks/ # Custom React hooks
│ ├── store/ # Zustand stores
│ ├── types/ # TypeScript types
│ └── styles/ # Global CSS, Tailwind layer
├── public/ # Static assets (favicon, logos)
├── middleware.ts # Clerk auth + Sentry instrumentation
├── next.config.mjs # Next.js config
├── tailwind.config.ts # Tailwind config
├── tsconfig.json
├── vercel.json # Vercel deployment config
└── package.json
```

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome / Edge (Chromium) | Last 2 versions |
| Firefox | 115+ |
| Safari (macOS) | 16.4+ |
| Safari (iOS) | 16.4+ |
| Samsung Internet | 21+ |

Internet Explorer 11 is not supported.

## Performance Budgets

- **LCP** < 2.5s
- **FID / INP** < 100ms / 200ms
- **CLS** < 0.1
- **Initial JS bundle** < 200 KB
- **Initial CSS** < 50 KB

## Testing

```bash
# Unit tests (Vitest + React Testing Library)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Coverage
npm run test -- --coverage
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Root README](../README.md) — full project documentation
- [TRD](../docs/TRD.md) — Technical Requirements Document
- [Backend Architecture](../docs/BACKEND_ARCHITECTURE.md)
