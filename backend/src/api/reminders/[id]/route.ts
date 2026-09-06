import { Router } from 'express';
import { supabaseAdmin } from '../../../utils/storage';
import { successResponse, errorResponse } from '../../../utils/response';

const router = Router();

router.get('/:id', async (req: any, res: any) => {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data, error } = await supabaseAdmin
 .from('reminders')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .single();

 if (error || !data) return errorResponse(res, 'NOT_FOUND', 'Reminder not found', 404);

 return successResponse(res, data);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch reminder', 500);
 }
});

export default router;
