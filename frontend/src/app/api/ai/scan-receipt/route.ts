import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * POST /api/ai/scan-receipt
 *
 * Uploads a receipt image to the backend for AI OCR scanning.
 * Accepts multipart/form-data with an "image" file field.
 */
export async function POST(request: NextRequest) {
 try {
 // Check that the request is multipart
 const contentType = request.headers.get('content-type') || '';
 if (!contentType.includes('multipart/form-data')) {
 return NextResponse.json(
 { error: 'Content-Type must be multipart/form-data', code: 'INVALID_CONTENT_TYPE' },
 { status: 415 }
 );
 }

 const formData = await request.formData();
 const imageFile = formData.get('image') as File | null;
 const mimeType = formData.get('mimeType') as string | null;
 const receiptId = formData.get('receiptId') as string | null;
 const businessId = formData.get('businessId') as string | null;

 if (!imageFile) {
 return NextResponse.json(
 { error: 'Missing "image" file in request body', code: 'MISSING_IMAGE' },
 { status: 400 }
 );
 }

 // Get auth token from header (session cookie or Authorization header)
 const authHeader = request.headers.get('authorization');

 // Forward to backend
 const backendForm = new FormData();
 backendForm.append('image', imageFile);
 if (mimeType) backendForm.append('mimeType', mimeType);
 if (receiptId) backendForm.append('receiptId', receiptId);
 if (businessId) backendForm.append('businessId', businessId);

 const backendUrl = `${API_URL}/api/ai/scan-receipt`;

 const backendResponse = await fetch(backendUrl, {
 method: 'POST',
 headers: {
 ...(authHeader ? { Authorization: authHeader } : {}),
 },
 body: backendForm,
 });

 // Try to parse backend response
 let backendData: unknown;
 const backendText = await backendResponse.text();
 try {
 backendData = JSON.parse(backendText);
 } catch {
 backendData = { message: backendText };
 }

 return NextResponse.json(backendData, { status: backendResponse.status });
 } catch (error: unknown) {
 console.error('/api/ai/scan-receipt proxy error:', error);
 return NextResponse.json(
 {
 error: 'Failed to scan receipt',
 code: 'PROXY_ERROR',
 details: error instanceof Error ? error.message : 'Unknown error',
 },
 { status: 500 }
 );
 }
}
