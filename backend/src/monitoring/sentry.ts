/**
 * =============================================================================
 * Khatabook AI — Backend Sentry Configuration
 * =============================================================================
 * Node.js error tracking, performance monitoring, and breadcrumb collection
 * for the Khatabook AI backend API service.
 *
 * Usage:
 * 1. Install: `npm install @sentry/node`
 * 2. Import: `import './monitoring/sentry';` at the top of `src/index.ts`
 * 3. Set `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ENVIRONMENT` env vars
 *
 * Features:
 * - Automatic error capture for unhandled exceptions
 * - Performance tracing for HTTP requests and DB queries
 * - Breadcrumb tracking across async boundaries
 * - PII redaction (PAN, Aadhaar, GSTIN, full card numbers)
 * - Tagged transactions for service-level aggregation
 * =============================================================================
 */

import * as Sentry from '@sentry/node';
import type { NodeOptions } from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const SENTRY_DSN = process.env.SENTRY_DSN;
const ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development';
const RELEASE = process.env.RAILWAY_GIT_COMMIT_SHA ||
 process.env.VERCEL_GIT_COMMIT_SHA ||
 process.env.npm_package_version ||
 'development';

/**
 * PII fields that must never leave the application.
 * Applied automatically via `beforeSend` and `beforeBreadcrumb`.
 */
const SENSITIVE_FIELDS = [
 'password',
 'token',
 'api_key',
 'apikey',
 'api-key',
 'secret',
 'authorization',
 'cookie',
 'session',
 'pan',
 'aadhaar',
 'aadhar',
 'gstin',
 'gst_number',
 'credit_card',
 'card_number',
 'cvv',
 'ssn',
 'pin',
 'otp',
];

const REDACTED = '[REDACTED]';

/**
 * Recursively redact sensitive fields from an object.
 */
function redactObject(obj: unknown): unknown {
 if (obj === null || obj === undefined) return obj;
 if (typeof obj !== 'object') return obj;
 if (Array.isArray(obj)) return obj.map(redactObject);

 const result: Record<string, unknown> = {};
 for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
 const lowerKey = key.toLowerCase();
 const isSensitive = SENSITIVE_FIELDS.some((field) => lowerKey.includes(field));

 if (isSensitive) {
 result[key] = typeof value === 'string' ? REDACTED : REDACTED;
 } else if (typeof value === 'object' && value !== null) {
 result[key] = redactObject(value);
 } else {
 result[key] = value;
 }
 }
 return result;
}

/**
 * Build the Sentry options for the backend service.
 */
