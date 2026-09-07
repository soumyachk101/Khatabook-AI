"use client";

import * as React from "use client";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExtractedDataFormProps {
 initialData?: {
 vendor: string;
 date: string;
 amount: number;
 items?: { name: string; quantity: number; price: number }[];
 };
 onSave?: (data: unknown) => void;
 onCancel?: () => void;
}

function ExtractedDataForm({ initialData, onSave, onCancel }: ExtractedDataFormProps) {
 const { register, handleSubmit, formState: { errors } } = useForm({
 defaultValues: initialData || {
 vendor: "",
 date: new Date().toISOString().split("T")[0],
 amount: 0,
 items: [{ name: "", quantity: 1, price: 0 }],
 },
 });

 const onSubmit = (data: unknown) => {
 onSave?.(data);
 };

 return (
 <Card className="p-6">
 <h2 className="text-lg font-semibold mb-4">Extracted Data</h2>
 <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-4">
 <div>
 <Label htmlFor="vendor">Vendor Name</Label>
 <Input id="vendor" {...register("vendor", { required: "Vendor name is required" })} />
 {errors.vendor && <p className="text-xs text-destructive mt-1">{(errors.vendor as { message?: string }).message}</p>}
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <Label htmlFor="date">Date</Label>
 <Input id="date" type="date" {...register("date", { required: "Date is required" })} />
 {errors.date && <p className="text-xs text-destructive mt-1">{(errors.date as { message?: string }).message}</p>}
 </div>
 <div>
 <Label htmlFor="amount">Amount (₹)</Label>
 <Input id="amount" type="number" step="0.01" {...register("amount", { required: "Amount is required", valueAsNumber: true, min: { value: 0.01, message: "Amount must be positive" } })} />
 {errors.amount && <p className="text-xs text-destructive mt-1">{(errors.amount as { message?: string }).message}</p>}
 </div>
 </div>

 <div>
 <Label>Items</Label>
 <div className="space-y-2 mt-2">
 {[0].map((_, i) => (
 <div key={i} className="grid grid-cols-3 gap-2">
 <Input placeholder="Item name" {...register(`items.${i}.name`)} />
 <Input type="number" placeholder="Qty" {...register(`items.${i}.quantity`, { valueAsNumber: true })} />
 <Input type="number" placeholder="Price" {...register(`items.${i}.price`, { valueAsNumber: true })} />
 </div>
 ))}
 </div>
 </div>

 <div className="flex gap-3 pt-2">
 <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
 Cancel
 </Button>
 <Button type="submit" className="flex-1">
 Save Receipt
 </Button>
 </div>
 </form>
 </Card>
 );
}

export { ExtractedDataForm };
