"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { Wallet, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface UpiPaymentProps {
 amount: number;
 upiId?: string;
 onSuccess?: (transactionId: string) => void;
 onFailure?: () => void;
}

function UpiPayment({ amount, upiId = "business@upi", onSuccess, onFailure }: UpiPaymentProps) {
 const [status, setStatus] = React.useState<"idle" | "processing" | "success" | "failed">("idle");
 const [transactionId, setTransactionId] = React.useState("");

 const handlePay = () => {
 setStatus("processing");
 setTimeout(() => {
 const success = Math.random() > 0.2;
 if (success) {
 const txId = `UPI${Date.now().toString().slice(-10)}`;
 setTransactionId(txId);
 setStatus("success");
 onSuccess?.(txId);
 } else {
 setStatus("failed");
 onFailure?.();
 }
 }, 2000);
 };

 return (
 <Card className="p-6 max-w-md mx-auto">
 <div className="text-center mb-6">
 <Wallet className="size-12 text-primary mx-auto mb-3" />
 <h3 className="font-semibold text-lg">UPI Payment</h3>
 <p className="text-sm text-muted-foreground">Pay securely via UPI</p>
 </div>

 <div className="space-y-4">
 <div className="text-center p-4 bg-muted/50 rounded-lg">
 <p className="text-sm text-muted-foreground">Amount</p>
 <p className="text-3xl font-bold text-primary mt-1"><IndianNumberFormat value={amount} /></p>
 </div>

 <div>
 <Label htmlFor="upiId">UPI ID</Label>
 <Input id="upiId" defaultValue={upiId} readOnly />
 </div>

 {status === "idle" && (
 <Button onClick={handlePay} className="w-full" size="lg">
 Pay Now
 </Button>
 )}

 {status === "processing" && (
 <div className="text-center py-4">
 <Loader2 className="size-8 animate-spin text-primary mx-auto mb-2" />
 <p className="text-sm text-muted-foreground">Processing payment...</p>
 </div>
 )}

 {status === "success" && (
 <div className="text-center py-4">
 <CheckCircle2 className="size-12 text-green-500 mx-auto mb-2" />
 <p className="font-semibold text-green-600">Payment Successful!</p>
 <p className="text-sm text-muted-foreground mt-1">Transaction ID: {transactionId}</p>
 </div>
 )}

 {status === "failed" && (
 <div className="text-center py-4">
 <XCircle className="size-12 text-destructive mx-auto mb-2" />
 <p className="font-semibold text-destructive">Payment Failed</p>
 <Button onClick={() => setStatus("idle")} variant="outline" className="mt-3">Try Again</Button>
 </div>
 )}
 </div>
 </Card>
 );
}

export { UpiPayment };
