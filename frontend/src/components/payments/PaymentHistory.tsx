"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { usePayments } from "@/hooks/use-payments";
import { formatDate } from "@/lib/format";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { Wallet } from "lucide-react";

const methodIcons: Record<string, string> = { upi: "📱", bank: "🏦", cash: "💵", card: "💳" };

function PaymentHistory() {
 const { data: payments, isLoading } = usePayments();

 if (isLoading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 if (!payments || payments.length === 0) {
 return (
 <EmptyState
 icon={<Wallet className="size-12" />}
 title="No payments yet"
 description="Payment history will appear here."
 />
 );
 }

 return (
 <div className="space-y-4">
 <h2 className="text-xl font-bold">Payment History</h2>
 <Card className="overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="bg-muted">
 <tr>
 <th className="text-left p-3">Date</th>
 <th className="text-left p-3">Invoice</th>
 <th className="text-left p-3">Method</th>
 <th className="text-right p-3">Amount</th>
 <th className="text-center p-3">Status</th>
 <th className="text-left p-3">Transaction ID</th>
 </tr>
 </thead>
 <tbody>
 {payments.map((payment) => (
 <tr key={payment.id} className="border-t hover:bg-muted/50">
 <td className="p-3">{formatDate(payment.paidAt || payment.createdAt)}</td>
 <td className="p-3">#{payment.invoiceId}</td>
 <td className="p-3">
 <span className="flex items-center gap-1">
 <span>{methodIcons[payment.method]}</span>
 <span className="capitalize">{payment.method}</span>
 </span>
 </td>
 <td className="p-3 text-right font-medium">
 <IndianNumberFormat value={payment.amount} />
 </td>
 <td className="p-3 text-center">
 <span className={`text-xs px-2 py-1 rounded-full ${payment.status === "completed" ? "bg-green-100 text-green-700" : payment.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
 {payment.status}
 </span>
 </td>
 <td className="p-3 font-mono text-xs">{payment.upiTransactionId || "-"}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Card>
 </div>
 );
}

export { PaymentHistory };
