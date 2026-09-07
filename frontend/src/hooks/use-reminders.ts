"use client";

import { useQuery } from "@tanstack/react-query";
import type { Reminder } from "@/lib/types";

async function mockFetchReminders(): Promise<Reminder[]> {
 await new Promise((r) => setTimeout(r, 500));
 return [
 { id: "rem1", userId: "u1", invoiceId: "inv1", type: "payment", channel: "whatsapp", subject: "Payment Reminder", body: "Dear Customer, this is a gentle reminder for invoice INV-001 due on Sep 15.", schedule: { frequency: "weekly", startDate: "2025-09-08", time: "10:00" }, isActive: true, createdAt: "2025-09-01T00:00:00Z" },
 { id: "rem2", userId: "u1", type: "gst", channel: "email", subject: "GST Due", body: "GSTR-3B due date approaching.", schedule: { frequency: "monthly", startDate: "2025-09-01", time: "09:00" }, isActive: true, createdAt: "2025-08-01T00:00:00Z" },
 ];
}

export function useReminders() {
 return useQuery({
 queryKey: ["reminders"],
 queryFn: mockFetchReminders,
 });
}
