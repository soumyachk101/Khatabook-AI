"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExpenses } from "@/hooks/use-expenses";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

function ExpenseChart() {
 const { data: expenses = [], isLoading } = useExpenses();

 const chartData = React.useMemo(() => {
 const categoryMap = new Map<string, number>();
 expenses.forEach((e) => { categoryMap.set(e.category.name, (categoryMap.get(e.category.name) || 0) + e.amount); });
 return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
 }, [expenses]);

 const total = expenses.reduce((sum, e) => sum + e.amount, 0);
 const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

 if (isLoading) return <Card className="p-6"><div className="h-64 bg-muted/50 rounded animate-pulse" /></Card>;
 if (chartData.length === 0) return <Card className="p-6"><p className="text-sm text-muted-foreground text-center py-8">No expense data</p></Card>;

 return (
 <Card className="p-6">
 <h3 className="font-semibold mb-2">Expense Breakdown</h3>
 <p className="text-sm text-muted-foreground mb-4">Total: ₹{total.toLocaleString("en-IN")}</p>
 <ResponsiveContainer width="100%" height={220}>
 <PieChart>
 <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
 {chartData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
 </Pie>
 <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
 </PieChart>
 </ResponsiveContainer>
 </Card>
 );
}

export { ExpenseChart };
