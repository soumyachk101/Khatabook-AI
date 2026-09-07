"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/SearchInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useReceipts } from "@/hooks/use-receipts";
import { formatDate, formatIndianCurrency } from "@/lib/format";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { Receipt, Scan, Plus, MoreVertical } from "lucide-react";
import Link from "next/link";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface RecentTransactionsProps {
 onScanClick?: () => void;
}

function RecentTransactions({ onScanClick }: RecentTransactionsProps) {
 const { data: receipts, isLoading } = useReceipts();

 if (isLoading) return <LoadingSpinner className="py-8" />;

 return (
 <Card className="p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-lg">Recent Transactions</h3>
 <div className="flex gap-2">
 <Button variant="outline" size="sm" onClick={onScanClick}>
 <Scan className="size-4 mr-1" /> Scan
 </Button>
 <Button variant="outline" size="sm" asChild>
 <Link href="/app/receipts"><Receipt className="size-4 mr-1" /> All</Link>
 </Button>
 </div>
 </div>
 <div className="space-y-3">
 {(receipts ?? []).slice(0, 5).map((receipt) => (
 <div key={receipt.id} className="flex items-center justify-between py-2 border-b last:border-0">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-primary/10 rounded-full">
 <Receipt className="size-4 text-primary" />
 </div>
 <div>
 <p className="font-medium text-sm">{receipt.vendor}</p>
 <p className="text-xs text-muted-foreground">{formatDate(receipt.date)}</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <span className="font-medium text-sm">{formatIndianCurrency(receipt.amount)}</span>
 <DropdownMenu>
 <DropdownMenuTrigger asChild>
 <Button variant="ghost" size="icon"><MoreVertical className="size-4" /></Button>
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end">
 <DropdownMenuGroup>
 <DropdownMenuGroup>
 <DropdownMenuItem asChild><Link href={`/app/receipts/${receipt.id}`}>View</Link></DropdownMenuGroup>
 </DropdownMenuGroup>
 </DropdownMenuContent>
 </DropdownMenu>
 </div>
 </div>
 </div>
 ))}
 {(receipts ?? []).length === 0 && (
 <p className="text-sm text-muted-foreground text-center py-6">No transactions yet. Scan a receipt to get started.</p>
 )}
 </div>
 </Card>
 );
}

export { RecentTransactions };