export function buildSentryOptions(): NodeOptions {
 return {
 dsn: SENTRY_DSN,
 environment: ENVIRONMENT,
 release: RELEASE,
 serverName: process.env.RAILWAY_SERVICE_NAME || process.env.HOSTNAME || 'khatabook-backend',

 // ── Performance Monitoring ────────────────────────────────────────────
 tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
 profilesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,

 // ── Privacy: don't send PII by default ────────────────────────────────
 sendDefaultPii: false,

 // ── Filtering & Privacy ───────────────────────────────────────────────
 beforeSend(event) {
 // Redact any user data we might have collected
 if (event.user) {
 event.user = {
 id: event.user.id,
 };
 }
 if (event.request?.cookies) {
 delete event.request.cookies;
 }
 if (event.request?.headers) {
 const headers = { ...event.request.headers } as Record<string, string>;
 delete headers.authorization;
 delete headers.cookie;
 event.request.headers = headers;
 }
 // Redact sensitive data in breadcrumbs
 if (event.breadcrumbs) {
 event.breadcrumbs = event.breadcrumbs.map((bc) => ({
 ...bc,
 data: redactObject(bc.data) as Record<string, unknown>,
 }));
 }
 // Redact extra data
 if (event.extra) {
 event.extra = redactObject(event.extra) as Record<string, unknown>;
 }
 return event;
 },

 beforeBreadcrumb(breadcrumb) {
 if (breadcrumb.data) {
 breadcrumb.data = redactObject(breadcrumb.data) as Record<string, unknown>;
 }
 return breadcrumb;
 },

 // ── Ignore noisy errors ───────────────────────────────────────────────
 ignoreErrors: [
 // Network timeouts from upstream services
 'ECONNRESET',
 'ETIMEDOUT',
 'ENOTFOUND',
 // Database transient errors
 'Connection terminated',
 // User-cancelled requests
 'AbortError',
 // Rate limit responses
 '429',
 ],

 // ── Sampling for high-volume endpoints ─────────────────────────────────
 tracesSampler: (samplingContext) => {
 // Always sample health checks at low rate
 if (samplingContext.request?.url?.includes('/api/health')) {
 return 0.01;
 }
 // Sample OCR endpoints less aggressively (expensive operations)
 if (samplingContext.request?.url?.includes('/api/ocr/')) {
 return ENVIRONMENT === 'production' ? 0.05 : 1.0;
 }
 // Default sampling rate
 return ENVIRONMENT === 'production' ? 0.1 : 1.0;
 },

 // ── Integrations ──────────────────────────────────────────────────────
 integrations: [
 // HTTP request tracing
 new Sentry.Integrations.Http({ tracing: true }),
 // Express request handling tracing
 new Sentry.Integrations.Express(),
 // PostgreSQL query tracing
 new Sentry.Integrations.Postgres(),
 // Local variables in stack traces (debugging aid)
 new Sentry.Integrations.LocalVariables({
 captureAllExceptions: false,
 }),
 // Node.js profiling (CPU/memory)
 ...(process.env.NODE_ENV === 'production'
 ? [nodeProfilingIntegration()]
 : []),
 ],

 // ── Initial scope ────────────────────────────────────────────────────
 initialScope: {
 tags: {
 component: 'backend',
 runtime: 'node',
 service: 'api',
 },
 },

 // ── Release Health ──────────────────────────────────────────────────
 autoSessionTracking: true,

 // ── Attach stacktraces ──────────────────────────────────────────────
 attachStacktrace: true,

 // ── Max breadcrumbs ─────────────────────────────────────────────────
 maxBreadcrumbs: 100,
 };
}

/**
 * Initialize Sentry as the very first thing in the application.
 * This must be called before any other imports in `src/index.ts`.
 */
export function initSentry(): void {
 if (!SENTRY_DSN) {
 console.warn('[Sentry] SENTRY_DSN not configured — error tracking disabled.');
 return;
 }

 Sentry.init(buildSentryOptions());
}

/**
 * Custom error reporter for backend exceptions with business context.
 */
export function reportError(error: Error, context?: Record<string, unknown>): void {
 Sentry.withScope((scope) => {
 if (context) {
 // Redact PII before setting as tags
 const safeContext = redactObject(context) as Record<string, unknown>;
 Object.entries(safeContext).forEach(([key, value]) => {
 if (typeof value === 'string' || typeof value === 'number') {
 scope.setTag(key, String(value));
 } else {
 scope.setExtra(key, value);
 }
 });
 }
 scope.setLevel('error');
 Sentry.captureException(error);
 });
}

/**
 * Track a custom business event as a breadcrumb.
 */
export function trackEvent(name: string, data?: Record<string, unknown>): void {
 Sentry.addBreadcrumb({
 category: 'business',
 message: name,
 data: data ? (redactObject(data) as Record<string, unknown>) : undefined,
 level: 'info',
 });
}

/**
 * Set the current user context.
 * Maps Clerk user ID to a Sentry user.
 */
export function setUserContext(user: { id: string; email?: string }): void {
 Sentry.setUser({
 id: user.id,
 // Email is intentionally NOT included — PII policy
 });
}

/**
 * Clear user context (on logout / token expiry).
 */
export function clearUserContext(): void {
 Sentry.setUser(null);
}

/**
 * Capture a custom message with severity.
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
 Sentry.captureMessage(message, level);
}

/**
 * Flush Sentry events before process exit (e.g., in a SIGTERM handler).
 */
export async function flushSentry(timeout: number = 2000): Promise<boolean> {
 return Sentry.flush(timeout);
}

/**
 * Express middleware helper — wrap an Express app to capture request errors.
 */
export function getSentryHandlers() {
 return {
 requestHandler: Sentry.Handlers.requestHandler(),
 tracingHandler: Sentry.Handlers.tracingHandler(),
 errorHandler: Sentry.Handlers.errorHandler({
 shouldHandleError(error) {
 // Only capture 4xx/5xx errors
 const status = (error as { status?: number }).status ?? 500;
 return status >= 500;
 },
 }),
 };

}

export { Sentry };
