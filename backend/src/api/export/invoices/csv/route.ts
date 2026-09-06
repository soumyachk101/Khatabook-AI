import { Router } from 'express';
import { supabaseAdmin } from '../../../../utils/storage';
import { errorResponse } from '../../../../utils/response';

const router = Router();

router.get('/csv', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const { from, to, business_id, status } = req.query;

 let query = supabaseAdmin
 .from('invoices')
 .select('*')
 .eq('user_id', userId)
 .order('invoice_date', { ascending: false });

 if (from) query = query.gte('invoice_date', from as string);
 if (to) query = query.lte('invoice_date', to as string);
 if (business_id) query = query.eq('business_id', business_id as string);
 if (status) query = query.eq('status', status as string);

 const { data, error } = await query;

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 const headers = ['Invoice #', 'Date', 'Due Date', 'Client', 'GSTIN', 'Subtotal', 'CGST', 'SGST', 'IGST', 'Grand Total', 'Status'];
 const rows = (data || []).map((i) => [
 i.invoice_number,
 i.invoice_date,
 i.due_date,
 `"${(i.client_name || '').replace(/"/g, '""')}"`,
 i.client_gstin || '',
 i.sub_total?.toString() || '0',
 i.cgst_amount?.toString() || '0',
 i.sgst_amount?.toString() || '0',
 i.igst_amount?.toString() || '0',
 i.grand_total?.toString() || '0',
 i.status,
 ]);

 const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

 res.setHeader('Content-Type', 'text/csv');
 res.setHeader('Content-Disposition', `attachment; filename="invoices-${Date.now()}.csv"`);
 res.send(csv);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Export failed', 500);
 }
});

export default router;
