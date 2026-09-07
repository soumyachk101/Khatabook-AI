# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build deps for native modules (sharp, bcrypt, etc.)
RUN apk add --no-cache \
 python3 \
 make \
 g++ \
 vips-dev

WORKDIR /app

# Cache node_modules layer
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
FROM node:20-alpine

# Add non-root user
RUN addgroup -g 1001 -S appgroup && \
 adduser -u 1001 -S appuser -G appgroup

# Install runtime deps only
RUN apk add --no-cache \
 dumb-init \
 vips \
 curl

WORKDIR /app

# Copy production node_modules + compiled output from builder
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

# Create a non-root user to run the app
USER appuser

# Expose the port Fastify listens on
EXPOSE 3004

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
 CMD node -e "require('http').get('http://127.0.0.1:3004/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })" || exit 1

# Use dumb-init so signals propagate to the Node process
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Run with optimised Node flags for production
CMD ["node", "--max-old-space-size=512", "dist/server.js"]
