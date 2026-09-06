import { Router } from 'express';
import { supabaseAdmin } from '../../../../../utils/storage';
import { errorResponse } from '../../../../../utils/response';

const router = Router();

router.get('/csv', async (req: any, res: any) => {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data: gstReturn, error } = await supabaseAdmin
 .from('gst_returns')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (error || !gstReturn) return errorResponse(res, 'NOT_FOUND', 'GST return not found', 404);

 const headers = ['Financial Year', 'Quarter', 'Period Start', 'Period End', 'Taxable Value', 'CGST', 'SGST', 'IGST', 'Input CGST', 'Input SGST', 'Input IGST', 'Net CGST', 'Net SGST', 'Net IGST', 'Total Liability', 'Status'];
 const row = [
 gstReturn.financial_year,
 gstReturn.quarter,
 gstReturn.quarter_start_date,
 gstReturn.quarter_end_date,
 gstReturn.total_taxable_value?.toString() || '0',
 gstReturn.total_cgst?.toString() || '0',
 gstReturn.total_sgst?.toString() || '0',
 gstReturn.total_igst?.toString() || '0',
 gstReturn.input_cgst?.toString() || '0',
 gstReturn.input_sgst?.toString() || '0',
 gstReturn.input_igst?.toString() || '0',
 gstReturn.net_cgst?.toString() || '0',
 gstReturn.net_sgst?.toString() || '0',
 gstReturn.net_igst?.toString() || '0',
 gstReturn.gstr3b_total_liability?.toString() || '0',
 gstReturn.filing_status,
 ];

 const csv = [headers.join(','), row.join(',')].join('\n');

 res.setHeader('Content-Type', 'text/csv');
 res.setHeader('Content-Disposition', `attachment; filename="gst-${gstReturn.financial_year}-${gstReturn.quarter}.csv"`);
 res.send(csv);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Export failed', 500);
 }
});

export default router;
