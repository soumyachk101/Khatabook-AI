import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/storage';

export interface AuthenticatedRequest extends Request {
 user?: {
 id: string;
 email: string;
 phone?: string;
 role?: string;
 };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function authMiddleware(
 req: AuthenticatedRequest,
 res: Response,
 next: NextFunction
): void {
 const authHeader = req.headers.authorization;

 if (!authHeader || !authHeader.startsWith('Bearer ')) {
 res.status(401).json({
 success: false,
 error: {
 code: 'AUTH_REQUIRED',
 message: 'Missing or invalid authorization token',
 },
 });
 return;
 }

 const token = authHeader.substring(7);

 try {
 // Verify JWT
 const decoded = jwt.verify(token, JWT_SECRET) as {
 id: string;
 email: string;
 phone?: string;
 };

 // Attach user to request
 req.user = decoded;
 next();
 } catch (error) {
 res.status(401).json({
 success: false,
 error: {
 code: 'AUTH_INVALID',
 message: 'Invalid or expired token',
 },
 });
 }
}

export function optionalAuth(
 req: AuthenticatedRequest,
 res: Response,
 next: NextFunction
): void {
 const authHeader = req.headers.authorization;

 if (!authHeader || !authHeader.startsWith('Bearer ')) {
 next();
 return;
 }

 const token = authHeader.substring(7);

 try {
 const decoded = jwt.verify(token, JWT_SECRET) as {
 id: string;
 email: string;
 phone?: string;
 };
 req.user = decoded;
 } catch {
 // Ignore invalid token for optional auth
 }

 next();
}

export function requireRole(...allowedRoles: string[]) {
 return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
 if (!req.user?.role) {
 res.status(403).json({
 success: false,
 error: {
 code: 'FORBIDDEN',
 message: 'Insufficient permissions',
 },
 });
 return;
 }

 if (!allowedRoles.includes(req.user.role)) {
 res.status(403).json({
 success: false,
 error: {
 code: 'FORBIDDEN',
 message: 'You do not have permission to perform this action',
 },
 });
 return;
 }

 next();
 };
}
