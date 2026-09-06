import { Router } from 'express';
import { supabaseAdmin } from '../../../utils/storage';
import { successResponse, errorResponse } from '../../../utils/response';

const router = Router();

router.get('/categories', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const { type = 'expense', from, to, business_id } = req.query;

 const startDate = from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
 const endDate = to || new Date().toISOString().split('T')[0];

 if (type === 'expense') {
 let query = supabaseAdmin
 .from('expenses')
 .select('amount, category_id, categories(name, slug)')
 .eq('user_id', userId)
 .gte('expense_date', startDate)
 .lte('expense_date', endDate)
 .is('deleted_at', null);

 if (business_id) query = query.eq('business_id', business_id);
 const { data } = await query;

 const byCategory: Record<string, { name: string; total: number; count: number }> = {};
 const totalAmount = (data || []).reduce((sum: number, e: any) => sum + (e.amount || 0), 0);

 (data || []).forEach((e: any) => {
 const name = e.categories?.name || 'Uncategorized';
 if (!byCategory[name]) byCategory[name] = { name, total: 0, count: 0 };
 byCategory[name].total += e.amount || 0;
 byCategory[name].count += 1;
 });

 const categories = Object.values(byCategory)
 .map((c) => ({ ...c, percentage: totalAmount > 0 ? (c.total / totalAmount) * 100 : 0 }))
 .sort((a, b) => b.total - a.total);

 return successResponse(res, { categories, total: totalAmount });
 }

 return successResponse(res, { categories: [], total: 0 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch categories', 500);
 }
});

export default router;
