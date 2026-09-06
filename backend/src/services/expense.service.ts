import { Expense } from '../types';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response';
import { supabaseAdmin } from '../utils/storage';
import { expenseCreateSchema } from '../utils/validators';
import { z } from 'zod';
import { parse } from 'csv-parse/sync';

// ============================================================
// Routes
// ============================================================

export async function handleCreateExpense(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const validated = expenseCreateSchema.parse(req.body);

 const { data: expense, error } = await supabaseAdmin
 .from('expenses')
 .insert({
 ...validated,
 user_id: userId,
 })
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, expense, 201);
 } catch (error) {
 if (error instanceof z.ZodError) {
 return errorResponse(res, 'VALIDATION_ERROR', 'Invalid request body', 422, error.flatten().fieldErrors);
 }
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to create expense', 500);
 }
}

export async function handleListExpenses(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const {
 page = '1',
 limit = '20',
 business_id,
 category_id,
 from,
 to,
 min_amount,
 max_amount,
 payment_method,
 sort = 'expense_date',
 order = 'desc',
 } = req.query;

 const pageNum = parseInt(page as string, 10);
 const limitNum = Math.min(parseInt(limit as string, 10), 100);

 let query = supabaseAdmin
 .from('expenses')
 .select('*', { count: 'exact' })
 .eq('user_id', userId as string)
 .is('deleted_at', null)
 .order(sort as string, { ascending: order === 'asc' });

 if (business_id) query = query.eq('business_id', business_id as string);
 if (category_id) query = query.eq('category_id', category_id as string);
 if (from) query = query.gte('expense_date', from as string);
 if (to) query = query.lte('expense_date', to as string);
 if (min_amount) query = query.gte('amount', parseFloat(min_amount as string));
 if (max_amount) query = query.lte('amount', parseFloat(max_amount as string));
 if (payment_method) query = query.eq('payment_method', payment_method as string);

 const fromIdx = (pageNum - 1) * limitNum;
 const toIdx = fromIdx + limitNum - 1;

 const { data, error, count } = await query.range(fromIdx, toIdx);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return paginatedResponse(res, data || [], count || 0, pageNum, limitNum);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to list expenses', 500);
 }
}

export async function handleGetExpense(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data: expense, error } = await supabaseAdmin
 .from('expenses')
 .select('*')
 .eq('id', id)
 .eq('user_id', userId)
 .is('deleted_at', null)
 .single();

 if (error || !expense) {
 return errorResponse(res, 'NOT_FOUND', 'Expense not found', 404);
 }

 return successResponse(res, expense);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch expense', 500);
 }
}

export async function handleUpdateExpense(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 const { data: expense, error } = await supabaseAdmin
 .from('expenses')
 .update({
 ...req.body,
 updated_at: new Date().toISOString(),
 })
 .eq('id', id)
 .eq('user_id', userId)
 .select()
 .single();

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, expense);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to update expense', 500);
 }
}

export async function handleDeleteExpense(
 req: any,
 res: any
): Promise<any> {
 try {
 const { id } = req.params;
 const userId = req.user?.id;

 // Soft delete
 const { error } = await supabaseAdmin
 .from('expenses')
 .update({
 deleted_at: new Date().toISOString(),
 updated_at: new Date().toISOString(),
 })
 .eq('id', id)
 .eq('user_id', userId);

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, { message: 'Expense deleted successfully' });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to delete expense', 500);
 }
}

export async function handleExpenseSummary(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;
 const { business_id, from, to } = req.query;

 const startDate = from || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
 const endDate = to || new Date().toISOString().split('T')[0];

 let query = supabaseAdmin
 .from('expenses')
 .select('amount, category_id, expense_date')
 .eq('user_id', userId as string)
 .is('deleted_at', null)
 .gte('expense_date', startDate)
 .lte('expense_date', endDate);

 if (business_id) query = query.eq('business_id', business_id as string);

 const { data: expenses, error } = await query;

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 const total = (expenses || []).reduce((sum, e) => sum + (e.amount || 0), 0);
 const count = (expenses || []).length;

 // Group by category
 const byCategory: Record<string, { total: number; count: number }> = {};
 (expenses || []).forEach((e) => {
 const cid = e.category_id || 'uncategorized';
 if (!byCategory[cid]) {
 byCategory[cid] = { total: 0, count: 0 };
 }
 byCategory[cid].total += e.amount || 0;
 byCategory[cid].count += 1;
 });

 return successResponse(res, {
 period: { from: startDate, to: endDate },
 total,
 count,
 average: count > 0 ? total / count : 0,
 by_category: byCategory,
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to generate summary', 500);
 }
}

export async function handleImportExpenses(
 req: any,
 res: any
): Promise<any> {
 try {
 const userId = req.user?.id;

 if (!req.file) {
 return errorResponse(res, 'VALIDATION_ERROR', 'CSV file is required', 422);
 }

 const businessId = req.body.business_id || req.query.business_id;
 const csvData = req.file.buffer.toString('utf-8');

 // Parse CSV
 const records = parse(csvData, {
 columns: true,
 skip_empty_lines: true,
 trim: true,
 });

 let imported = 0;
 let failed = 0;
 const errors: any[] = [];

 for (let i = 0; i < records.length; i++) {
 const record = records[i];

 try {
 // Validate basic fields
 if (!record.date || !record.description || !record.amount) {
 failed++;
 errors.push({ row: i + 2, error: 'Missing required fields', data: record });
 continue;
 }

 const amount = parseFloat(record.amount);
 if (isNaN(amount) || amount <= 0) {
 failed++;
 errors.push({ row: i + 2, error: 'Invalid amount', data: record });
 continue;
 }

 // Find or create category
 let categoryId = record.category_id;
 if (!categoryId && record.category) {
 const { data: existing } = await supabaseAdmin
 .from('categories')
 .select('id')
 .or(`name.ilike.${record.category},slug.eq.${record.category.toLowerCase().replace(/\s+/g, '-')}`)
 .limit(1);

 if (existing && existing.length > 0) {
 categoryId = existing[0].id;
 } else {
 // Create new category
 const { data: newCat } = await supabaseAdmin
 .from('categories')
 .insert({
 owner_id: userId,
 name: record.category,
 slug: record.category.toLowerCase().replace(/\s+/g, '-'),
 type: 'expense',
 })
 .select('id')
 .single();

 categoryId = newCat?.id;
 }
 }

 const { error } = await supabaseAdmin
 .from('expenses')
 .insert({
 user_id: userId,
 business_id: businessId,
 category_id: categoryId,
 description: record.description,
 amount,
 vendor_name: record.vendor_name,
 expense_date: record.date,
 payment_method: record.payment_method || null,
 notes: record.notes,
 tags: record.tags ? record.tags.split(',').map((t: string) => t.trim()) : [],
 });

 if (error) {
 failed++;
 errors.push({ row: i + 2, error: error.message, data: record });
 } else {
 imported++;
 }
 } catch (error) {
 failed++;
 errors.push({ row: i + 2, error: error instanceof Error ? error.message : 'Unknown error', data: record });
 }
 }

 return successResponse(res, {
 imported,
 failed,
 total: records.length,
 errors,
 message: `Import completed: ${imported} succeeded, ${failed} failed`,
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Import failed', 500);
 }
}
