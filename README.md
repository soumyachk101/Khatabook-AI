# Khatabook AI

> **AI-Powered Financial Operating System for Indian Freelancers & SMBs**
>
> Automated receipt OCR, intelligent expense categorization, real-time GST reconciliation (GSTR-1 & GSTR-3B), compliant invoicing, and cash flow analytics.

---

## Project Overview

Khatabook AI is a production-grade web application that helps Indian freelancers and small businesses manage their finances with AI-powered tools. Users can snap or upload receipt images, automatically extract structured data using OpenAI GPT-4o Vision (with Tesseract.js fallback), create GST-compliant invoices, track payments via Razorpay, and generate financial reports — all from a single, fast, mobile-first interface.

### Key Features

- **AI Receipt Scanning** — GPT-4o Vision + Tesseract.js fallback for reliable OCR on Indian receipt formats
- **GST Compliance** — Automatic CGST/SGST/IGST extraction, HSN/SAC code suggestions
- **Invoice Management** — Create, send, track invoices with PDF generation
- **Expense Tracking** — Categorized expenses with AI auto-categorization
- **Payment Integration** — Razorpay UPI, cards, net banking, subscriptions
- **GST Reports** — GSTR-1 and GSTR-3B ready summaries
- **Multi-language** — English + Hindi UI (extensible)

---

## Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS 3.4 + shadcn/ui |
| State | Zustand + TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| i18n | next-intl |
| Deploy | Vercel |

### Backend

| Layer | Technology |
|-------|-----------|
| API | Next.js Route Handlers |
| AI/OCR | OpenAI GPT-4o + Tesseract.js fallback |
| Queue | BullMQ + Redis (Upstash) |
| Database | Supabase PostgreSQL 15+ |
| Auth | Clerk |
| Payments | Razorpay |
| Email | Resend |
| Deploy | Railway |

### DevOps

| Tool | Purpose |
|------|---------|
| CI/CD | GitHub Actions |
| Monitoring | Sentry + Vercel Analytics |
| Hosting | Vercel (frontend) + Railway (backend) |
| Database | Supabase Cloud (PostgreSQL + Storage) |
| Cache/Queue | Upstash Redis |

---

## Local Development Setup

### Prerequisites

- **Node.js** 20.x LTS
- **npm** 10.x
- **Git** 2.40+
- **Docker Desktop** 24.x (for local PostgreSQL + Redis)
- **OpenAI API Key** (for OCR testing)
- **Supabase account** (local or cloud)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/Khatabook-AI.git
cd Khatabook-AI

# 2. Install all dependencies
npm run install:all

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and Supabase credentials

# 4. Start local services (PostgreSQL + Redis)
cd backend
docker compose up -d

# 5. Run the application
cd ..
npm run dev
# Frontend: http://localhost:3000
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend in development mode |
| `npm run dev:frontend` | Start Next.js frontend only |
| `npm run dev:backend` | Typecheck backend |
| `npm run build` | Build all workspaces for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript validation across all workspaces |
| `npm run test` | Run backend unit tests |

### Environment Variables

See individual `.env.example` files:

- **Root `.env.example`** — shared variables used by both frontend and backend
- **`frontend/.env.example`** — frontend-only (Clerk, Sentry, PostHog, public keys)
- **`backend/.env.example`** — backend-only (Supabase service keys, OpenAI, Twilio, Resend)

**Required for full local development:**

