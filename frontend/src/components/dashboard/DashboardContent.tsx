"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { GstSummaryCard } from "@/components/dashboard/GstSummaryCard";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { IncomeChart } from "@/components/dashboard/IncomeChart";
import { useReceipts } from "@/hooks/use-receipts";

function DashboardContent() {
 const { data: receipts } = useReceipts();
 const totalCredit = receipts?.reduce((sum, r) => sum + r.amount, 0) || 0;
 const balance = 245680;
 const debit = 124500;

 return (
 <div className="space-y-6">
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2">
 <BalanceCard balance={balance} credit={totalCredit} debit={debit} trend={12.5} />
 </div>
 <div>
 <GstSummaryCard />
 </div>
 </div>
 <QuickActions />
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 <SpendingChart />
 <IncomeChart />
 </div>
 <RecentTransactions />
 </div>
 );
}

export { DashboardContent };
