import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
 constructor(
 public statusCode: number,
 public code: string,
 message: string,
 public details?: Record<string, unknown>
 ) {
 super(message);
 this.name = 'AppError';
 }
}

export function errorHandler(
 err: Error,
 req: Request,
 res: Response<ApiResponse>,
 next: NextFunction
): void {
 console.error('Error:', {
 message: err.message,
 stack: err.stack,
 url: req.url,
 method: req.method,
 body: req.body,
 });

 if (err instanceof AppError) {
 res.status(err.statusCode).json({
 success: false,
 error: {
 code: err.code,
 message: err.message,
 details: err.details,
 },
 });
 return;
 }

 // Handle known error types
 if (err.name === 'ValidationError') {
 res.status(422).json({
 success: false,
 error: {
 code: 'VALIDATION_ERROR',
 message: err.message,
 },
 });
 return;
 }

 if (err.name === 'UnauthorizedError') {
 res.status(401).json({
 success: false,
 error: {
 code: 'AUTH_INVALID',
 message: 'Unauthorized',
 },
 });
 return;
 }

 // Default error
 res.status(500).json({
 success: false,
 error: {
 code: 'INTERNAL_ERROR',
 message: 'An unexpected error occurred. Please try again later.',
 details: process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined,
 },
 });
}

export function notFoundHandler(
 req: Request,
 res: Response<ApiResponse>
): void {
 res.status(404).json({
 success: false,
 error: {
 code: 'NOT_FOUND',
 message: `Route ${req.method} ${req.path} not found`,
 },
 });
}

// Backward-compatible async handler wrapper
export function asyncHandler(
 fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
 return (req: Request, res: Response, next: NextFunction) => {
 Promise.resolve(fn(req, res, next)).catch((error) => errorHandler(error, req, res, next));
 };
}
