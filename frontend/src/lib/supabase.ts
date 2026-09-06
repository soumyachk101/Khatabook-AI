import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
 public: {
 Tables: {
 users: {
 Row: {
 id: string;
 email: string;
 name: string;
 phone?: string;
 plan: string;
 created_at: string;
 };
 Insert: {
 id?: string;
 email: string;
 name: string;
 phone?: string;
 plan?: string;
 created_at?: string;
 };
 Update: {
 email?: string;
 name?: string;
 phone?: string;
 plan?: string;
 };
 };
 receipts: {
 Row: {
 id: string;
 user_id: string;
 business_id?: string;
 image_url: string;
 raw_text?: string;
 extracted_data: any;
 category: string;
 amount: number;
 date: string;
 vendor?: string;
 gst_details?: any;
 created_at: string;
 };
 Insert: {
 id?: string;
 user_id: string;
 business_id?: string;
 image_url: string;
 raw_text?: string;
 extracted_data: any;
 category: string;
 amount: number;
 date: string;
 vendor?: string;
 gst_details?: any;
 created_at?: string;
 };
 };
 invoices: {
 Row: {
 id: string;
 user_id: string;
 business_id?: string;
 invoice_number: string;
 client_name: string;
 client_gstin?: string;
 items: any;
 subtotal: number;
 cgst: number;
 sgst: number;
 igst: number;
 total: number;
 status: string;
 due_date: string;
 created_at: string;
 };
 Insert: {
 id?: string;
 user_id: string;
 business_id?: string;
 invoice_number: string;
 client_name: string;
 client_gstin?: string;
 items: any;
 subtotal: number;
 cgst: number;
 sgst: number;
 igst: number;
 total: number;
 status?: string;
 due_date: string;
 created_at?: string;
 };
 };
 expenses: {
 Row: {
 id: string;
 user_id: string;
 business_id?: string;
 category: string;
 amount: number;
 description: string;
 receipt_url?: string;
 date: string;
 created_at: string;
 };
 Insert: {
 id?: string;
 user_id: string;
 business_id?: string;
 category: string;
 amount: number;
 description: string;
 receipt_url?: string;
 date: string;
 created_at?: string;
 };
 };
 };
 };
};
