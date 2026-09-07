"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Invoice } from "@/lib/types";

async function mockFetchInvoices(): Promise<Invoice[]> {
 await new Promise((r) => setTimeout(r, 500));
 return [
 {
 id: "inv1",
 userId: "u1",
 customer: { id: "c1", userId: "u1", name: "Tata Consultancy Services", email: "billing@tcs.com", phone: "+919876543210", address: "TCS House", state: "Maharashtra", createdAt: "" },
 items: [],
 subtotal: 50000,
 taxAmount: 9000,
 discountAmount: 0,
 total: 59000,
 status: "sent",
 dueDate: "2025-09-15",
 issueDate: "2025-09-01",
 placeOfSupply: "Maharashtra",
 createdAt: "2025-09-01T00:00:00Z",
 updatedAt: "2025-09-01T00:00:00Z",
 },
 {
 id: "inv2",
 userId: "u1",
 customer: { id: "c2", userId: "u1", name: "Infosys Ltd", email: "accounts@infosys.com", phone: "+919876543211", address: "Infosys Campus", state: "Karnataka", createdAt: "" },
 items: [],
 subtotal: 75000,
 taxAmount: 13500,
 discountAmount: 2000,
 total: 86500,
 status: "paid",
 dueDate: "2025-09-10",
 issueDate: "2025-08-25",
 placeOfSupply: "Karnataka",
 createdAt: "2025-08-25T00:00:00Z",
 updatedAt: "2025-08-30T00:00:00Z",
 },
 {
 id: "inv3",
 userId: "u1",
 customer: { id: "c3", userId: "u1", name: "Wipro Ltd", email: "billing@wipro.com", phone: "+919876543212", address: "Wipro Campus", state: "Karnataka", createdAt: "" },
 items: [],
 subtotal: 42000,
 taxAmount: 7560,
 discountAmount: 0,
 total: 49560,
 status: "overdue",
 dueDate: "2025-08-31",
 issueDate: "2025-08-15",
 placeOfSupply: "Karnataka",
 createdAt: "2025-08-15T00:00:00Z",
 updatedAt: "2025-08-31T00:00:00Z",
 },
 ];
}

export function useInvoices() {
 return useQuery({
 queryKey: ["invoices"],
 queryFn: mockFetchInvoices,
 });
}

export function useInvoice(id: string) {
 return useQuery({
 queryKey: ["invoices", id],
 queryFn: async () => {
 const invoices = await mockFetchInvoices();
 return invoices.find((i) => i.id === id) || null;
 },
 enabled: !!id,
 });
}
