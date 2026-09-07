# Khatabook-AI Deployment Configuration

## Deploy on Vercel (Frontend)

1. Connect the GitHub repo in Vercel dashboard.
2. Framework: Next.js, Root directory: `frontend/`, Build command: `npm run build -w frontend`.
3. Add Environment Variables (see below).

## Deploy Backend on Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Launch (creates fly.toml automatically)
cd backend
fly launch --no-deploy

# Set secrets
fly secrets set DATABASE_URL="postgres://..." REDIS_URL="redis://..." \
 OPENAI_API_KEY="..." JWT_SECRET="..." \
 TWILIO_ACCOUNT_SID="..." TWILIO_AUTH_TOKEN="..." \
 SUPABASE_URL="..." SUPABASE_ANON_KEY="..." SUPABASE_SERVICE_ROLE_KEY="..."

# Deploy
fly deploy

# Run migrations
fly ssh console -C "npx prisma migrate deploy"

# Attach volume for persistent storage
fly volumes create khatabook_data --size 1
```

## Deploy on Railway (Alternative)

1. Connect repo → select `backend/` as root.
2. Add PostgreSQL and Redis plugins.
3. Set environment variables (see below).
4. Deploy.

## Local Development with Docker

```bash
# 1. Copy env file
cp backend/.env.example backend/.env
# Edit with your actual keys

# 2. Start all services
docker compose -f backend/docker-compose.yml up -d

# 3. Run migrations
cd backend && npx prisma migrate deploy

# 4. Seed demo data
cd backend && npx tsx prisma/seed.ts

# 5. View logs
docker compose -f backend/docker-compose.yml logs -f app

# 6. Stop
docker compose -f backend/docker-compose.yml down -v
```

## Environment Variables

### Required for All Deployments

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `NODE_ENV` | `production` / `development` / `test` |

### Payment (Razorpay)

| Variable | Description |
|----------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

### WhatsApp (Twilio)

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sender number |

### Storage (Supabase)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

## Running Migrations

```bash
# Development: create new migration
cd backend && npx prisma migrate dev --name description

# Production: apply pending migrations
cd backend && npx prisma migrate deploy

# Or use the bundled script
cd backend && npx tsx scripts/migrate.ts
```

## Seeding Data

```bash
cd backend && npx tsx scripts/seed.ts
```

This creates a demo user (`demo@khatabook.ai` / `password123`) with a sample business, income/expense categories, and demo receipts.

## CI/CD

On every push to `main` or `develop`, the GitHub Actions pipeline runs:
1. **Lint** — ESLint + Prettier check
2. **Typecheck** — TypeScript compilation check
3. **Build** — Full build verification
4. **Unit Tests** — Backend tests with PostgreSQL + Redis
5. **Security Audit** — `npm audit` across all workspaces
6. **E2E Tests** — Playwright tests on the built frontend

## Nginx Reverse Proxy (Self-Hosted)

```bash
# Copy config
sudo cp nginx.conf /etc/nginx/nginx.conf

# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```
