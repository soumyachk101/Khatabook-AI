import { Router } from 'express';
import { supabaseAdmin } from '../../../utils/storage';
import { successResponse, errorResponse } from '../../../utils/response';

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
 const { name, type, description, icon, color, parent_id, category_group, hsn_code, gst_rate } = req.body;

 const slug = name.toLowerCase().replace(/\s+/g, '-');

 const { data, error } = await supabaseAdmin
 .from('categories')
 .insert({
 owner_id: userId,
 name,
 slug,
 description,
 icon: icon || '',
 color: color || '#6B7280',
 type,
 parent_id,
 category_group,
 hsn_code,
 gst_rate: gst_rate || 0,
 is_system_default: false,
 is_active: true,
 })
 .select()
 .single();

 if (error) return errorResponse(res, 'DATABASE_ERROR', error.message, 500);

 return successResponse(res, data, 201);
 } catch (error) {
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
