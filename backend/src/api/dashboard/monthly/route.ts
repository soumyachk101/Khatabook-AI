import { Router } from 'express';
import { supabaseAdmin } from '../../../utils/storage';
import { successResponse, errorResponse } from '../../../utils/response';

const router = Router();

router.get('/monthly', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const { from, to, business_id } = req.query;

 const startDate = from || new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1).toISOString().split('T')[0];
 const endDate = to || new Date().toISOString().split('T')[0];

 let invQuery = supabaseAdmin
 .from('invoices')
 .select('invoice_date, grand_total')
 .eq('user_id', userId)
 .gte('invoice_date', startDate)
 .lte('invoice_date', endDate)
 .in('status', ['paid', 'partial']);

 if (business_id) invQuery = invQuery.eq('business_id', business_id);
 const { data: invoices } = await invQuery;

 let expQuery = supabaseAdmin
 .from('expenses')
 .select('expense_date, amount')
 .eq('user_id', userId)
 .gte('expense_date', startDate)
 .lte('expense_date', endDate)
 .is('deleted_at', null);

 if (business_id) expQuery = expQuery.eq('business_id', business_id);
 const { data: expenses } = await expQuery;

 const monthlyData: Record<string, { revenue: number; expenses: number; month: string }> = {};

 (invoices || []).forEach((inv: any) => {
 const month = inv.invoice_date.substring(0, 7);
 if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0, month };
 monthlyData[month].revenue += inv.grand_total || 0;
 });

 (expenses || []).forEach((exp: any) => {
 const month = exp.expense_date.substring(0, 7);
 if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0, month };
 monthlyData[month].expenses += exp.amount || 0;
 });

 const months = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

 return successResponse(res, { months });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch monthly data', 500);
 }
});

export default router;
