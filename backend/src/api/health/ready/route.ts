import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { ok, internalError } from "@/app/lib/utils/response";

/**
 * GET /api/health/ready
 * Readiness check — verifies connectivity to all dependencies.
 */
export async function GET() {
 try {
 // Test database
 await supabase().from("profiles").select("count").limit(1);

 return ok({
 status: "ready",
 timestamp: new Date().toISOString(),
 });
 } catch {
 return NextResponse.json(
 { success: false, data: null, error: { code: "SERVICE_UNAVAILABLE", message: "Service not ready" } },
 { status: 503 }
 );
 }
}
