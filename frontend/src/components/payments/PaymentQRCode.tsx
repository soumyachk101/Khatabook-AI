"use client";

import * as React from "react";
import { QRCode } from "qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatIndianCurrency } from "@/lib/format";
import { Download, Copy, Check } from "lucide-react";

function PaymentQRCode({ invoiceId, amount = 0, upiId = "business@okhdfcbank" }: { invoiceId: string; amount?: number; upiId?: string }) {
 const [qrDataUrl, setQrDataUrl] = React.useState("");
 const [copied, setCopied] = React.useState(false);
 const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Business&tr=${invoiceId}&am=${amount}&cu=INR`;

 React.useEffect(() => {
 QRCode.toDataURL(upiString, { width: 200, margin: 2, color: { dark: "#6366F1", light: "#ffffff" } }).then(setQrDataUrl).catch(console.error);
 }, [upiString, amount, invoiceId]);

 const downloadQR = () => {
 if (!qrDataUrl) return;
 const a = document.createElement("a");
 a.href = qrDataUrl;
 a.download = `upi-qr-${invoiceId}.png`;
 a.click();
 };

 return (
 <Card className="p-6 max-w-sm mx-auto text-center space-y-4">
 <h3 className="font-semibold">UPI Payment</h3>
 <p className="text-sm text-muted-foreground">Scan to pay {amount > 0 && <span className="font-medium text-foreground">{formatIndianCurrency(amount)}</span>}</p>
 {qrDataUrl && <img src={qrDataUrl} alt="UPI QR" className="mx-auto rounded-lg border p-2 bg-white" width={180} height={180} />}
 <div>
 <Label>UPI ID</Label>
 <Input value={upiId} readOnly />
 </div>
 <div className="flex gap-2">
 <Button variant="outline" size="sm" onClick={downloadQR} className="flex-1"><Download className="size-4 mr-1" /> Download</Button>
 <Button variant="outline" size="sm" onClick={async () => { await navigator.clipboard.writeText(upiString); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex-1">
 {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />} {copied ? "Copied" : "Copy"}
 </Button>
 </div>
 </Card>
 );
}

export { PaymentQRCode };
