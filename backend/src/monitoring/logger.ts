/**
 * =============================================================================
 * Khatabook AI — Backend Logger (Pino-based)
 * =============================================================================
 * Structured JSON logging with PII redaction, log levels, and pretty printing
 * in development. In production, outputs structured JSON for log aggregators
 * (Railway, Datadog, Sentry).
 *
 * Usage:
 * ```ts
 * import { logger } from './monitoring/logger';
 *
 * logger.info({ userId, invoiceId }, 'Invoice created');
 * logger.error({ err, receiptId }, 'OCR scan failed');
 * ```
 * =============================================================================
 */

import pino, { Logger, LoggerOptions } from 'pino';

/**
 * Sensitive fields that must be redacted from all log output.
 * Matches the Sentry redaction list to maintain consistency.
 */
const REDACT_PATHS = [
 '*.password',
 '*.token',
 '*.apiKey',
 '*.api_key',
 '*.secret',
 '*.authorization',
 '*.cookie',
 '*.session',
 '*.pan',
 '*.aadhaar',
 '*.aadhar',
 '*.gstin',
 '*.gst_number',
 '*.creditCard',
 '*.credit_card',
 '*.cardNumber',
 '*.card_number',
 '*.cvv',
 '*.ssn',
 '*.pin',
 '*.otp',
 'req.headers.authorization',
 'req.headers.cookie',
 'res.headers["set-cookie"]',
 'request.headers.authorization',
 'request.headers.cookie',
];

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const NODE_ENV = process.env.NODE_ENV || 'development';
const SERVICE_NAME = process.env.SERVICE_NAME || 'khatabook-backend';
const SERVICE_VERSION = process.env.npm_package_version || '1.0.0';

/**
 * Build Pino options for structured logging.
 */
const buildLoggerOptions = (): LoggerOptions => {
 const isProduction = NODE_ENV === 'production';

 const options: LoggerOptions = {
 level: LOG_LEVEL,
 redact: {
 paths: REDACT_PATHS,
 censor: '[REDACTED]',
 remove: false,
 },
 base: {
 service: SERVICE_NAME,
 version: SERVICE_VERSION,
 env: NODE_ENV,
 pid: process.pid,
 },
 timestamp: pino.stdTimeFunctions.isoTime,
 formatters: {
 level: (label) => ({ level: label }),
 bindings: () => ({}),
 },
 messageKey: 'message',
 errorKey: 'err',
 };

 if (!isProduction) {
 // Pretty print in development for readability
 options.transport = {
 target: 'pino-pretty',
 options: {
 colorize: true,
 translateTime: 'HH:MM:ss.l',
 ignore: 'pid,hostname,service,version,env',
 singleLine: false,
 },
 };
 } else {
 // Production: pure JSON, single line per log entry
 options.messageKey = 'message';
 }

 return options;
};

/**
 * The default logger instance.
 * Use this for all application logging.
 */
export const logger: Logger = pino(buildLoggerOptions());

/**
 * Create a child logger with additional context bindings.
 * Useful for request-scoped logging.
 *
 * @example
 * ```ts
 * const reqLogger = createChildLogger({ requestId, userId });
 * reqLogger.info('Processing invoice');
 * ```
 */
export function createChildLogger(bindings: Record<string, unknown>): Logger {
 return logger.child(bindings);
}

/**
 * Log an info message with structured data.
 */
export function logInfo(message: string, data?: Record<string, unknown>): void {
 if (data) {
 logger.info(data, message);
 } else {
 logger.info(message);
 }
}

/**
 * Log a warning with structured data.
 */
export function logWarn(message: string, data?: Record<string, unknown>): void {
 if (data) {
 logger.warn(data, message);
 } else {
 logger.warn(message);
 }
}

/**
 * Log an error with structured data and error object.
 */
export function logError(
 message: string,
 error?: Error | unknown,
 data?: Record<string, unknown>
): void {
 const err = error instanceof Error ? error : undefined;
 if (data) {
 logger.error({ ...data, err }, message);
 } else if (err) {
 logger.error({ err }, message);
 } else {
 logger.error(message);
 }
}

/**
 * Log a debug message (only visible when LOG_LEVEL=debug).
 */
export function logDebug(message: string, data?: Record<string, unknown>): void {
 if (data) {
 logger.debug(data, message);
 } else {
 logger.debug(message);
 }
}

/**
 * Express middleware to attach a request-scoped logger.
 * Adds requestId and logs request/response.
 */
export function requestLoggerMiddleware(req: any, res: any, next: any): void {
 const requestId = req.headers['x-request-id'] ||
 `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
 const startTime = Date.now();

 // Attach request ID to request object
 req.id = requestId;
 req.log = createChildLogger({
 requestId,
 method: req.method,
 path: req.path,
 });

 req.log.info('Incoming request');

 // Log response when finished
 res.on('finish', () => {
 const duration = Date.now() - startTime;
 const logData = {
 statusCode: res.statusCode,
 durationMs: duration,
 contentLength: res.getHeader('content-length'),
 };

 if (res.statusCode >= 500) {
 req.log.error(logData, 'Request failed');
 } else if (res.statusCode >= 400) {
 req.log.warn(logData, 'Request client error');
 } else {
 req.log.info(logData, 'Request completed');
 }
 });

 // Set request ID in response headers for client-side correlation
 res.setHeader('X-Request-Id', requestId);

 next();
}

/**
 * Flush logs on graceful shutdown.
 */
export async function flushLogs(): Promise<void> {
 await new Promise<void>((resolve) => {
 logger.flush();
 resolve();
 });
}

/**
 * Log a business event with structured data.
 */
export function logBusinessEvent(
 event: string,
 data?: Record<string, unknown>
): void {
 if (data) {
 logger.info({ event, ...data }, `business.${event}`);
 } else {
 logger.info({ event }, `business.${event}`);
 }
}

export default logger;
