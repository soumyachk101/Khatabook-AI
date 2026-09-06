import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * GET /api/expenses/import/[import_id]
 * In production, this would check job status. For now, return completed.
 */
export async function GET(
 request: NextRequest,
 { params }: { params: { import_id: string } }
) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 return ok({
 job_id: params.import_id,
 status: "completed",
 });
 } catch {
 return ok({ status: "completed" });
 }
}
