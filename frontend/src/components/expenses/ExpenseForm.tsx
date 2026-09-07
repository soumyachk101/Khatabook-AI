"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { expenseSchema } from "@/lib/validators/schemas";

function ExpenseForm({ onSave }: { onSave?: (data: unknown) => void }) {
 const form = useForm({ resolver: undefined, defaultValues: { amount: 0, category: "", description: "", date: new Date().toISOString().split("T")[0], paymentMethod: "cash", tags: [] } });

 const onSubmit = form.handleSubmit((data) => { onSave?.(data); alert("Expense saved!"); });

 return (
 <Card className="p-6 max-w-2xl mx-auto">
 <h3 className="font-semibold mb-4">Add Expense</h3>
 <form onSubmit={onSubmit} className="space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2"><label className="text-sm font-medium">Amount *</label><input type="number" step="0.01" className="h-9 w-full rounded-md border px-3 text-sm" {...form.register("amount", { valueAsNumber: true })} /></div>
 <div className="space-y-2"><label className="text-sm font-medium">Category *</label>
 <select className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" {...form.register("category")}>
 <option value="">Select...</option>
 <option value="Rent">Rent</option>
 <option value="Fuel">Fuel</option>
 <option value="Utilities">Utilities</option>
 <option value="Supplies">Supplies</option>
 <option value="Salary">Salary</option>
 </select>
 </div>
 </div>
 <div className="space-y-2"><label className="text-sm font-medium">Description *</label><input className="h-9 w-full rounded-md border px-3 text-sm" {...form.register("description")} /></div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2"><label className="text-sm font-medium">Date</label><input type="date" className="h-9 w-full rounded-md border px-3 text-sm" {...form.register("date")} /></div>
 <div className="space-y-2"><label className="text-sm font-medium">Payment Method</label>
 <select className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" {...form.register("paymentMethod")}>
 <option value="cash">Cash</option>
 <option value="upi">UPI</option>
 <option value="bank">Bank Transfer</option>
 <option value="card">Card</option>
 </select>
 </div>
 </div>
 <div className="flex gap-2">
 <Button type="submit">Save Expense</Button>
 <Button type="button" variant="outline">Cancel</Button>
 </div>
 </form>
 </Card>
 );
}

export { ExpenseForm };
