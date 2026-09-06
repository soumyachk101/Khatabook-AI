import { Router } from 'express';
import { supabaseAdmin } from '../../utils/storage';
import { successResponse, errorResponse } from '../../utils/response';
import { categoryCreateSchema } from '../../utils/validators';
import { z } from 'zod';

const router = Router();

router.get('/', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const { type } = req.query;

 let query = supabaseAdmin
 .from('categories')
 .select('*')
 .or(`is_system_default.eq.true,owner_id.eq.${userId}`)
 .eq('is_active', true);

 if (type) query = query.eq('type', type as string);

 const { data, error } = await query;

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, { items: data || [] });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to list categories', 500);
 }
});

router.post('/', async (req: any, res: any) => {
 try {
 const userId = req.user?.id;
 const validated = categoryCreateSchema.parse(req.body);

 const { data, error } = await supabaseAdmin
 .from('categories')
 .insert({
 ...validated,
 owner_id: userId,
 slug: validated.name.toLowerCase().replace(/\s+/g, '-'),
 is_system_default: false,
 })
 .select()
 .single();

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, data, 201);
 } catch (error) {
 if (error instanceof z.ZodError) {
 return errorResponse(res, 'VALIDATION_ERROR', 'Invalid input', 422, error.flatten().fieldErrors);
 }
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to create category', 500);
 }
});

router.patch('/:id', async (req: any, res: any) => {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data, error } = await supabaseAdmin
 .from('categories')
 .update({ ...req.body, updated_at: new Date().toISOString() })
 .eq('id', id)
 .eq('owner_id', userId)
 .select()
 .single();

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, data);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to update category', 500);
 }
});

router.delete('/:id', async (req: any, res: any) => {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 // Check if system default
 const { data: cat } = await supabaseAdmin
 .from('categories')
 .select('is_system_default')
 .eq('id', id)
 .single();

 if (cat?.is_system_default) {
 return errorResponse(res, 'CONFLICT', 'Cannot delete system categories', 409);
 }

 const { error } = await supabaseAdmin
 .from('categories')
 .delete()
 .eq('id', id)
 .eq('owner_id', userId);

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, { message: 'Category deleted' });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to delete category', 500);
 }
});

export default router;
