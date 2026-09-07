"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
 { month: "Apr", amount: 85000 },
 { month: "May", amount: 92000 },
 { month: "Jun", amount: 78000 },
 { month: "Jul", amount: 105000 },
 { month: "Aug", amount: 95000 },
 { month: "Sep", amount: 118000 },
];

function IncomeChart() {
 return (
 <Card className="p-6">
 <h3 className="font-semibold mb-4">Income Trend</h3>
 <ResponsiveContainer width="100%" height={250}>
 <BarChart data={mockData}>
 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
 <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
 <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `₹${v / 1000}k`} />
 <Tooltip formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Income"]} />
 <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
 </BarChart>
 </ResponsiveContainer>
 </Card>
 );
}

export { IncomeChart };
