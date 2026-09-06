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
 * POST /api/ai/suggest-items
 * Suggests HSN/SAC codes and rates for invoice items.
 */
export async function POST(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const body = await request.json();
 const { description } = body;

 if (!description || typeof description !== "string") {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "description is required" } },
 { status: 422 }
 );
 }

 // In production, call OpenAI with the suggestion prompt
 // For now, return rule-based suggestions
 const lowerDesc = description.toLowerCase();
 let suggestions: Array<{ description: string; hsn_sac: string; suggested_rate: number; cgst_rate: number; sgst_rate: number; igst_rate: number }> = [];

 if (lowerDesc.includes("web") || lowerDesc.includes("website") || lowerDesc.includes("development")) {
 suggestions.push({ description: "Website Development", hsn_sac: "998314", suggested_rate: 50000, cgst_rate: 9, sgst_rate: 9, igst_rate: 0 });
 }
 if (lowerDesc.includes("design") || lowerDesc.includes("logo") || lowerDesc.includes("graphic")) {
 suggestions.push({ description: "Graphic Design Services", hsn_sac: "998382", suggested_rate: 15000, cgst_rate: 9, sgst_rate: 9, igst_rate: 0 });
 }
 if (lowerDesc.includes("content") || lowerDesc.includes("writing") || lowerDesc.includes("article")) {
 suggestions.push({ description: "Content Writing", hsn_sac: "998399", suggested_rate: 500, cgst_rate: 9, sgst_rate: 9, igst_rate: 0 });
 }
 if (lowerDesc.includes("consult") || lowerDesc.includes("advisory")) {
 suggestions.push({ description: "Consulting Services", hsn_sac: "998261", suggested_rate: 3000, cgst_rate: 9, sgst_rate: 9, igst_rate: 0 });
 }
 if (lowerDesc.includes("market") || lowerDesc.includes("seo") || lowerDesc.includes("ads")) {
 suggestions.push({ description: "Digital Marketing Services", hsn_sac: "998399", suggested_rate: 25000, cgst_rate: 9, sgst_rate: 9, igst_rate: 0 });
 }

 if (suggestions.length === 0) {
 suggestions.push({ description: "Professional Services", hsn_sac: "998314", suggested_rate: 10000, cgst_rate: 9, sgst_rate: 9, igst_rate: 0 });
 }

 return ok({ suggestions });
 } catch {
 return internalError("Failed to suggest items");
 }
}
