"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Printer, QrCode } from "lucide-react";

interface InvoicePreviewProps {
 invoice?: {
 number: string;
 issueDate: string;
 dueDate: string;
 customer: { name: string; address: string; gstin?: string };
 items: { description: string; quantity: number; rate: number; taxRate: number }[];
 subtotal: number;
 taxAmount: number;
 total: number;
 };
 onBack?: () => void;
 onSend?: () => void;
}

function InvoicePreview({ invoice, onBack, onSend }: InvoicePreviewProps) {
 const data = invoice || {
 number: "INV-001",
 issueDate: "2025-09-01",
 dueDate: "2025-09-15",
 customer: { name: "Tata Consultancy Services", address: "TCS House, Mumbai, Maharashtra", gstin: "27AABCT1234R1ZM" },
 items: [{ description: "Consulting Services", quantity: 10, rate: 5000, taxRate: 18 }],
 subtotal: 50000,
 taxAmount: 9000,
 total: 59000,
 };

 return (
 <div className="max-w-3xl mx-auto">
 <div className="flex items-center gap-3 mb-4">
 <Button variant="ghost" size="icon" onClick={onBack}>
 <ArrowLeft className="size-5" />
 </Button>
 <h1 className="text-2xl font-bold">Invoice Preview</h1>
 </div>

 <Card className="p-8">
 <div className="flex justify-between items-start mb-8">
 <div>
 <h2 className="text-3xl font-bold text-primary">INVOICE</h2>
 <p className="text-muted-foreground">#{data.number}</p>
 </div>
 <div className="text-right">
 <p className="font-medium">Issue Date: {data.issueDate}</p>
 <p className="font-medium">Due Date: {data.dueDate}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-8 mb-8">
 <div>
 <p className="text-sm text-muted-foreground mb-1">From</p>
 <p className="font-medium">Your Business Name</p>
 <p className="text-sm text-muted-foreground">Your Address</p>
 <p className="text-sm text-muted-foreground">GSTIN: 27XXXXXX1234X</p>
 </div>
 <div>
 <p className="text-sm text-muted-foreground mb-1">Bill To</p>
 <p className="font-medium">{data.customer.name}</p>
 <p className="text-sm text-muted-foreground">{data.customer.address}</p>
 {data.customer.gstin && <p className="text-sm text-muted-foreground">GSTIN: {data.customer.gstin}</p>}
 </div>
 </div>

 <table className="w-full mb-8">
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
 {data.items.map((item, i) => (
 <tr key={i} className="border-b">
 <td className="py-3">{item.description}</td>
 <td className="text-right py-3">{item.quantity}</td>
 <td className="text-right py-3">₹{item.rate.toLocaleString("en-IN")}</td>
 <td className="text-right py-3">{item.taxRate}%</td>
 <td className="text-right py-3 font-medium">₹{(item.quantity * item.rate).toLocaleString("en-IN")}</td>
 </tr>
 ))}
 </tbody>
 </table>

 <div className="flex justify-end">
 <div className="w-64 space-y-2">
 <div className="flex justify-between text-sm">
 <span>Subtotal</span>
 <span>₹{data.subtotal.toLocaleString("en-IN")}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span>Tax</span>
 <span>₹{data.taxAmount.toLocaleString("en-IN")}</span>
 </div>
 <div className="flex justify-between font-bold text-lg border-t pt-2">
 <span>Total</span>
 <span className="text-primary">₹{data.total.toLocaleString("en-IN")}</span>
 </div>
 </div>
 </div>
 </Card>

 <div className="flex gap-3 mt-6">
 <Button variant="outline" onClick={onBack} className="flex-1">Edit</Button>
 <Button variant="outline" onClick={() => window.print()} className="flex-1">Print</Button>
 <Button onClick={onSend} className="flex-1">Send Invoice</Button>
 </div>
 </div>
 );
}

export { InvoicePreview };
