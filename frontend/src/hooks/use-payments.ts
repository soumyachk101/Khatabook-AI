"use client";

import { useQuery } from "@tanstack/react-query";
import type { Payment, PaymentLink } from "@/lib/types";

async function mockFetchPayments(): Promise<Payment[]> {
 await new Promise((r) => setTimeout(r, 500));
 return [
 { id: "p1", userId: "u1", invoiceId: "inv2", amount: 86500, method: "upi", upiTransactionId: "UPI123456789", status: "completed", paidAt: "2025-09-05T10:30:00Z", createdAt: "2025-09-05T10:30:00Z" },
 { id: "p2", userId: "u1", invoiceId: "inv1", amount: 59000, method: "upi", upiTransactionId: "", status: "pending", createdAt: "2025-09-02T00:00:00Z" },
 ];
}

async function mockFetchPaymentLinks(): Promise<PaymentLink[]> {
 await new Promise((r) => setTimeout(r, 500));
 return [
 { id: "pl1", userId: "u1", invoiceId: "inv1", amount: 59000, link: "https://pay.khatabook.ai/pl1", qrCode: "", upiId: "business@upi", status: "active", createdAt: "2025-09-01T00:00:00Z" },
 ];
}

export function usePayments() {
 return useQuery({
 queryKey: ["payments"],
 queryFn: mockFetchPayments,
 });
}

export function usePaymentLinks() {
 return useQuery({
 queryKey: ["payment-links"],
 queryFn: mockFetchPaymentLinks,
 });
}
