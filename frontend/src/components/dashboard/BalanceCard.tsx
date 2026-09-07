"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

interface BalanceCardProps {
 balance?: number;
 credit?: number;
 debit?: number;
 trend?: number;
}

function BalanceCard({ balance = 154320, credit = 250000, debit = 95680, trend = 12.5 }: BalanceCardProps) {
 return (
 <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
 <div className="flex items-center justify-between mb-4">
 <div>
 <p className="text-white/80 text-sm">Available Balance</p>
 <h2 className="text-3xl font-bold mt-1">
 <IndianNumberFormat value={balance} />
 </h2>
 </div>
 <div className="p-3 bg-white/20 rounded-full">
 <Wallet className="size-6" />
 </div>
 </div>
 {trend !== undefined && (
 <div className="flex items-center gap-1 text-sm text-white/80 mb-4">
 {trend >= 0 ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
 <span>{Math.abs(trend)}% from last month</span>
 </div>
 )}
 <div className="flex gap-4">
 <div className="flex-1 bg-white/10 rounded-lg p-3">
 <p className="text-white/80 text-xs">Credit</p>
 <p className="font-semibold text-green-200">+<IndianNumberFormat value={credit} /></p>
 </div>
 <div className="flex-1 bg-white/10 rounded-lg p-3">
 <p className="text-white/80 text-xs">Debit</p>
 <p className="font-semibold text-red-200">-<IndianNumberFormat value={debit} /></p>
 </div>
 </div>
 </Card>
 );
}

export { BalanceCard };
