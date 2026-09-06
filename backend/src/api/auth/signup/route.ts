import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../../utils/storage';
import { successResponse, errorResponse } from '../../utils/response';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function handleSignup(req: Request, res: Response): Promise<Response | void> {
 try {
 const { email, password, name, phone, language } = req.body;

 if (!email || !password || !name) {
 return errorResponse(res, 'VALIDATION_ERROR', 'email, password, and name are required', 422);
 }

 const { data: existing } = await supabaseAdmin
 .from('profiles')
 .select('id')
 .or(`email.eq.${email}`)
 .limit(1);

 if (existing && existing.length > 0) {
 return errorResponse(res, 'DUPLICATE_RESOURCE', 'Email already registered', 409);
 }

 const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
 email,
 password,
 email_confirm: true,
 user_metadata: { full_name: name, phone, language },
 });

 if (authError || !authData.user) {
 return errorResponse(res, 'AUTH_ERROR', authError?.message || 'Failed to create user', 400);
 }

 const { data: profile } = await supabaseAdmin
 .from('profiles')
 .insert({
 id: authData.user.id,
 full_name: name,
 phone,
 preferred_language: language || 'en',
 email_verified: false,
 onboarding_completed: false,
 subscription_plan: 'free',
 ai_credits_used: 0,
 ai_credits_limit: 50,
 })
 .select()
 .single();

 const token = jwt.sign(
 { id: authData.user.id, email: authData.user.email!, phone },
 JWT_SECRET,
 { expiresIn: '7d' }
 );

 return successResponse(res, {
 user: { id: authData.user.id, email: authData.user.email!, name, phone },
 session: { access_token: token, expires_in: 604800 },
 profile: { onboarding_completed: false, plan: 'free' },
 }, 201);
 } catch (error) {
 return errorResponse(res, 'INTERNAL_ERROR', error instanceof Error ? error.message : 'Signup failed', 500);
 }
}
