"use client";

import { useQuery } from "@tanstack/react-query";
import type { Expense } from "@/lib/types";

async function mockFetchExpenses(): Promise<Expense[]> {
 await new Promise((r) => setTimeout(r, 500));
 return [
 { id: "e1", userId: "u1", amount: 12000, category: { id: "c1", name: "Rent", icon: "🏠", color: "#6366F1", type: "expense" }, description: "Office rent", date: "2025-09-01", paymentMethod: "bank", tags: ["monthly"], createdAt: "" },
 { id: "e2", userId: "u1", amount: 3200, category: { id: "c2", name: "Fuel", icon: "⛽", color: "#F59E0B", type: "expense" }, description: "Vehicle fuel", date: "2025-09-02", paymentMethod: "upi", tags: [], createdAt: "" },
 { id: "e3", userId: "u1", amount: 890, category: { id: "c3", name: "Utilities", icon: "💡", color: "#10B981", type: "expense" }, description: "Electricity bill", date: "2025-09-03", paymentMethod: "upi", tags: [], createdAt: "" },
 { id: "e4", userId: "u1", amount: 5600, category: { id: "c4", name: "Supplies", icon: "📦", color: "#EF4444", type: "expense" }, description: "Office supplies", date: "2025-09-04", paymentMethod: "card", tags: [], createdAt: "" },
 ];
}

export function useExpenses() {
 return useQuery({
 queryKey: ["expenses"],
 queryFn: mockFetchExpenses,
 });
}