```env
# Supabase (local or cloud instance)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI (OCR)
OPENAI_API_KEY=sk-...

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Razorpay (Payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

---

## Deployment

### Frontend — Vercel

The Next.js frontend is deployed on **Vercel** with automatic deployments on push to `main`.

**Setup:**

1. Import the repository in [Vercel Dashboard](https://vercel.com/new)
2. Set **Root Directory** to `frontend`
3. Configure environment variables in Vercel project settings (same as `frontend/.env.example`)
4. Vercel auto-detects Next.js and configures build settings

**Manual deploy:**

```bash
vercel --prod
```

### Backend — Railway

The backend API is deployed on **Railway** using the included Dockerfile.

**Setup:**

1. Create a new project in [Railway Dashboard](https://railway.app)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Railway detects `railway.json` and `Dockerfile`
5. Add environment variables from `backend/.env.example`
6. Add PostgreSQL and Redis plugins (or connect to external Supabase/Upstash)

**Manual deploy:**

```bash
railway up --service backend
```

### Infrastructure

```
┌──────────────┐ ┌─────────────┐ ┌─────────────────┐
│ Vercel Edge │ │ Railway │ │ Supabase Cloud │
│ │ │ │ │
│ Next.js 14 │ │ Node.js API │ │ PostgreSQL 15+ │
│ (Frontend) │ │ (Backend) │ │ Storage │
│ │ │ │ │ Auth │
│ CDN + SSR │ │ BullMQ │ │ Realtime │
│ │ │ │ │
│ Port 443 │ │ Port 3001 │ │ Port 5432 │
└──────────────┘ └─────────────┘ └─────────────────┘
 │ │ │
 │ Redis (Upstash)
 │ Cache + Queue
 ▼
┌──────────────────────┐
│ External APIs │
│ OpenAI GPT-4o │
│ Razorpay │
│ Resend │
│ Clerk │
└──────────────────────┘
```

### CI/CD

GitHub Actions run automatically:

- **PR / Push to `develop`** — Lint, typecheck, build, unit tests (CI)
- **Push to `main`** — Full CI + deploy frontend to Vercel + deploy backend to Railway

See `.github/workflows/ci.yml` and `.github/workflows/deploy.yml`.

---

## Monitoring

### Sentry (Error Tracking)

- **Frontend** — [`frontend/src/lib/monitoring/sentry.ts`](frontend/src/lib/monitoring/sentry.ts)
 - Performance traces (10% sample rate in production)
 - Session replay on errors
 - Release tracking

- **Backend** — [`backend/src/monitoring/sentry.ts`](backend/src/monitoring/sentry.ts)
 - Error tracking with breadcrumbs
 - PII redaction middleware
 - Tagged transactions

### Logging

- **Backend** — [`backend/src/monitoring/logger.ts`](backend/src/monitoring/logger.ts)
 - Winston with structured JSON output
 - Separate log files: `combined.log`, `error.log`, `exceptions.log`
 - PII redaction on sensitive fields

### Vercel Analytics

- Web vitals (LCP, FID, CLS)
- Real user metrics
- Edge function performance

---

## Contributing

1. Create a feature branch from `develop`:
 ```bash
 git checkout develop
 git checkout -b feature/your-feature-name
 ```

2. Make your changes and ensure CI passes:
 ```bash
 npm run lint && npm run typecheck && npm run build
 ```

3. Commit with a descriptive message:
 ```bash
 git commit -m "feat: add receipt rescan endpoint"
 ```

4. Push and open a Pull Request against `develop`

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance, dependencies, build |

---

## Project Structure

```
Khatabook-AI/
├── .github/workflows/ # CI/CD pipelines
├── docs/ # Documentation (PRD, TRD, API spec, DB schema)
├── frontend/ # Next.js 14 app
│ ├── src/
│ │ ├── app/ # App Router
│ │ ├── components/ # UI + feature components
│ │ ├── store/ # Zustand state
│ │ ├── lib/ # Utilities, Supabase client
│ │ └── types/ # TypeScript types
│ ├── public/ # Static assets
│ ├── vercel.json # Vercel deployment config
│ └── package.json
├── backend/ # Node.js API service
│ ├── src/
│ │ ├── api/ # Route handlers
│ │ ├── services/ # Business logic
│ │ ├── lib/ # SDK clients (Supabase, OpenAI, Razorpay)
│ │ ├── middleware/ # Auth, error handling
│ │ ├── schemas/ # Zod validation
│ │ ├── monitoring/ # Sentry, Winston logger
│ │ └── types/ # Backend types
│ ├── Dockerfile
│ ├── docker-compose.yml # Local dev (Postgres + Redis + App)
│ └── railway.json # Railway deployment config
├── shared/ # Shared types & constants
├── package.json # Root monorepo config
├── .env.example # Root env template
└── README.md # This file
```

---

## License

Proprietary — All rights reserved.

---

## Support

- **Documentation:** See `docs/` folder for full specifications
- **Issues:** Report bugs and request features via GitHub Issues
- **Security:** Report vulnerabilities to security@khatabook.ai
