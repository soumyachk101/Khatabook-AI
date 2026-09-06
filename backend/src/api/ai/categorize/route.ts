import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, notFound, internalError } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * POST /api/ai/categorize
 * AI-powered receipt categorization.
 */
export async function POST(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const body = await request.json();
 const { receipt_id, force = false } = body;

 if (!receipt_id) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "receipt_id is required" } },
 { status: 422 }
 );
 }

 const { data: receipt } = await supabase()
 .from("receipts")
 .select("*")
 .eq("id", receipt_id)
 .eq("user_id", userId)
 .single();

 if (!receipt) return notFound("Receipt not found");

 // In production, call the OCR microservice for categorization
 // For now, return a placeholder result
 const categories = ["Office Supplies", "Travel", "Food", "Utilities", "Software", "Marketing"];
 const suggested = categories[Math.floor(Math.random() * categories.length)];

 return ok({
 category: suggested,
 confidence: 0.85,
 alternatives: categories.filter((c) => c !== suggested).slice(0, 3).map((c) => ({ name: c, confidence: Math.random() * 0.3 })),
 });
 } catch {
 return internalError("Failed to categorize receipt");
 }
}
