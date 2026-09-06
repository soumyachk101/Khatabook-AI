import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, internalError } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * POST /api/reminders/[id]/cancel
 * Cancels a scheduled reminder.
 */
export async function POST(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const { error } = await supabase()
 .from("reminders")
 .update({ status: "cancelled" })
 .eq("id", params.id)
 .eq("user_id", userId);

 if (error) return internalError("Failed to cancel reminder");

 return ok({ message: "Reminder cancelled" });
 } catch {
 return internalError("Failed to cancel reminder");
 }
}
