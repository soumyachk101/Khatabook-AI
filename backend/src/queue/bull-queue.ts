/**
 * Khatabook AI — BullMQ Queue Definitions
 *
 * Central registry of all job queues used for async processing.
 */

import { Queue, Worker, QueueScheduler, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

// ─── Redis Connection ─────────────────────────────────────────────────────────

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');

export { connection };

// ─── Queue Names ──────────────────────────────────────────────────────────────

export const QUEUE_NAMES = {
 RECEIPT_SCAN: 'receipt-scan',
 EMAIL: 'email',
 EXPORT: 'export',
 PDF_GENERATION: 'pdf-generation',
} as const;

// ─── Job Data Types ───────────────────────────────────────────────────────────

export interface ReceiptScanJobData {
 jobId: string;
 receiptId: string;
 userId: string;
 businessId?: string;
 imageUrl: string;
 mimeType: string;
 priority?: 'low' | 'normal' | 'high';
 attempts?: number;
}

export interface EmailJobData {
 jobId: string;
 to: string;
 subject: string;
 html: string;
 from?: string;
 replyTo?: string;
 priority?: 'low' | 'normal' | 'high';
}

export interface ExportJobData {
 jobId: string;
 userId: string;
 exportType: 'expenses_csv' | 'invoices_csv' | 'gst_csv' | 'invoice_pdf';
 filters?: Record<string, unknown>;
 callbackUrl?: string;
}

export interface PDFGenerationJobData {
 jobId: string;
 invoiceId: string;
 userId: string;
 format: 'pdf';
 callbackUrl?: string;
}

// ─── Shared Job Options ───────────────────────────────────────────────────────

const DEFAULT_OPTS: JobsOptions = {
 removeOnComplete: { count: 100, age: 24 * 3600 },
 removeOnFail: { count: 50, age: 7 * 24 * 3600 },
 attempts: 3,
 backoff: {
 type: 'exponential',
 delay: 2000,
 },
};

// ─── Queue Definitions ────────────────────────────────────────────────────────

export const receiptScanQueue = new Queue<ReceiptScanJobData>(QUEUE_NAMES.RECEIPT_SCAN, {
 connection,
 defaultJobOptions: {
 ...DEFAULT_OPTS,
 attempts: 4,
 backoff: { type: 'exponential', delay: 1000 },
 },
});

export const emailQueue = new Queue<EmailJobData>(QUEUE_NAMES.EMAIL, {
 connection,
 defaultJobOptions: {
 ...DEFAULT_OPTS,
 attempts: 5,
 backoff: { type: 'exponential', delay: 500 },
 },
});

export const exportQueue = new Queue<ExportJobData>(QUEUE_NAMES.EXPORT, {
 connection,
 defaultJobOptions: DEFAULT_OPTS,
});

export const pdfGenerationQueue = new Queue<PDFGenerationJobData>(QUEUE_NAMES.PDF_GENERATION, {
 connection,
 defaultJobOptions: DEFAULT_OPTS,
});

// ─── Schedulers ───────────────────────────────────────────────────────────────

export const receiptScanScheduler = new QueueScheduler(QUEUE_NAMES.RECEIPT_SCAN, { connection });
export const emailScheduler = new QueueScheduler(QUEUE_NAMES.EMAIL, { connection });

// ─── Queue Map ────────────────────────────────────────────────────────────────

export const queues = {
 receiptScanQueue,
 emailQueue,
 exportQueue,
 pdfGenerationQueue,
} as const;

// ─── Queue Stats Helper ───────────────────────────────────────────────────────

export async function getQueueStats() {
 const stats: Record<string, { waiting: number; active: number; completed: number; failed: number; delayed: number }> = {};

 for (const [name, queue] of Object.entries(queues)) {
 const [waiting, active, completed, failed, delayed] = await Promise.all([
 queue.getWaitingCount(),
 queue.getActiveCount(),
 queue.getCompletedCount(),
 queue.getFailedCount(),
 queue.getDelayedCount(),
 ]);

 stats[name] = { waiting, active, completed, failed, delayed };
 }

 return stats;
}

export async function closeQueues() {
 await Promise.all(Object.values(queues).map((q) => q.close()));
}
