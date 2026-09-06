import { Router } from 'express';
import { supabaseAdmin } from '../../../../utils/storage';
import { errorResponse } from '../../../../utils/response';

const router = Router();

router.get('/csv', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const { from, to, business_id } = req.query;

 let query = supabaseAdmin
 .from('expenses')
 .select('*, categories(name)')
 .eq('user_id', userId)
 .is('deleted_at', null)
 .order('expense_date', { ascending: false });

 if (from) query = query.gte('expense_date', from as string);
 if (to) query = query.lte('expense_date', to as string);
 if (business_id) query = query.eq('business_id', business_id as string);

 const { data, error } = await query;

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 // Build CSV
 const headers = ['Date', 'Description', 'Category', 'Vendor', 'Amount', 'CGST', 'SGST', 'IGST', 'Payment Method', 'Notes'];
 const rows = (data || []).map((e: any) => [
 e.expense_date,
 `"${(e.description || '').replace(/"/g, '""')}"`,
 e.categories?.name || '',
 e.vendor_name || '',
 e.amount?.toString() || '0',
 e.cgst_amount?.toString() || '0',
 e.sgst_amount?.toString() || '0',
 e.igst_amount?.toString() || '0',
 e.payment_method || '',
 `"${(e.notes || '').replace(/"/g, '""')}"`,
 ]);

 const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

 res.setHeader('Content-Type', 'text/csv');
 res.setHeader('Content-Disposition', `attachment; filename="expenses-${Date.now()}.csv"`);
 res.send(csv);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Export failed', 500);
 }
});

export default router;
