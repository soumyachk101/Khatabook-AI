"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PageHeader } from "@/components/layout/PageHeader";
import { SendInvoiceDialog } from "@/components/invoices/SendInvoiceDialog";
import { PaymentQRCode } from "@/components/invoices/PaymentQRCode";
import { formatDate } from "@/lib/format";
import { ArrowLeft, Send, Printer, QrCode } from "lucide-react";

function InvoiceDetail({ invoiceId }: { invoiceId: string }) {
 const router = useRouter();
 const [invoice, setInvoice] = React.useState<unknown>(null);
 const [loading, setLoading] = React.useState(true);
 const [showSendDialog, setShowSendDialog] = React.useState(false);
 const [showQR, setShowQR] = React.useState(false);

 React.useEffect(() => {
 setLoading(true);
 setTimeout(() => {
 setInvoice({
 id: invoiceId,
 number: "INV-001",
 issueDate: "2025-09-01",
 dueDate: "2025-09-15",
 customer: { name: "Tata Consultancy Services", email: "billing@tcs.com", phone: "+919876543210", address: "TCS House, Mumbai" },
 items: [{ description: "Consulting Services", quantity: 10, rate: 5000, taxRate: 18 }],
 subtotal: 50000,
 taxAmount: 9000,
 total: 59000,
 status: "sent",
 notes: "Payment due within 15 days.",
 });
 setLoading(false);
 }, 500);
 }, [invoiceId]);

 if (loading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 if (!invoice) return null;

 return (
 <div className="max-w-4xl mx-auto space-y-4">
 <PageHeader
 title={`Invoice #${(invoice as { id: string }).id}`}
 breadcrumbs={[{ label: "Invoices", href: "/invoices" }, { label: (invoice as { id: string }).id }]}
 actions={
 <div className="flex gap-2">
 <Button variant="outline" onClick={() => setShowQR(true)}>
 <QrCode className="size-4 mr-2" />
 Payment QR
 </Button>
 <Button variant="outline" onClick={() => setShowSendDialog(true)}>
 <Send className="size-4 mr-2" />
 Send
 </Button>
 <Button variant="outline" onClick={() => window.print()}>
 <Printer className="size-4 mr-2" />
 Print
 </Button>
 </div>
 }
 />

 <Card className="p-6">
 <div className="flex justify-between items-start mb-6">
 <div>
 <p className="text-sm text-muted-foreground">Issue Date</p>
 <p className="font-medium">{formatDate((invoice as { issueDate: string }).issueDate)}</p>
 </div>
 <div className="text-right">
 <p className="text-sm text-muted-foreground">Due Date</p>
 <p className="font-medium">{formatDate((invoice as { dueDate: string }).dueDate)}</p>
 </div>
 </div>

 <div className="mb-6">
 <p className="text-sm text-muted-foreground mb-1">Bill To</p>
 <p className="font-medium">{(invoice as { customer: { name: string } }).customer.name}</p>
 <p className="text-sm text-muted-foreground">{(invoice as { customer: { address: string } }).customer.address}</p>
 </div>

 <table className="w-full mb-6">
 <thead>
 <tr className="border-b-2 border-primary">
 <th className="text-left py-2">Description</th>
 <th className="text-right py-2">Qty</th>
 <th className="text-right py-2">Rate</th>
 <th className="text-right py-2">Tax%</th>
 <th className="text-right py-2">Amount</th>
 </tr>
 </thead>
 <tbody>
 {(invoice as { items: { description: string; quantity: number; rate: number; taxRate: number }[] }).items.map((item, i) => (
 <tr key={i} className="border-b">
 <td className="py-3">{item.description}</td>
 <td className="text-right py-3">{item.quantity}</td>
 <td className="text-right py-3">₹{item.rate.toLocaleString("en-IN")}</td>
 <td className="text-right py-3">{item.taxRate}%</td>
 <td className="text-right py-3">₹{(item.quantity * item.rate).toLocaleString("en-IN")}</td>
 </tr>
 ))}
 </tbody>
 </table>

 <div className="flex justify-end">
 <div className="w-64 space-y-2">
 <div className="flex justify-between"><span>Subtotal</span><span>₹{(invoice as { subtotal: number }).subtotal.toLocaleString("en-IN")}</span></div>
 <div className="flex justify-between"><span>Tax</span><span>₹{(invoice as { taxAmount: number }).taxAmount.toLocaleString("en-IN")}</span></div>
 <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-primary">₹{(invoice as { total: number }).total.toLocaleString("en-IN")}</span></div>
 </div>
 </div>
 </Card>

 <SendInvoiceDialog open={showSendDialog} onOpenChange={setShowSendDialog} invoice={invoice} />
 <PaymentQRCode open={showQR} onOpenChange={setShowQR} amount={(invoice as { total: number }).total} />
 </div>
 );
}

export { InvoiceDetail };
