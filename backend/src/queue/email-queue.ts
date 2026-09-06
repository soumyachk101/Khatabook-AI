/**
 * Khatabook AI — Email Queue
 *
 * High-level wrapper around the BullMQ email queue.
 * Provides typed job producers and queue stats specific to email delivery.
 */

import { emailQueue, connection, QUEUE_NAMES } from './bull-queue';
import type { EmailJobData } from './bull-queue';

// ─── Producers ───────────────────────────────────────────────────────────────

/**
 * Enqueue a single email for delivery.
 * Returns the BullMQ job ID so callers can track it.
 */
export async function enqueueEmail(data: Omit<EmailJobData, 'jobId'>): Promise<string> {
 const job = await emailQueue.add('send-email', data as EmailJobData, {
 priority: data.priority === 'high' ? 1 : data.priority === 'low' ? 9 : 5,
 });
 return job.id!;
}

/**
 * Enqueue multiple emails in a single bulk operation.
 */
export async function enqueueBulkEmails(emails: Array<Omit<EmailJobData, 'jobId'>>): Promise<string[]> {
 const jobIds: string[] = [];
 for (const email of emails) {
 const jobId = await enqueueEmail(email);
 jobIds.push(jobId);
 }
 return jobIds;
}

/**
 * Schedule an email to be sent at a future time.
 */
export async function scheduleEmail(
 data: Omit<EmailJobData, 'jobId'>,
 scheduledAt: Date
): Promise<string> {
 const job = await emailQueue.add(
 'send-email',
 { ...data, jobId: `scheduled-${Date.now()}` } as EmailJobData,
 {
 priority: data.priority === 'high' ? 1 : data.priority === 'low' ? 9 : 5,
 delay: scheduledAt.getTime() - Date.now(),
 }
 );
 return job.id!;
}

// ─── Job Inspectors ──────────────────────────────────────────────────────────

export async function getEmailJob(jobId: string) {
 const job = await emailQueue.getJob(jobId);
 if (!job) return null;
 return {
 id: job.id,
 state: await job.getState(),
 progress: job.progress,
 failedReason: job.failedReason,
 processedOn: job.processedOn,
 finishedOn: job.finishedOn,
 };
}

export async function getEmailQueueStats() {
 const [waiting, active, completed, failed, delayed] = await Promise.all([
 emailQueue.getWaitingCount(),
 emailQueue.getActiveCount(),
 emailQueue.getCompletedCount(),
 emailQueue.getFailedCount(),
 emailQueue.getDelayedCount(),
 ]);

 return {
 queueName: QUEUE_NAMES.EMAIL,
 waiting,
 active,
 completed,
 failed,
 delayed,
 total: waiting + active + completed + failed + delayed,
 };
}

export { emailQueue, connection, QUEUE_NAMES };
export type { EmailJobData };
