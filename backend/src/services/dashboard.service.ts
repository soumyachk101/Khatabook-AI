import { supabase } from "../utils/supabase";
import { DashboardSummary, MonthlyStats, CategoryBreakdown } from "../utils/response";

export class DashboardService {
 private userId: string;

 constructor(userId: string) {
 this.userId = userId;
 }

 /**
 * Get dashboard summary for a period
 */
 async getSummary(businessId?: string): Promise<DashboardSummary> {
 const now = new Date();
 const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
 const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
 const fromStr = fromDate.toISOString().split("T")[0];
 const toStr = toDate.toISOString().split("T")[0];

 // Revenue
 let invQ = supabase
 .from("invoices")
 .select("grand_total, status, business_id")
 .eq("user_id", this.userId)
 .gte("invoice_date", fromStr)
 .lte("invoice_date", toStr);
 if (businessId) invQ = invQ.eq("business_id", businessId);
 const { data: invoices } = await invQ;

 const invoiced = (invoices || []).reduce((s, i) => s + (i.grand_total || 0), 0);
 const paid = (invoices || [])
 .filter((i) => i.status === "paid")
 .reduce((s, i) => s + (i.grand_total || 0), 0);
 const pending = (invoices || [])
 .filter((i) => i.status === "sent" || i.status === "viewed")
 .reduce((s, i) => s + (i.grand_total || 0), 0);
 const overdue = (invoices || [])
 .filter((i) => i.status === "overdue")
 .reduce((s, i) => s + (i.grand_total || 0), 0);

 // Expenses
 let expQ = supabase
 .from("expenses")
 .select("amount, category_id, expense_date")
 .eq("user_id", this.userId)
 .is("deleted_at", null)
 .gte("expense_date", fromStr)
 .lte("expense_date", toStr);
 if (businessId) expQ = expQ.eq("business_id", businessId);
 const { data: expenses } = await expQ;

 const totalExpenses = (expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
 const byCategory: Record<string, number> = {};
 for (const exp of expenses || []) {
 const catId = exp.category_id || "uncategorized";
 byCategory[catId] = (byCategory[catId] || 0) + (exp.amount || 0);
 }

 // Receipts
 let recQ = supabase
 .from("receipts")
 .select("*", { count: "exact", head: true })
 .eq("user_id", this.userId)
 .gte("created_at", fromStr)
 .lte("created_at", toStr);
 if (businessId) recQ = recQ.eq("business_id", businessId);
 const { count: receiptsCount } = await recQ;

 let revQ = supabase
 .from("receipts")
 .select("*", { count: "exact", head: true })
 .eq("user_id", this.userId)
 .eq("review_status", "pending_review");
 if (businessId) revQ = revQ.eq("business_id", businessId);
 const { count: pendingReviewCount } = await revQ;

 const invoiceCounts = {
 total: (invoices || []).length,
 paid: (invoices || []).filter((i) => i.status === "paid").length,
 pending: (invoices || []).filter((i) => i.status === "sent").length,
 overdue: (invoices || []).filter((i) => i.status === "overdue").length,
 draft: (invoices || []).filter((i) => i.status === "draft").length,
 };

 // GST (simplified)
 let gstQ = supabase
 .from("gst_returns")
 .select("*")
 .eq("user_id", this.userId)
 .order("created_at", { ascending: false })
 .limit(1);
 if (businessId) gstQ = gstQ.eq("business_id", businessId);
 const { data: gstReturn } = await gstQ;

 const outputTax = (gstReturn?.[0]?.total_cgst || 0) + (gstReturn?.[0]?.total_sgst || 0) + (gstReturn?.[0]?.total_igst || 0);
 const inputTax = (gstReturn?.[0]?.input_cgst || 0) + (gstReturn?.[0]?.input_sgst || 0) + (gstReturn?.[0]?.input_igst || 0);

 return {
 period: { from: fromStr, to: toStr },
 revenue: { total: invoiced, invoiced, received: paid, pending, overdue },
 expenses: { total: totalExpenses, by_category: byCategory },
 gst: {
 output_tax: outputTax,
 input_tax: inputTax,
 net_payable: Math.max(0, outputTax - inputTax),
 itc_available: inputTax,
 },
 receipts: {
 scanned_this_month: receiptsCount || 0,
 pending_review: pendingReviewCount || 0,
 },
 invoices: invoiceCounts,
 cash_flow: {
 opening: 0,
 inflows: paid,
 outflows: totalExpenses,
 closing: paid - totalExpenses,
 },
 };
 }

 /**
 * Get monthly stats
 */
 async getMonthlyStats(from: string, to: string): Promise<MonthlyStats> {
 let invQ = supabase
 .from("invoices")
 .select("invoice_date, grand_total, status")
 .eq("user_id", this.userId)
 .gte("invoice_date", from)
 .lte("invoice_date", to);
 const { data: invoices } = await invQ;

 let expQ = supabase
 .from("expenses")
 .select("expense_date, amount")
 .eq("user_id", this.userId)
 .gte("expense_date", from)
 .lte("expense_date", to)
 .is("deleted_at", null);
 const { data: expenses } = await expQ;

 const monthMap: Record<string, { revenue: number; expenses: number; invoices_count: number; receipts_count: number }> = {};

 for (const inv of invoices || []) {
 const month = (inv.invoice_date as string)?.slice(0, 7);
 if (!month) continue;
 if (!monthMap[month]) {
 monthMap[month] = { revenue: 0, expenses: 0, invoices_count: 0, receipts_count: 0 };
 }
 if (inv.status !== "draft" && inv.status !== "cancelled" && inv.status !== "void") {
 monthMap[month].revenue += inv.grand_total || 0;
 }
 monthMap[month].invoices_count += 1;
 }

 for (const exp of expenses || []) {
 const month = (exp.expense_date as string)?.slice(0, 7);
 if (!month) continue;
 if (!monthMap[month]) {
 monthMap[month] = { revenue: 0, expenses: 0, invoices_count: 0, receipts_count: 0 };
 }
 monthMap[month].expenses += exp.amount || 0;
 }

 const months = Object.entries(monthMap)
 .map(([month, data]) => ({
 month,
 revenue: data.revenue,
 expenses: data.expenses,
 profit: data.revenue - data.expenses,
 invoices_count: data.invoices_count,
 receipts_count: data.receipts_count,
 gst_payable: 0,
 }))
 .sort((a, b) => a.month.localeCompare(b.month));

 const totals = months.reduce(
 (acc, m) => ({
 revenue: acc.revenue + m.revenue,
 expenses: acc.expenses + m.expenses,
 profit: acc.profit + m.profit,
 }),
 { revenue: 0, expenses: 0, profit: 0 }
 );

 return { months, totals };
 }

 /**
 * Get category breakdown
 */
 async getCategoryBreakdown(
 type: "income" | "expense",
 from?: string,
 to?: string,
 businessId?: string
 ): Promise<CategoryBreakdown> {
 let query;
 if (type === "expense") {
 query = supabase
 .from("expenses")
 .select("amount, category_id")
 .eq("user_id", this.userId)
 .is("deleted_at", null)
 .gte("expense_date", from || "2000-01-01")
 .lte("expense_date", to || "2099-12-31");
 if (businessId) query = query.eq("business_id", businessId);
 } else {
 query = supabase
 .from("invoices")
 .select("grand_total, business_id")
 .eq("user_id", this.userId)
 .gte("invoice_date", from || "2000-01-01")
 .lte("invoice_date", to || "2099-12-31");
 if (businessId) query = query.eq("business_id", businessId);
 }

 const { data, error } = await query;

 if (error) {
 throw new Error(`Failed to get category breakdown: ${error.message}`);
 }

 // Fetch category names
 const expenseCategoryIds = [...new Set((data || []).map((r: any) => r.category_id).filter(Boolean))];
 const { data: categories } = await supabase
 .from("categories")
 .select("id, name")
 .in("id", expenseCategoryIds);

 const catMap = new Map((categories || []).map((c: { id: string; name: string }) => [c.id, c.name]));

 const totals: Record<string, { amount: number; count: number }> = {};
 for (const row of data || []) {
 const catName = catMap.get(row.category_id as string) || "Uncategorized";
 if (!totals[catName]) totals[catName] = { amount: 0, count: 0 };
 totals[catName].amount += row.amount || 0;
 totals[catName].count += 1;
 }

 const totalAmount = Object.values(totals).reduce((s, t) => s + t.amount, 0);

 const categories_list = Object.entries(totals)
 .map(([name, t]) => ({
 name,
 amount: t.amount,
 percentage: totalAmount > 0 ? Math.round((t.amount / totalAmount) * 100) : 0,
 transaction_count: t.count,
 }))
 .sort((a, b) => b.amount - a.amount);

 return { categories: categories_list, total: totalAmount };
 }
}
