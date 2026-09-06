import { Request, Response } from 'express';
import { supabaseAdmin } from '../../utils/storage';
import { successResponse, errorResponse } from '../../utils/response';

export async function handleForgotPassword(
 req: Request,
 res: Response
): Promise<Response | void> {
 try {
 const { email } = req.body;

 const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
 redirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/reset-password`,
 });

 if (error) {
 return errorResponse(res, 'DATABASE_ERROR', error.message, 500);
 }

 return successResponse(res, { message: 'Password reset email sent' });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to send reset email', 500);
 }
}
