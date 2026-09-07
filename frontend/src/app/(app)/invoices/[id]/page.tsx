"use client";

import * as React from "react";
import { InvoiceDetail } from "@/components/invoices/InvoiceDetail";
import { useInvoices } from "@/hooks/use-invoices";

function InvoiceDetailPage({ params }: { params: { id: string } }) {
 const { data: invoices } = useInvoices();
 const invoice = invoices?.find((i) => i.id === params.id);

 if (!invoice) return <div className="p-8 text-center">Invoice not found</div>;

 return <InvoiceDetail invoice={invoice} />;
}

export default InvoiceDetailPage;
