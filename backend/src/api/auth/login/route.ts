import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../utils/storage';
import { successResponse, errorResponse } from '../../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function handleLogin(
 req: Request,
 res: Response
): Promise<Response | void> {
 try {
 const { email, password, phone, otp } = req.body;

 if ((!email || !password) && (!phone || !otp)) {
 return errorResponse(res, 'VALIDATION_ERROR', 'Email/password or phone/otp required', 422);
 }

 let userId: string;
 let userEmail: string;
 let userPhone: string;

 if (email && password) {
 const { data, error } = await supabaseAdmin.auth.signInWithPassword({
 email,
 password,
 });

 if (error || !data.user) {
 return errorResponse(res, 'AUTH_INVALID', 'Invalid email or password', 401);
 }

 userId = data.user.id;
 userEmail = data.user.email!;
 userPhone = data.user.phone || '';
 } else if (phone && otp) {
 const { data, error } = await supabaseAdmin.auth.verifyOtp({
 phone,
 token: otp,
 type: 'sms',
 });

 if (error || !data.user) {
 return errorResponse(res, 'AUTH_INVALID', 'Invalid or expired OTP', 401);
 }

 userId = data.user.id;
 userEmail = data.user.email!;
 userPhone = data.user.phone || '';
 } else {
 return errorResponse(res, 'VALIDATION_ERROR', 'Invalid credentials', 422);
 }

 const { data: profile } = await supabaseAdmin
 .from('profiles')
 .select('*')
 .eq('id', userId)
 .single();

 const token = jwt.sign(
 { id: userId, email: userEmail, phone: userPhone },
 JWT_SECRET,
 { expiresIn: '7d' }
 );

 return successResponse(res, {
 user: { id: userId, email: userEmail, phone: userPhone },
 session: {
 access_token: token,
 expires_in: 604800,
 },
 profile: profile || {
 onboarding_completed: false,
 subscription_plan: 'free',
 },
 });
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Login failed', 500);
 }
}
