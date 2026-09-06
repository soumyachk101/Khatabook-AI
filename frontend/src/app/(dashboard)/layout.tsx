import type { Metadata } from "next";
import DashboardShell from '@/components/features/dashboard-shell';

export const metadata: Metadata = {
 title: "Dashboard — Khatabook AI",
 description: "Manage your invoices, expenses, and GST filings",
};

export default function DashboardLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return <DashboardShell>{children}</DashboardShell>;
}
