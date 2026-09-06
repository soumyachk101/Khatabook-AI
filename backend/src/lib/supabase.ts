import { createClient } from "@supabase/supabase-js";

export const supabase = () => {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
 const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

 if (!url || !anonKey) {
 throw new Error("Supabase environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
 }

 return createClient(url, anonKey, {
 auth: {
 autoRefreshToken: false,
 persistSession: false,
 },
 });
};

export const supabaseServiceRole = () => {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
 const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

 if (!url || !serviceKey) {
 throw new Error("Supabase service role key is not configured.");
 }

 return createClient(url, serviceKey, {
 auth: { autoRefreshToken: false, persistSession: false },
 });
};
