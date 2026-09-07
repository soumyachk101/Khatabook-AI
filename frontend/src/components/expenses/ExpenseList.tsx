"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useExpenses } from "@/hooks/use-expenses";
import { formatDate } from "@/lib/format";
import { Search, Plus } from "lucide-react";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";

function ExpenseList() {
 const { data: expenses = [], isLoading } = useExpenses();
 const [filter, setFilter] = React.useState<string>("all");
 const [search, setSearch] = React.useState("");

 const categories = Array.from(new Set(expenses.map(e => e.category.name)));
 const filtered = React.useMemo(() => {
 let result = expenses;
 if (filter !== "all") result = result.filter(e => e.category.name === filter);
 if (search) result = result.filter(e => e.description.toLowerCase().includes(search.toLowerCase()));
 return result;
 }, [expenses, filter, search]);

 const total = filtered.reduce((sum, e) => sum + e.amount, 0);

 return (
 <div className="space-y-4">
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold">Expenses</h1>
 <p className="text-muted-foreground text-sm">{filtered.length} expenses · Total: ₹{total.toLocaleString("en-IN")}</p>
 </div>
 <Button><Plus className="mr-2 size-4" /> Add Expense</Button>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 <div className="lg:col-span-2 space-y-4">
 <Card className="p-4">
 <div className="flex flex-col sm:flex-row gap-3">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
 <Input placeholder="Search expenses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
 </div>
 <select className="h-9 rounded-md border border-input bg-transparent px-3 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
 <option value="all">All Categories</option>
 {categories.map(c => <option key={c} value={c}>{c}</option>)}
 </select>
 </div>
 </Card>

 <Card className="p-6">
 {isLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />))}</div>
 : filtered.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No expenses found</p>
 : (
 <div className="space-y-2">
 {filtered.map((expense) => (
 <div key={expense.id} className="flex items-center justify-between py-3 border-b last:border-0">
 <div className="flex items-center gap-3">
 <span className="text-2xl">{expense.category.icon}</span>
 <div>
 <p className="font-medium text-sm">{expense.description}</p>
 <p className="text-xs text-muted-foreground">{formatDate(expense.date)} · {expense.paymentMethod}</p>
 </div>
 </div>
 <p className="font-semibold">₹{expense.amount.toLocaleString("en-IN")}</p>
 </div>
 ))}
 </div>
 )}
 </Card>
 </div>
 <div><ExpenseChart /></div>
 </div>
 </div>
 );
}

export { ExpenseList };
