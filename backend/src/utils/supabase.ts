import { createClient } from '@supabase/supabase-js';
import { supabase, supabaseAdmin, redis, STORAGE_BUCKETS, uploadFile, uploadFileAsUser, getSignedUrl, deleteFile, generateStoragePath, detectMimeType, getExtensionFromMime, createAuthenticatedClient } from './storage';

// Re-export for backward compatibility with existing code
export {
 supabase,
 supabaseAdmin,
 redis,
 STORAGE_BUCKETS,
 uploadFile,
 uploadFileAsUser,
 getSignedUrl,
 deleteFile,
 generateStoragePath,
 detectMimeType,
 getExtensionFromMime,
 createAuthenticatedClient,
};

export default supabase;
