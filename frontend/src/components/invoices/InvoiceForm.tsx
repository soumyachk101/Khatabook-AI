"use client";

import * as React from "use client";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvoiceFormProps {
 onSubmit?: (data: unknown) => void;
 initialData?: Record<string, unknown>;
}

function InvoiceForm({ onSubmit, initialData }: InvoiceFormProps) {
 const { register, handleSubmit, watch, formState: { errors } } = useForm({
 defaultValues: initialData || {
 customerName: "",
 customerEmail: "",
 customerPhone: "",
 customerAddress: "",
 placeOfSupply: "",
 dueDate: "",
 items: [{ description: "", hsnCode: "", quantity: 1, rate: 0, discount: 0, taxRate: 18 }],
 notes: "",
 terms: "",
 },
 });

 const items = watch("items") || [{ description: "", hsnCode: "", quantity: 1, rate: 0, discount: 0, taxRate: 18 }];

 const addItem = () => {
 const current = watch("items") || [];
 // handled via setValue in real implementation
 };

 const submit = handleSubmit((data) => onSubmit?.(data));

 return (
 <Card className="p-6">
 <form onSubmit={submit as never} className="space-y-6">
 <div>
 <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <Label htmlFor="customerName">Customer Name</Label>
 <Input id="customerName" {...register("customerName", { required: "Required" })} />
 {errors.customerName && <p className="text-xs text-destructive">{(errors.customerName as { message?: string }).message}</p>}
 </div>
 <div>
 <Label htmlFor="customerEmail">Email</Label>
 <Input id="customerEmail" type="email" {...register("customerEmail")} />
 </div>
 <div>
 <Label htmlFor="customerPhone">Phone</Label>
 <Input id="customerPhone" {...register("customerPhone", { required: "Required" })} />
 </div>
 <div>
 <Label htmlFor="placeOfSupply">Place of Supply</Label>
 <Input id="placeOfSupply" {...register("placeOfSupply", { required: "Required" })} />
 </div>
 <div className="md:col-span-2">
 <Label htmlFor="customerAddress">Address</Label>
 <textarea id="customerAddress" className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" {...register("customerAddress")} />
 </div>
 </div>
 </div>

 <div>
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-semibold">Items</h2>
 <Button type="button" variant="outline" size="sm" onClick={addItem}>
 + Add Item
 </Button>
 </div>
 <div className="border rounded-lg overflow-hidden">
 <table className="w-full text-sm">
 <thead className="bg-muted">
 <tr>
 <th className="text-left p-2">Description</th>
 <th className="text-left p-2">HSN</th>
 <th className="text-right p-2">Qty</th>
 <th className="text-right p-2">Rate</th>
 <th className="text-right p-2">Tax%</th>
 </tr>
 </thead>
 <tbody>
 {items.map((_: unknown, i: number) => (
 <tr key={i} className="border-t">
 <td className="p-2"><Input className="h-8" {...register(`items.${i}.description` as const)} /></td>
 <td className="p-2"><Input className="h-8" {...register(`items.${i}.hsnCode` as const)} /></td>
 <td className="p-2"><Input type="number" className="h-8 text-right" {...register(`items.${i}.quantity` as const, { valueAsNumber: true })} /></td>
 <td className="p-2"><Input type="number" className="h-8 text-right" {...register(`items.${i}.rate` as const, { valueAsNumber: true })} /></td>
 <td className="p-2"><Input type="number" className="h-8 text-right" {...register(`items.${i}.taxRate` as const, { valueAsNumber: true })} /></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <Label htmlFor="notes">Notes</Label>
 <textarea id="notes" className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" {...register("notes")} />
 </div>
 <div>
 <Label htmlFor="terms">Terms & Conditions</Label>
 <textarea id="terms" className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" {...register("terms")} />
 </div>
 </div>

 <div>
 <Label htmlFor="dueDate">Due Date</Label>
 <Input id="dueDate" type="date" {...register("dueDate", { required: "Due date is required" })} />
 </div>

 <div className="flex gap-3">
 <Button type="button" variant="outline" className="flex-1">Save as Draft</Button>
 <Button type="submit" className="flex-1">Save & Send</Button>
 </div>
 </form>
 </Card>
 );
}

export { InvoiceForm };
