import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, notFound, internalError, validationError } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";
import { getRazorpay } from "@/app/lib/config/razorpay";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

/**
 * POST /api/payments/[id]/refund
 * Processes a refund for a payment.
 */
export async function POST(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const body = await request.json();
 const { amount, reason } = body;

 if (!amount || amount <= 0 || !reason) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "amount and reason are required" } },
 { status: 422 }
 );
 }

 const { data: payment, error: payError } = await supabase()
 .from("payments")
 .select("*")
 .eq("id", params.id)
 .eq("user_id", userId)
 .single();

 if (payError || !payment) return notFound("Payment not found");

 if (payment.status !== "completed") {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Only completed payments can be refunded" } },
 { status: 422 }
 );
 }

 if (amount > Number(payment.amount)) {
 return NextResponse.json(
 { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Refund amount cannot exceed payment amount" } },
 { status: 422 }
 );
 }

 // Initiate Razorpay refund
 try {
 const razorpay = getRazorpay();
 await razorpay.payments.refund(payment.reference_number || "", {
 amount: Math.round(amount * 100),
 notes: { reason, notes: body.notes || "" },
 });
 } catch (rzpErr) {
 console.error("Razorpay refund error:", rzpErr);
 }

 // Update payment status
 const { data: updated } = await supabase()
 .from("payments")
 .update({ status: "refunded" })
 .eq("id", params.id)
 .select()
 .single();

 return ok({
 payment: updated,
 refund_amount: amount,
 reason,
 });
 } catch {
 return internalError("Failed to process refund");
 }
}
