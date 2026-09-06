# =============================================================================
# Khatabook AI — Backend Dockerfile (Multi-stage)
# =============================================================================
# Optimized for Railway / Docker deployments.
# Three stages: deps (production dependencies), builder (compile TypeScript),
# and runner (minimal production image with non-root user).
# =============================================================================

# ---- Stage 1: Production Dependencies ----
FROM node:20-alpine AS deps
# Install required system dependencies
RUN apk add --no-cache \
 libc6-compat \
 libcrypto3 \
 libssl3 \
 && rm -rf /var/cache/apk/*
WORKDIR /app

# Copy lock files first for layer caching
COPY package.json package-lock.json* ./
# Install ONLY production dependencies
RUN npm ci --only=production --no-audit --no-fund && \
 npm cache clean --force

# ---- Stage 2: Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
# Install ALL dependencies (including devDependencies for TypeScript compilation)
RUN npm ci --no-audit --no-fund && npm cache clean --force
# Copy source code
COPY tsconfig.json ./
COPY src ./src
# Compile TypeScript to JavaScript
RUN npm run build && \
 npm run clean:build || true
# Prune devDependencies to keep the deps layer clean
RUN npm prune --production && npm cache clean --force

# ---- Stage 3: Production Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

# Production environment variables
ENV NODE_ENV=production
ENV TZ=Asia/Kolkata
ENV PORT=3001

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
 adduser --system --uid 1001 --ingroup nodejs nodejs

# Copy production node_modules from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
# Copy compiled output from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
# Copy package.json for metadata
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nodejs

# Expose the API port
EXPOSE 3001

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
 CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "dist/index.js"]
