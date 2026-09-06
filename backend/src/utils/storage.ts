import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

// ============================================================
// Supabase Client
// ============================================================

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
 console.warn(
 '[Storage] Supabase credentials missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env'
 );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
 auth: {
 autoRefreshToken: false,
 persistSession: false,
 },
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
 auth: {
 autoRefreshToken: false,
 persistSession: false,
 },
 db: { schema: 'public' },
 global: {
 headers: { 'x-application-name': 'khatabook-ai-backend' },
 },
});

export function createAuthenticatedClient(accessToken: string) {
 return createClient(supabaseUrl, supabaseAnonKey, {
 global: {
 headers: { Authorization: `Bearer ${accessToken}` },
 },
 });
}

// ============================================================
// Redis Client
// ============================================================

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
 maxRetriesPerRequest: 3,
 retryStrategy(times) {
 const delay = Math.min(times * 50, 2000);
 return delay;
 },
 lazyConnect: true,
});

redis.on('error', (err) => {
 console.error('[Redis] Connection error:', err.message);
});

redis.on('connect', () => {
 console.log('[Redis] Connected');
});

// Connect on module load
redis.connect().catch((err) => {
 console.error('[Redis] Failed to connect:', err.message);
});

// ============================================================
// Storage Helpers
// ============================================================

export const STORAGE_BUCKETS = {
 RECEIPTS: 'receipts',
 INVOICES: 'invoices',
 EXPORTS: 'exports',
 AVATARS: 'avatars',
 BUSINESS_LOGOS: 'business-logos',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
 bucket: StorageBucket,
 path: string,
 file: Buffer | Blob,
 contentType?: string
): Promise<{ url: string; path: string }> {
 const { data, error } = await supabase.storage
 .from(bucket)
 .upload(path, file, {
 contentType,
 upsert: false,
 cacheControl: '3600',
 });

 if (error) {
 throw new Error(`Upload failed: ${error.message}`);
 }

 const {
 data: { publicUrl },
 } = supabase.storage.from(bucket).getPublicUrl(data.path);

 return {
 url: publicUrl,
 path: data.path,
 };
}

/**
 * Upload a file as a specific user (uses RLS)
 */
export async function uploadFileAsUser(
 accessToken: string,
 bucket: StorageBucket,
 path: string,
 file: Buffer | Blob,
 contentType?: string
): Promise<{ url: string; path: string }> {
 const client = createAuthenticatedClient(accessToken);

 const { data, error } = await client.storage
 .from(bucket)
 .upload(path, file, {
 contentType,
 upsert: false,
 cacheControl: '3600',
 });

 if (error) {
 throw new Error(`Upload failed: ${error.message}`);
 }

 const {
 data: { publicUrl },
 } = client.storage.from(bucket).getPublicUrl(data.path);

 return {
 url: publicUrl,
 path: data.path,
 };
}

/**
 * Get a signed URL for a private file
 */
export async function getSignedUrl(
 bucket: StorageBucket,
 path: string,
 expiresIn: number = 3600
): Promise<string> {
 const { data, error } = await supabase.storage
 .from(bucket)
 .createSignedUrl(path, expiresIn);

 if (error) {
 throw new Error(`Failed to get signed URL: ${error.message}`);
 }

 return data.signedUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(
 bucket: StorageBucket,
 path: string
): Promise<void> {
 const { error } = await supabase.storage.from(bucket).remove([path]);

 if (error) {
 throw new Error(`Delete failed: ${error.message}`);
 }
}

/**
 * Generate a unique storage path for uploads
 */
export function generateStoragePath(
 userId: string,
 prefix: string,
 extension: string
): string {
 const timestamp = Date.now();
 const random = Math.random().toString(36).substring(2, 8);
 return `${userId}/${prefix}-${timestamp}-${random}.${extension}`;
}

/**
 * Detect MIME type from file buffer
 */
export function detectMimeType(buffer: Buffer): string {
 const signatures: Record<string, string[]> = {
 'image/jpeg': ['FFD8FF'],
 'image/png': ['89504E47'],
 'image/webp': ['52494646'],
 'image/heic': ['0000001866747970'],
 'application/pdf': ['25504446'],
 'image/gif': ['47494638'],
 };

 const signature = buffer.toString('hex', 0, 4).toUpperCase();

 for (const [mime, sigs] of Object.entries(signatures)) {
 if (sigs.some((s) => signature.startsWith(s))) {
 return mime;
 }
 }

 return 'application/octet-stream';
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mime: string): string {
 const map: Record<string, string> = {
 'image/jpeg': 'jpg',
 'image/png': 'png',
 'image/webp': 'webp',
 'image/heic': 'heic',
 'image/gif': 'gif',
 'application/pdf': 'pdf',
 };
 return map[mime] || 'bin';
}
