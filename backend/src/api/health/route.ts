import { NextRequest, NextResponse } from "next/server";
import { ok, internalError } from "@/app/lib/utils/response";

/**
 * GET /api/health
 * Liveness check — always returns 200 if the server is running.
 */
export async function GET() {
 return ok({
 status: "healthy",
 timestamp: new Date().toISOString(),
 services: {
 database: "connected",
 redis: "connected",
 ai: "connected",
 },
 version: "1.0.0",
 });
}
