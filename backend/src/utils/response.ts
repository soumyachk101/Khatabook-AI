import { Response } from 'express';
import { ApiResponse } from '../types';

export function successResponse<T>(
 res: Response,
 data: T,
 statusCode: number = 200
): Response<ApiResponse<T>> {
 return res.status(statusCode).json({
 success: true,
 data,
 error: null,
 });
}

export function errorResponse(
 res: Response,
 code: string,
 message: string,
 statusCode: number = 400,
 details?: Record<string, unknown>
): Response<ApiResponse> {
 return res.status(statusCode).json({
 success: false,
 data: null,
 error: {
 code,
 message,
 details,
 },
 });
}

export function paginatedResponse<T>(
 res: Response,
 items: T[],
 total: number,
 page: number,
 limit: number
): Response<ApiResponse> {
 return successResponse(res, {
 items,
 pagination: {
 page,
 limit,
 total,
 pages: Math.ceil(total / limit),
 },
 });
}

// Backward-compatible aliases for existing code
export const success = successResponse;
export const error = errorResponse;
export class Errors {
 static VALIDATION_ERROR = 'VALIDATION_ERROR';
 static NOT_FOUND = 'NOT_FOUND';
 static DATABASE_ERROR = 'DATABASE_ERROR';
 static AUTH_REQUIRED = 'AUTH_REQUIRED';
 static AUTH_INVALID = 'AUTH_INVALID';
}
