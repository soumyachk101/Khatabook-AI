"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGstStore } from "@/lib/store";
import { gstReturnSchema } from "@/lib/validators/schemas";

function GstReturnForm() {
 const { selectedQuarter, selectedFinancialYear, setSelectedQuarter, setSelectedFinancialYear } = useGstStore();
 const [returnType, setReturnType] = React.useState("GSTR-1");
 const [dueDate, setDueDate] = React.useState("");
 const [selectedInvoices, setSelectedInvoices] = React.useState<string[]>([]);
 const [submitting, setSubmitting] = React.useState(false);

 const mockInvoices = [
 { id: "inv1", number: "INV-001", customer: "Tata Consultancy Services", amount: 59000 },
 { id: "inv2", number: "INV-002", customer: "Infosys Ltd", amount: 86500 },
 { id: "inv3", number: "INV-003", customer: "Wipro Ltd", amount: 49560 },
 ];

 const toggleInvoice = (id: string) => {
 setSelectedInvoices((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
 };

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 const data = { returnType, financialYear: selectedFinancialYear, quarter: selectedQuarter, dueDate, invoices: selectedInvoices };
 const result = gstReturnSchema.safeParse(data);
 if (!result.success) {
 alert(result.error.errors.map((e) => e.message).join(", "));
 return;
 }
 setSubmitting(true);
 setTimeout(() => {
 setSubmitting(false);
 alert("GST Return submitted successfully!");
 }, 1500);
 };

 return (
 <div className="max-w-3xl mx-auto">
 <Card className="p-6">
 <h2 className="text-xl font-bold mb-6">File GST Return</h2>
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <Label>Return Type</Label>
 <select value={returnType} onChange={(e) => setReturnType(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
 <option value="GSTR-1">GSTR-1</option>
 <option value="GSTR-3B">GSTR-3B</option>
 <option value="GSTR-2A">GSTR-2A</option>
 <option value="GSTR-2B">GSTR-2B</option>
 </select>
 </div>
 <div>
 <Label>Financial Year</Label>
 <select value={selectedFinancialYear} onChange={(e) => setSelectedFinancialYear(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
 <option value="2024-25">2024-25</option>
 <option value="2025-26">2025-26</option>
 </select>
 </div>
 <div>
 <Label>Quarter</Label>
 <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
 {["Q1", "Q2", "Q3", "Q4"].map((q) => <option key={q} value={q}>{q}</option>)}
 </select>
 </div>
 </div>

 <div>
 <Label>Due Date</Label>
 <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
 </div>

 <div>
 <Label className="mb-2 block">Select Invoices</Label>
 <div className="space-y-2 border rounded-lg p-4">
 {mockInvoices.map((inv) => (
 <div key={inv.id} className="flex items-center gap-3">
 <Checkbox id={inv.id} checked={selectedInvoices.includes(inv.id)} onCheckedChange={() => toggleInvoice(inv.id)} />
 <Label htmlFor={inv.id} className="flex-1 cursor-pointer">
 <span className="font-medium">{inv.number}</span>
 <span className="text-muted-foreground ml-2">{inv.customer}</span>
 </Label>
 <span className="text-sm">₹{inv.amount.toLocaleString("en-IN")}</span>
 </div>
 ))}
 </div>
 {selectedInvoices.length === 0 && <p className="text-xs text-destructive mt-1">Select at least one invoice</p>}
 </div>

 <Button type="submit" className="w-full" disabled={submitting}>
 {submitting ? "Submitting..." : "Submit Return"}
 </Button>
 </form>
 </Card>
 </div>
 );
}

export { GstReturnForm };
