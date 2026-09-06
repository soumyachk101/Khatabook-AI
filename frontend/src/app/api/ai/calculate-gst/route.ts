import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * POST /api/ai/calculate-gst
 *
 * Calculates CGST/SGST/IGST breakdown for a given subtotal and rate.
 * Body: { subtotal, gstRate, supplierGstin?, recipientGstin?, placeOfSupply? }
 */
export async function POST(request: NextRequest) {
 try {
 const body = await request.json();

 if (typeof body.subtotal !== 'number') {
 return NextResponse.json(
 { error: 'Missing or invalid "subtotal"', code: 'MISSING_SUBTOTAL' },
 { status: 400 }
 );
 }

 if (typeof body.gstRate !== 'number') {
 return NextResponse.json(
 { error: 'Missing or invalid "gstRate"', code: 'MISSING_GST_RATE' },
 { status: 400 }
 );
 }

 const authHeader = request.headers.get('authorization');

 const backendResponse = await fetch(`${API_URL}/api/ai/calculate-gst`, {
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
 console.error('/api/ai/calculate-gst proxy error:', error);
 return NextResponse.json(
 {
 error: 'Failed to calculate GST',
 code: 'PROXY_ERROR',
 details: error instanceof Error ? error.message : 'Unknown error',
 },
 { status: 500 }
 );
 }
}
