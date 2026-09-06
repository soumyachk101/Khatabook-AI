import { Router } from 'express';
import { supabaseAdmin } from '../../../utils/storage';
import { successResponse, errorResponse } from '../../../utils/response';

const router = Router();

router.get('/stats', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const { business_id } = req.query;

 const startDate = new Date();
 startDate.setDate(1);
 const startStr = startDate.toISOString().split('T')[0];
 const endStr = new Date().toISOString().split('T')[0];

 let invQuery = supabaseAdmin
 .from('invoices')
 .select('grand_total, status')
 .eq('user_id', userId)
 .gte('invoice_date', startStr)
 .lte('invoice_date', endStr);

 if (business_id) invQuery = invQuery.eq('business_id', business_id);
 const { data: invoices } = await invQuery;

 let expQuery = supabaseAdmin
 .from('expenses')
 .select('amount')
 .eq('user_id', userId)
 .gte('expense_date', startStr)
 .lte('expense_date', endStr)
 .is('deleted_at', null);

 if (business_id) expQuery = expQuery.eq('business_id', business_id);
 const { data: expenses } = await expQuery;

 const totalRevenue = (invoices || []).reduce((sum: number, i: any) => sum + (i.grand_total || 0), 0);
 const totalExpenses = (expenses || []).reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
 const paidInvoices = (invoices || []).filter((i: any) => i.status === 'paid').length;
 const pendingInvoices = (invoices || []).filter((i: any) => i.status === 'sent' || i.status === 'partial').length;
 const overdueInvoices = (invoices || []).filter((i: any) => i.status === 'overdue').length;

 const invoicesByStatus = (invoices || []).reduce((acc: any, i: any) => {
 acc[i.status] = (acc[i.status] || 0) + 1;
 return acc;
 }, {});

 return successResponse(res, {
 period: { from: startStr, to: endStr },
 revenue: {
 total: totalRevenue,
 paid: totalRevenue,
 },
 expenses: {
 total: totalExpenses,
 },
 profit: totalRevenue - totalExpenses,
 invoices: {
 total: (invoices || []).length,
 paid: paidInvoices,
 pending: pendingInvoices,
 overdue: overdueInvoices,
 by_status: invoicesByStatus,
 },
 expense_count: (expenses || []).length,
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch stats', 500);
 }
});

export default router;
