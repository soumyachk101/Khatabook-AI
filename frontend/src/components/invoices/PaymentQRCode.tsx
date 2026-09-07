"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { Copy, Share2, Check } from "lucide-react";

interface PaymentQRCodeProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 amount: number;
 upiId?: string;
 invoiceNumber?: string;
}

function PaymentQRCode({ open, onOpenChange, amount, upiId = "business@upi", invoiceNumber }: PaymentQRCodeProps) {
 const [copied, setCopied] = React.useState(false);

 const paymentLink = `https://pay.khatabook.ai/pay?upi=${encodeURIComponent(upiId)}&amount=${amount}${invoiceNumber ? `&invoice=${invoiceNumber}` : ""}`;

 const copyToClipboard = () => {
 navigator.clipboard.writeText(paymentLink);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 const shareViaWhatsApp = () => {
 const msg = encodeURIComponent(`Pay ₹${amount} via UPI to ${upiId}. Invoice: ${invoiceNumber || "N/A"}`);
 window.open(`https://wa.me/?text=${msg}`, "_blank");
 };

 if (!open) return null;

 return (
 <Card className="p-6 max-w-sm mx-auto">
 <div className="text-center">
 <h3 className="font-semibold text-lg mb-4">UPI Payment</h3>

 <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
 <svg viewBox="0 0 100 100" className="w-40 h-40">
 <rect x="10" y="10" width="20" height="20" fill="black" />
 <rect x="30" y="10" width="10" height="20" fill="black" />
 <rect x="40" y="10" width="10" height="10" fill="black" />
 <rect x="50" y="10" width="20" height="20" fill="black" />
 <rect x="70" y="10" width="20" height="10" fill="black" />
 <rect x="10" y="30" width="10" height="10" fill="black" />
 <rect x="20" y="30" width="20" height="20" fill="black" />
 <rect x="40" y="30" width="10" height="10" fill="black" />
 <rect x="50" y="30" width="20" height="10" fill="black" />
 <rect x="70" y="30" width="20" height="20" fill="black" />
 <rect x="10" y="40" width="10" height="20" fill="black" />
 <rect x="20" y="40" width="20" height="20" fill="black" />
 <rect x="40" y="40" width="10" height="20" fill="black" />
 <rect x="50" y="40" width="20" height="20" fill="black" />
 <rect x="70" y="40" width="20" height="10" fill="black" />
 <rect x="10" y="60" width="10" height="10" fill="black" />
 <rect x="20" y="60" width="20" height="10" fill="black" />
 <rect x="40" y="60" width="10" height="10" fill="black" />
 <rect x="50" y="60" width="20" height="10" fill="black" />
 <rect x="70" y="60" width="20" height="10" fill="black" />
 <rect x="10" y="70" width="10" height="20" fill="black" />
 <rect x="20" y="70" width="20" height="10" fill="black" />
 <rect x="40" y="70" width="10" height="10" fill="black" />
 <rect x="50" y="70" width="20" height="10" fill="black" />
 <rect x="70" y="70" width="20" height="20" fill="black" />
 <rect x="10" y="80" width="10" height="10" fill="black" />
 <rect x="20" y="80" width="20" height="10" fill="black" />
 <rect x="50" y="80" width="20" height="10" fill="black" />
 <rect x="70" y="80" width="20" height="10" fill="black" />
 </svg>
 </div>

 <div className="mb-4">
 <p className="text-sm text-muted-foreground">Amount</p>
 <p className="text-2xl font-bold text-primary"><IndianNumberFormat value={amount} /></p>
 </div>

 <div className="mb-4">
 <p className="text-sm text-muted-foreground">UPI ID</p>
 <p className="font-mono text-sm">{upiId}</p>
 </div>

 <div className="flex gap-2">
 <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1">
 {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
 {copied ? "Copied" : "Copy"}
 </Button>
 <Button size="sm" onClick={shareViaWhatsApp} className="flex-1">
 <Share2 className="size-4 mr-1" />
 Share
 </Button>
 </div>
 </div>
 </Card>
 );
}

export { PaymentQRCode };
