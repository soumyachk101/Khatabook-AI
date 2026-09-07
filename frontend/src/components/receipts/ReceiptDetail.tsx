"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate, formatIndianCurrency } from "@/lib/format";
import { ArrowLeft, Edit, Trash2, CheckCircle2 } from "lucide-react";

function ReceiptDetail({ receiptId }: { receiptId: string }) {
 const router = useRouter();
 const [receipt, setReceipt] = React.useState<{ vendor: string; date: string; amount: number; confidence: number } | null>(null);
 const [loading, setLoading] = React.useState(true);

 React.useEffect(() => {
 setLoading(true);
 setTimeout(() => {
 setReceipt({ vendor: "Reliance Fresh", date: "2025-09-04", amount: 2450.75, confidence: 0.92 });
 setLoading(false);
 }, 500);
 }, [receiptId]);

 if (loading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 if (!receipt) {
 return (
 <Card className="p-12 text-center">
 <p className="text-muted-foreground">Receipt not found</p>
 <Button variant="outline" onClick={() => router.back()} className="mt-4">
 <ArrowLeft className="size-4 mr-2" />
 Go Back
 </Button>
 </Card>
 );
 }

 return (
 <div className="max-w-2xl mx-auto space-y-4">
 <div className="flex items-center gap-3">
 <Button variant="ghost" size="icon" onClick={() => router.back()}>
 <ArrowLeft className="size-5" />
 </Button>
 <h1 className="text-2xl font-bold flex-1">Receipt Details</h1>
 <Button variant="outline" size="icon">
 <Edit className="size-4" />
 </Button>
 <Button variant="outline" size="icon">
 <Trash2 className="size-4" />
 </Button>
 </div>

 <Card className="p-6">
 <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
 <span className="text-muted-foreground">Receipt Image</span>
 </div>

 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Vendor</p>
 <p className="font-semibold">{receipt.vendor}</p>
 </div>
 <div className="flex items-center gap-1 text-green-600">
 <CheckCircle2 className="size-4" />
 <span className="text-sm">{Math.round(receipt.confidence * 100)}% confidence</span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <p className="text-sm text-muted-foreground">Date</p>
 <p className="font-medium">{formatDate(receipt.date)}</p>
 </div>
 <div>
 <p className="text-sm text-muted-foreground">Amount</p>
 <p className="font-semibold text-lg text-primary">{formatIndianCurrency(receipt.amount)}</p>
 </div>
 </div>
 </div>
 </Card>
 </div>
 );
}

export { ReceiptDetail };
