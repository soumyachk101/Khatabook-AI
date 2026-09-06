import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
 try {
 const { data, error } = await supabase
 .from('gst_returns')
 .select('*')
 .order('created_at', { ascending: false });

 if (error) {
 return NextResponse.json({ error: error.message }, { status: 400 });
 }

 return NextResponse.json(data);
 } catch (error) {
 return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
 }
}

export async function POST(request: NextRequest) {
 try {
 const body = await request.json();
 const { userId, businessId, quarter, year, returnType } = body;

 if (!userId || !quarter || !year || !returnType) {
 return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
 }

 const { data, error } = await supabase
 .from('gst_returns')
 .insert({
 user_id: userId,
 business_id: businessId,
 quarter,
 year,
 return_type: returnType,
 })
 .select()
 .single();

 if (error) {
 return NextResponse.json({ error: error.message }, { status: 400 });
 }

 return NextResponse.json(data, { status: 201 });
 } catch (error) {
 return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
 }
}
