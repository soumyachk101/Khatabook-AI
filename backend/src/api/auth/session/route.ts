import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../utils/storage';
import { successResponse, errorResponse } from '../../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function handleSession(
 req: Request,
 res: Response
): Promise<Response | void> {
 try {
 const token = req.headers.authorization?.replace('Bearer ', '');

 if (!token) {
 return errorResponse(res, 'AUTH_REQUIRED', 'No token provided', 401);
 }

 try {
 const decoded = jwt.verify(token, JWT_SECRET) as {
 id: string;
 email: string;
 };

 const { data: profile } = await supabaseAdmin
 .from('profiles')
 .select('*')
 .eq('id', decoded.id)
 .single();

 return successResponse(res, {
 user: { id: decoded.id, email: decoded.email },
 profile: profile || null,
 valid: true,
 });
 } catch {
 return errorResponse(res, 'AUTH_INVALID', 'Invalid or expired token', 401);
 }
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Session check failed', 500);
 }
}
