"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 Legend,
} from "recharts";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { useGstStore } from "@/lib/store";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const monthlyData = [
 { month: "Apr", turnover: 380000, tax: 68400 },
 { month: "May", turnover: 420000, tax: 75600 },
 { month: "Jun", turnover: 480000, tax: 86400 },
 { month: "Jul", turnover: 450000, tax: 81000 },
 { month: "Aug", turnover: 390000, tax: 70200 },
 { month: "Sep", turnover: 520000, tax: 93600 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
 if (active && payload?.length) {
 return (
 <div className="bg-background border rounded-md p-3 shadow-lg">
 <p className="text-sm font-medium mb-1">{label}</p>
 {payload.map((entry, i) => (
 <p key={i} className="text-sm" style={{ color: entry.name === "Turnover" ? "#6366F1" : "#10B981" }}>
 {entry.name}: <IndianNumberFormat value={entry.value} />
 </p>
 ))}
 </div>
 );
 }
 return null;
}

function GstSummary() {
 const { selectedQuarter, selectedFinancialYear } = useGstStore();

 const totalTurnover = monthlyData.reduce((sum, m) => sum + m.turnover, 0);
 const totalTax = monthlyData.reduce((sum, m) => sum + m.tax, 0);
 const itcAvailable = 45000;
 const itcClaimed = 42000;

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <h2 className="text-xl font-bold">GST Dashboard</h2>
 <div className="flex gap-2">
 <select value={selectedQuarter} onChange={(e) => e.target.value} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
 {["Q1", "Q2", "Q3", "Q4"].map((q) => <option key={q} value={q}>{q}</option>)}
 </select>
 <select value={selectedFinancialYear} onChange={(e) => e.target.value} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm">
 {["2024-25", "2025-26"].map((y) => <option key={y} value={y}>{y}</option>)}
 </select>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <Card className="p-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Total Turnover</p>
 <p className="text-xl font-bold mt-1"><IndianNumberFormat value={totalTurnover} /></p>
 </div>
 <TrendingUp className="size-5 text-primary" />
 </div>
 <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
 <ArrowUpRight className="size-3" />
 <span>12.5%</span>
 </div>
 </Card>

 <Card className="p-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">Total Tax Collected</p>
 <p className="text-xl font-bold mt-1"><IndianNumberFormat value={totalTax} /></p>
 </div>
 <ArrowUpRight className="size-5 text-green-500" />
 </div>
 <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
 <ArrowUpRight className="size-3" />
 <span>18% GST</span>
 </div>
 </Card>

 <Card className="p-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">ITC Available</p>
 <p className="text-xl font-bold mt-1"><IndianNumberFormat value={itcAvailable} /></p>
 </div>
 <TrendingUp className="size-5 text-blue-500" />
 </div>
 </Card>

 <Card className="p-4">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm text-muted-foreground">ITC Claimed</p>
 <p className="text-xl font-bold mt-1"><IndianNumberFormat value={itcClaimed} /></p>
 </div>
 <ArrowDownRight className="size-5 text-amber-500" />
 </div>
 <div className="w-full bg-muted rounded-full h-2 mt-2">
 <div className="bg-primary h-2 rounded-full" style={{ width: `${(itcClaimed / itcAvailable) * 100}%` }} />
 </div>
 </Card>
 </div>

 <Card className="p-6">
 <h3 className="font-semibold text-lg mb-4">Monthly Turnover & Tax</h3>
 <div className="h-[300px]">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={monthlyData}>
 <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
 <XAxis dataKey="month" tick={{ fontSize: 12 }} />
 <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
 <Tooltip content={<CustomTooltip />} />
 <Legend />
 <Bar dataKey="turnover" fill="#6366F1" radius={[4, 4, 0, 0]} name="Turnover" />
 <Bar dataKey="tax" fill="#10B981" radius={[4, 4, 0, 0]} name="Tax" />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </Card>

 <div className="flex gap-3">
 <Button asChild><a href="/gst/returns">File Returns</a></Button>
 <Button variant="outline" asChild><a href="/gst/returns">View Reports</a></Button>
 </div>
 </div>
 );
}

export { GstSummary };
