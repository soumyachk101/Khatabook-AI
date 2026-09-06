import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, notFound, internalError, validationError } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";
import { sendEmail } from "@/app/lib/services";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * POST /api/reminders
 * Creates a payment reminder for an invoice.
 */
export async function POST(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const body = await request.json();
 const { invoice_id, reminder_type, scheduled_at, recipient_email, recipient_name, subject, body_text } = body;

 if (!invoice_id || !reminder_type || !scheduled_at) {
 return validationError("invoice_id, reminder_type, and scheduled_at are required");
 }

 const { data: reminder, error } = await supabase()
 .from("reminders")
 .insert({
 user_id: userId,
 invoice_id,
 reminder_type,
 scheduled_at,
 recipient_email: recipient_email || "",
 recipient_name: recipient_name || "",
 })
 .select()
 .single();

 if (error) {
 console.error("Reminder create error:", error);
 return internalError("Failed to create reminder");
 }

 return ok(reminder, 201);
 } catch {
 return internalError("Failed to create reminder");
 }
}

/**
 * GET /api/reminders
 * Lists reminders for the current user.
 */
export async function GET(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const { searchParams } = new URL(request.url);
 const status = searchParams.get("status");

 let query = supabase()
 .from("reminders")
 .select("*", { count: "exact" })
 .eq("user_id", userId)
 .order("scheduled_at", { ascending: true });

 if (status) query = query.eq("status", status);

 const { data, error, count } = await query;

 if (error) return internalError("Failed to fetch reminders");

 return ok({
 items: data || [],
 pagination: { page: 1, limit: 50, total: count || 0, pages: 1 },
 });
 } catch {
 return internalError("Failed to list reminders");
 }
}
