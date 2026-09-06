import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * POST /api/ai/insights
 *
 * Generates spending insights and tax saving suggestions.
 * Body: { type: 'spending' | 'tax', period?, businessId?, ...params }
 */
export async function POST(request: NextRequest) {
 try {
 const body = await request.json();

 if (!body.type || !['spending', 'tax'].includes(body.type)) {
 return NextResponse.json(
 { error: 'Missing or invalid "type". Must be "spending" or "tax"', code: 'INVALID_TYPE' },
 { status: 400 }
 );
 }

 const authHeader = request.headers.get('authorization');

 const backendResponse = await fetch(`${API_URL}/api/ai/insights`, {
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
 console.error('/api/ai/insights proxy error:', error);
 return NextResponse.json(
 {
 error: 'Failed to generate insights',
 code: 'PROXY_ERROR',
 details: error instanceof Error ? error.message : 'Unknown error',
 },
 { status: 500 }
 );
 }
}
