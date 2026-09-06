import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../utils/storage';
import { successResponse, errorResponse } from '../../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function handleMe(
 req: Request,
 res: Response
): Promise<Response | void> {
 try {
 const authHeader = req.headers.authorization;

 if (!authHeader?.startsWith('Bearer ')) {
 return errorResponse(res, 'AUTH_REQUIRED', 'No token provided', 401);
 }

 const token = authHeader.substring(7);

 try {
 const decoded = jwt.verify(token, JWT_SECRET) as {
 id: string;
 email: string;
 };

 const { data: profile, error } = await supabaseAdmin
 .from('profiles')
 .select('*')
 .eq('id', decoded.id)
 .single();

 if (error || !profile) {
 return errorResponse(res, 'AUTH_INVALID', 'User not found', 404);
 }

 const { data: businesses } = await supabaseAdmin
 .from('businesses')
 .select('*')
 .eq('owner_id', decoded.id)
 .eq('is_active', true);

 return successResponse(res, {
 profile,
 businesses: businesses || [],
 });
 } catch {
 return errorResponse(res, 'AUTH_INVALID', 'Invalid or expired token', 401);
 }
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to fetch profile', 500);
 }
}
