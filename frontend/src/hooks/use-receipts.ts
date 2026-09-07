"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
 get,
 post,
 put,
 del,
 postFormData,
} from "@/lib/api";
import type { Receipt, ReceiptItem } from "@/lib/types";
import { receiptSchema } from "@/lib/validators/schemas";

async function mockFetchReceipts(): Promise<Receipt[]> {
 await new Promise((r) => setTimeout(r, 600));
 return [
 {
 id: "r1",
 userId: "u1",
 imageUrl: "",
 vendor: "Reliance Fresh",
 date: "2025-09-04",
 amount: 2450.75,
 items: [{ name: "Groceries", quantity: 1, price: 2450.75 }],
 category: "Supplies",
 confidence: 0.92,
 createdAt: "2025-09-04T10:30:00Z",
 },
 {
 id: "r2",
 userId: "u1",
 imageUrl: "",
 vendor: "Indian Oil",
 date: "2025-09-02",
 amount: 3200.0,
 items: [{ name: "Fuel", quantity: 1, price: 3200 }],
 category: "Transport",
 confidence: 0.88,
 createdAt: "2025-09-02T08:15:00Z",
 },
 {
 id: "r3",
 userId: "u1",
 imageUrl: "",
 vendor: "Mahanagar Gas",
 date: "2025-08-30",
 amount: 890.5,
 items: [{ name: "Gas Bill", quantity: 1, price: 890.5 }],
 category: "Utilities",
 confidence: 0.95,
 createdAt: "2025-08-30T14:00:00Z",
 },
 ];
}

async function mockScanReceipt(
 data: { imageUrl: string }
): Promise<{ receipt: Receipt; confidence: number }> {
 await new Promise((r) => setTimeout(r, 1500));
 const parsed = receiptSchema.parse({
 vendor: data.imageUrl ? "Detected Vendor" : "Unknown Vendor",
 date: new Date().toISOString().split("T")[0],
 amount: Math.round(Math.random() * 5000 + 500),
 items: [],
 });
 return { receipt: parsed as unknown as Receipt, confidence: 0.87 };
}

export function useReceipts() {
 return useQuery({
 queryKey: ["receipts"],
 queryFn: mockFetchReceipts,
 });
}

export function useScanReceipt() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: mockScanReceipt,
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ["receipts"] });
 },
 });
}
