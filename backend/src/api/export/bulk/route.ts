import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, internalError } from "@/app/lib/utils/response";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * POST /api/export/bulk
 * Queues a bulk export job.
 * In production, returns a job ID. For now, returns an immediate response.
 */
export async function POST(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const body = await request.json();
 const { type, format, from, to, business_id } = body;

 if (!type || !format || !from || !to) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "type, format, from, and to are required" } },
 { status: 422 }
 );
 }

 // In production, enqueue a BullMQ job for background export generation
 const jobId = `export-${type}-${Date.now()}`;

 return ok({
 job_id: jobId,
 status: "queued",
 type,
 format,
 from,
 to,
 message: "Export queued. You'll be notified when ready.",
 }, 202);
 } catch {
 return internalError("Failed to queue bulk export");
 }
}
