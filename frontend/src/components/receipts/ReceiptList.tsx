"use client";

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useReceipts } from "@/hooks/use-receipts";
import { formatDate } from "@/lib/format";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { Receipt, Plus } from "lucide-react";

function ReceiptList() {
 const { data: receipts, isLoading } = useReceipts();

 if (isLoading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 if (!receipts || receipts.length === 0) {
 return (
 <EmptyState
 icon={<Receipt className="size-12" />}
 title="No receipts yet"
 description="Scan your first receipt to get started with AI-powered expense tracking."
 action={{ label: "Scan Receipt", onClick: () => {} }}
 />
 );
 }

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="text-xl font-bold">Receipts</h2>
 <Link href="/receipts/scan">
 <Button>
 <Plus className="size-4 mr-2" />
 Scan Receipt
 </Button>
 </Link>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {receipts.map((receipt) => (
 <Link key={receipt.id} href={`/receipts/${receipt.id}`}>
 <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
 <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
 <Receipt className="size-8 text-muted-foreground" />
 </div>
 <div className="space-y-1">
 <p className="font-medium truncate">{receipt.vendor}</p>
 <p className="text-sm text-muted-foreground">{formatDate(receipt.date)}</p>
 <div className="flex items-center justify-between pt-2">
 <span className="font-semibold text-primary">
 <IndianNumberFormat value={receipt.amount} />
 </span>
 {receipt.confidence && (
 <span className="text-xs text-muted-foreground">
 {Math.round(receipt.confidence * 100)}%
 </span>
 )}
 </div>
 </div>
 </Card>
 </Link>
 ))}
 </div>
 </div>
 );
}

export { ReceiptList };
