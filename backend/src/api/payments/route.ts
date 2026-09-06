import { NextRequest, NextResponse } from "next/server";
import { ok, unauthorized, notFound, internalError } from "@/app/lib/utils/response";
import { supabase } from "@/app/lib/supabase";

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
 const authHeader = request.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;
 const { data } = await supabase().auth.getUser(authHeader.slice(7));
 return data.user?.id || null;
}

export async function GET(request: NextRequest) {
 try {
 const userId = await getUserFromRequest(request);
 if (!userId) return unauthorized();

 const { searchParams } = new URL(request.url);
 const invoiceId = searchParams.get("invoice_id");
 const status = searchParams.get("status");
 const page = Number(searchParams.get("page") || "1");
 const limit = Math.min(Number(searchParams.get("limit") || "20"), 100);

 let query = supabase()
 .from("payments")
 .select("*", { count: "exact" })
 .eq("user_id", userId)
 .order("payment_date", { ascending: false });

 if (invoiceId) query = query.eq("invoice_id", invoiceId);
 if (status) query = query.eq("status", status);

 const from = (page - 1) * limit;
 const to = from + limit - 1;
 const { data, error, count } = await query.range(from, to);

 if (error) return internalError("Failed to fetch payments");

 return ok({
 items: data || [],
 pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) || 1 },
 });
 } catch {
 return internalError("Failed to list payments");
 }
}
