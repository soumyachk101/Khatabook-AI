import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * POST /api/ai/categorize
 *
 * Auto-categorizes an expense using AI.
 * Body: { description, amount, vendorName?, vendorGstin?, previousCategoryId?, businessId? }
 */
export async function POST(request: NextRequest) {
 try {
 const body = await request.json();

 // Validate required fields
 if (!body.description || typeof body.description !== 'string') {
 return NextResponse.json(
 { error: 'Missing or invalid "description"', code: 'MISSING_DESCRIPTION' },
 { status: 400 }
 );
 }

 if (typeof body.amount !== 'number') {
 return NextResponse.json(
 { error: 'Missing or invalid "amount"', code: 'MISSING_AMOUNT' },
 { status: 400 }
 );
 }

 const authHeader = request.headers.get('authorization');

 const backendResponse = await fetch(`${API_URL}/api/ai/categorize`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 ...(authHeader ? { Authorization: authHeader } : {}),
 },
 body: JSON.stringify(body),
 });

 let backendData: unknown;
 const backendText = await backendResponse.text();
 try {
 backendData = JSON.parse(backendText);
 } catch {
 backendData = { message: backendText };
 }

 return NextResponse.json(backendData, { status: backendResponse.status });
 } catch (error: unknown) {
 console.error('/api/ai/categorize proxy error:', error);
 return NextResponse.json(
 {
 error: 'Failed to categorize expense',
 code: 'PROXY_ERROR',
 details: error instanceof Error ? error.message : 'Unknown error',
 },
 { status: 500 }
 );
 }
}
