import { Router } from 'express';
import { supabaseAdmin } from '../../utils/storage';
import { successResponse, errorResponse } from '../../utils/response';
import { reminderCreateSchema } from '../../utils/validators';
import { z } from 'zod';

const router = Router();

router.get('/', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const { status, page = '1', limit = '20' } = req.query;

 const pageNum = parseInt(page as string, 10);
 const limitNum = Math.min(parseInt(limit as string, 10), 100);

 let query = supabaseAdmin
 .from('reminders')
 .select('*', { count: 'exact' })
 .eq('user_id', userId)
 .order('scheduled_at', { ascending: false });

 if (status) query = query.eq('status', status as string);

 const fromIdx = (pageNum - 1) * limitNum;
 const toIdx = fromIdx + limitNum - 1;

 const { data, error, count } = await query.range(fromIdx, toIdx);

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, {
 items: data || [],
 pagination: { page: pageNum, limit: limitNum, total: count || 0, pages: Math.ceil((count || 0) / limitNum) },
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to list reminders', 500);
 }
});

router.post('/', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const validated = reminderCreateSchema.parse(req.body);

 const { data, error } = await supabaseAdmin
 .from('reminders')
 .insert({
 ...validated,
 user_id: userId,
 status: 'scheduled',
 })
 .select()
 .single();

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, data, 201);
 } catch (error) {
 if (error instanceof z.ZodError) {
 return errorResponse(res, 'VALIDATION_ERROR', 'Invalid input', 422, error.flatten().fieldErrors);
 }
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to create reminder', 500);
 }
});

router.post('/:id/cancel', async (req: any, res: any) => {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data, error } = await supabaseAdmin
 .from('reminders')
 .update({ status: 'cancelled', updated_at: new Date().toISOString() })
 .eq('id', id)
 .eq('user_id', userId)
 .select()
 .single();

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, data);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to cancel reminder', 500);
 }
});

router.delete('/:id', async (req: any, res: any) => {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { error } = await supabaseAdmin
 .from('reminders')
 .delete()
 .eq('id', id)
 .eq('user_id', userId);

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, { message: 'Reminder deleted' });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to delete reminder', 500);
 }
});

export default router;
