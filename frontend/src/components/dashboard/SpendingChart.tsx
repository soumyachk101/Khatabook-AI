"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
 { month: "Apr", amount: 45000 },
 { month: "May", amount: 52000 },
 { month: "Jun", amount: 48000 },
 { month: "Jul", amount: 61000 },
 { month: "Aug", amount: 55000 },
 { month: "Sep", amount: 72000 },
];

function SpendingChart() {
 return (
 <Card className="p-6">
 <h3 className="font-semibold mb-4">Spending Trend</h3>
 <ResponsiveContainer width="100%" height={250}>
 <AreaChart data={mockData}>
 <defs>
 <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
 <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
 <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
 <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}k`} />
 <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Spending"]} />
 <Area type="monotone" dataKey="amount" stroke="#6366F1" fill="url(#spendGradient)" strokeWidth={2} />
 </AreaChart>
 </ResponsiveContainer>
 </Card>
 );
}

export { SpendingChart };
