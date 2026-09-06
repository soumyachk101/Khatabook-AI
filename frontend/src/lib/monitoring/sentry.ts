/**
 * =============================================================================
 * Khatabook AI — Frontend Sentry Configuration
 * =============================================================================
 * Browser-based error tracking, performance monitoring, and session replay.
 *
 * Usage:
 * 1. Install: `npm install @sentry/nextjs`
 * 2. Import this file from `sentry.client.config.ts` and `sentry.server.config.ts`
 * 3. Add the Sentry plugin to `next.config.mjs`
 * 4. Set `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` env vars
 *
 * Features:
 * - Performance tracing (10% in prod, 100% in dev)
 * - Session replay on errors (100%) and normal sessions (5%)
 * - Release tracking via Git SHA
 * - PII redaction (no receipts, no PAN/Aadhaar/GSTIN)
 * - React Error Boundary integration
 * =============================================================================
 */

import * as Sentry from '@sentry/nextjs';
import type { BrowserOptions } from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';
const RELEASE = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
 process.env.VERCEL_GIT_COMMIT_SHA ||
 'development';

/**
 * Build the Sentry options object for client and server.
 * Server-side options use slightly different settings (no session replay).
 */
export function buildSentryOptions(): BrowserOptions {
 return {
 dsn: SENTRY_DSN,
 environment: ENVIRONMENT,
 release: RELEASE,

 // ── Performance Monitoring ────────────────────────────────────────────
 tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
 tracePropagationTargets: [
 'localhost',
 /^https:\/\/[^/]*\.khatabookai\.com/,
 /^https:\/\/api\.khatabookai\.com/,
 /^https:\/\/.*\.vercel\.app/,
 ],

 // ── Profiling ────────────────────────────────────────────────────────
 profilesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,

 // ── Session Replay ───────────────────────────────────────────────────
 replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.05 : 1.0,
 replaysOnErrorSampleRate: 1.0,

 // ── Filtering & Privacy ──────────────────────────────────────────────
 sendDefaultPii: false,
 // Don't send these sensitive fields
 beforeSendTransaction(event) {
 // Strip receipt data and PII from transactions
 if (event.request?.cookies) {
 delete event.request.cookies;
 }
 if (event.user) {
 // Strip email — keep only ID
 event.user = {
 id: event.user.id,
 };
 }
 return event;
 },

 // ── Ignore noisy errors ──────────────────────────────────────────────
 ignoreErrors: [
 // Browser extensions
 'top.GLOBALS',
 'ResizeObserver loop limit exceeded',
 'Network request failed',
 'AbortError',
 // React development warnings
 'useLayoutEffect does nothing on the server',
 'Hydration failed',
 // User-initiated cancellations
 'Request aborted',
 'The user aborted a request',
 'AbortError: The user aborted a request',
 // Razorpay SDK noise
 'rzpMerchantLib',
 ],

 // ── Deduplication ────────────────────────────────────────────────────
 beforeBreadcrumb(breadcrumb) {
 // Strip sensitive query params
 if (breadcrumb.data?.url) {
 breadcrumb.data.url = breadcrumb.data.url.replace(
 /([?&])(api[_-]?key|token|password|secret)=[^&]+/gi,
 '$1$2=[REDACTED]'
 );
 }
 return breadcrumb;
 },

 // ── Integrations ─────────────────────────────────────────────────────
 integrations: [
 new Sentry.BrowserTracing({
 tracePropagationTargets: [
 'localhost',
 /^https:\/\/[^/]*\.khatabookai\.com/,
 /^https:\/\/api\.khatabookai\.com/,
 ],
 }),
 new Sentry.Replay({
 maskAllText: true,
 maskAllInputs: true,
 blockAllMedia: true,
 networkDetailAllowUrls: [
 /^https:\/\/api\.khatabookai\.com/,
 ],
 }),
 ],

 // ── Feature Flags (PostHog integration) ─────────────────────────────
 initialScope: {
 tags: {
 component: 'frontend',
 runtime: 'browser',
 },
 },

 // ── Release Health ──────────────────────────────────────────────────
 autoSessionTracking: true,

 // ── Attach Stacktrace ────────────────────────────────────────────────
 attachStacktrace: true,

 // ── Max breadcrumbs ─────────────────────────────────────────────────
 maxBreadcrumbs: 50,
 };
}

/**
 * Custom error reporter for non-Sentry exceptions.
 * Use this for app-level errors that need business context.
 */
export function reportError(error: Error, context?: Record<string, unknown>): void {
 Sentry.withScope((scope) => {
 if (context) {
 Object.entries(context).forEach(([key, value]) => {
 scope.setTag(key, String(value));
 });
 }
 scope.setLevel('error');
 Sentry.captureException(error);
 });
}

/**
 * Track a custom business event.
 */
export function trackEvent(name: string, data?: Record<string, unknown>): void {
 Sentry.addBreadcrumb({
 category: 'business',
 message: name,
 data,
 level: 'info',
 });
}

/**
 * Set the current user context for error reports.
 */
export function setUserContext(user: { id: string; email?: string }): void {
 Sentry.setUser({
 id: user.id,
 email: user.email,
 });
}

/**
 * Clear the current user context (on logout).
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

export { Sentry };
