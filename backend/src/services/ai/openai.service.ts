/**
 * Khatabook AI — OpenAI Service
 *
 * Single source of truth for the GPT-4o family client and shared
 * retry/error handling used by all AI modules.
 */

import OpenAI from 'openai';

const MODEL = 'gpt-4o';
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;

let instance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
 if (instance) return instance;

 const apiKey = process.env.OPENAI_API_KEY;
 if (!apiKey) {
 throw new Error('OPENAI_API_KEY is not configured');
 }

 instance = new OpenAI({ apiKey, timeout: 60_000 });
 return instance;
}

export async function withRetry<T>(
 fn: () => Promise<T>,
 retries = MAX_RETRIES,
 baseDelayMs = RETRY_BASE_DELAY_MS
): Promise<T> {
 const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

 for (let attempt = 0; attempt < retries; attempt++) {
 try {
 return await fn();
 } catch (error: unknown) {
 const isLast = attempt === retries - 1;
 if (isLast) throw error;

 const anyErr = error as { status?: number; code?: string };
 const status = anyErr?.status;
 const code = anyErr?.code;

 const isRetryable =
 status === 429 ||
 status === 500 ||
 status === 502 ||
 status === 503 ||
 code === 'ECONNRESET' ||
 code === 'ETIMEDOUT';

 if (!isRetryable) throw error;

 const jitter = Math.random() * 500;
 const delay = baseDelayMs * 2 ** attempt + jitter;
 console.warn(
 `OpenAI: attempt ${attempt + 1} failed (${status ?? code}), retrying in ${Math.round(delay)}ms`
 );
 await sleep(delay);
 }
 }

 throw new Error('Unreachable');
}

export function sanitizeOpenAIContent(raw: string): string {
 const jsonMatch = raw.match(/\{[\s\S]*\}/);
 if (!jsonMatch) throw new Error(`Non-JSON response: ${raw.slice(0, 200)}`);
 return jsonMatch[0];
}

export function parseJSONSafely<T>(content: string): T {
 return JSON.parse(content) as T;
}

export { MODEL as OPENAI_MODEL };
