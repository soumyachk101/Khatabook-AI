"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useInvoices } from "@/hooks/use-invoices";
import { formatDate } from "@/lib/format";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { PaymentStatusBadge } from "@/components/invoices/PaymentStatusBadge";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";

function InvoiceList() {
 const { data: invoices, isLoading } = useInvoices();

 if (isLoading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 if (!invoices || invoices.length === 0) {
 return (
 <EmptyState
 icon={<FileText className="size-12" />}
 title="No invoices yet"
 description="Create your first invoice to start billing customers."
 action={{ label: "Create Invoice", onClick: () => {} }}
 />
 );
 }

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="text-xl font-bold">Invoices</h2>
 <Link href="/invoices/new">
 <Button>
 <Plus className="size-4 mr-2" />
 New Invoice
 </Button>
 </Link>
 </div>

 <Card className="overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="bg-muted">
 <tr>
 <th className="text-left p-3">Invoice</th>
 <th className="text-left p-3">Customer</th>
 <th className="text-left p-3">Date</th>
 <th className="text-left p-3">Due Date</th>
 <th className="text-right p-3">Amount</th>
 <th className="text-center p-3">Status</th>
 <th className="text-right p-3">Actions</th>
 </tr>
 </thead>
 <tbody>
 {invoices.map((invoice) => (
 <tr key={invoice.id} className="border-t hover:bg-muted/50">
 <td className="p-3 font-medium">#{invoice.id}</td>
 <td className="p-3">{invoice.customer.name}</td>
 <td className="p-3">{formatDate(invoice.issueDate)}</td>
 <td className="p-3">{formatDate(invoice.dueDate)}</td>
 <td className="p-3 text-right">
 <IndianNumberFormat value={invoice.total} />
 </td>
 <td className="p-3 text-center">
 <PaymentStatusBadge status={invoice.status} />
 </td>
 <td className="p-3 text-right">
 <Link href={`/invoices/${invoice.id}`}>
 <Button variant="ghost" size="sm">View</Button>
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Card>
 </div>
 );
}

export { InvoiceList };
