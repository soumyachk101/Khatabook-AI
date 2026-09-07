"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { Copy, Share2, Check, Link2 } from "lucide-react";

interface PaymentLinkProps {
 amount: number;
 invoiceNumber?: string;
 upiId?: string;
}

function PaymentLink({ amount, invoiceNumber, upiId = "business@upi" }: PaymentLinkProps) {
 const [copied, setCopied] = React.useState(false);

 const paymentLink = `https://pay.khatabook.ai/pay?upi=${encodeURIComponent(upiId)}&amount=${amount}${invoiceNumber ? `&invoice=${invoiceNumber}` : ""}`;

 const copyLink = () => {
 navigator.clipboard.writeText(paymentLink);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 const shareWhatsApp = () => {
 const msg = encodeURIComponent(`Pay ₹${amount} via UPI to ${upiId}. ${invoiceNumber ? `Invoice: ${invoiceNumber}` : ""}`);
 window.open(`https://wa.me/?text=${msg}`, "_blank");
 };

 return (
 <Card className="p-6 max-w-md mx-auto">
 <h3 className="font-semibold text-lg mb-4 text-center">Payment Link</h3>

 <div className="text-center p-4 bg-muted/50 rounded-lg mb-4">
 <p className="text-sm text-muted-foreground">Amount Due</p>
 <p className="text-2xl font-bold text-primary mt-1"><IndianNumberFormat value={amount} /></p>
 </div>

 <div className="space-y-3 mb-4">
 <div>
 <Label htmlFor="link">Payment Link</Label>
 <div className="flex gap-2">
 <Input id="link" value={paymentLink} readOnly className="text-xs" />
 <Button variant="outline" size="icon" onClick={copyLink}>
 {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
 </Button>
 </div>
 </div>

 <div>
 <Label htmlFor="upi">UPI ID</Label>
 <Input id="upi" value={upiId} readOnly />
 </div>
 </div>

 <div className="flex gap-2">
 <Button variant="outline" onClick={shareWhatsApp} className="flex-1">
 <Share2 className="size-4 mr-2" />
 WhatsApp
 </Button>
 <Button variant="outline" onClick={() => window.print()} className="flex-1">
 <Link2 className="size-4 mr-2" />
 Print QR
 </Button>
 </div>
 </Card>
 );
}

export { PaymentLink };
