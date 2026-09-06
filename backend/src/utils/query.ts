/**
 * Build a Supabase query builder from pagination + filter params.
 * Returns the query (SELECT) — caller must call .then() to execute.
 */
import { SupabaseClient } from "@supabase/supabase-js";
import { type ListFilters } from "@/app/types";

export function buildListQuery<T>(
 client: SupabaseClient,
 table: string,
 userId: string,
 filters: ListFilters = {},
 selectCols = "*"
) {
 let query = client
 .from(table)
 .select(selectCols, { count: "exact" })
 .eq("user_id", userId)
 .order(filters.sort || "created_at", { ascending: filters.order === "asc" });

 if (filters.business_id) query = query.eq("business_id", filters.business_id);

 // Date filters — different tables use different date column names
 if (filters.from) {
 const dateCol = ["expenses", "receipts"].includes(table) ? "expense_date" : "invoice_date";
 query = query.gte(dateCol, filters.from);
 }
 if (filters.to) {
 const dateCol = ["expenses", "receipts"].includes(table) ? "expense_date" : "invoice_date";
 query = query.lte(dateCol, filters.to);
 }

 return query;
}

/**
 * Apply cursor/offset pagination to a Supabase query and return typed rows + meta.
 */
export async function paginateQuery<T>(
 query: ReturnType<typeof buildListQuery>,
 page: number,
 limit: number
): Promise<{ items: T[]; total: number; page: number; limit: number; pages: number }> {
 const from = (page - 1) * limit;
 const to = from + limit - 1;
 const { data, error, count } = await query.range(from, to);

 if (error) {
 console.error("Supabase paginate error:", error);
 throw new Error(error.message);
 }

 const total = count || 0;
 return {
 items: data || [],
 total,
 page,
 limit,
 pages: Math.ceil(total / limit) || 1,
 };
}
