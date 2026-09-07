"use client";

import * as React from "use client";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface ReminderFormProps {
 onSubmit?: (data: unknown) => void;
 onCancel?: () => void;
}

function ReminderForm({ onSubmit, onCancel }: ReminderFormProps) {
 const { register, handleSubmit, formState: { errors } } = useForm({
 defaultValues: {
 type: "payment",
 channel: "email",
 subject: "",
 body: "",
 frequency: "weekly",
 startDate: new Date().toISOString().split("T")[0],
 time: "10:00",
 },
 });

 const submit = handleSubmit((data) => onSubmit?.(data));

 return (
 <Card className="p-6">
 <h2 className="text-lg font-semibold mb-4">Create Reminder</h2>
 <form onSubmit={submit as never} className="space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <Label>Type</Label>
 <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" {...register("type")}>
 <option value="payment">Payment</option>
 <option value="gst">GST</option>
 <option value="custom">Custom</option>
 </select>
 </div>
 <div>
 <Label>Channel</Label>
 <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" {...register("channel")}>
 <option value="email">Email</option>
 <option value="whatsapp">WhatsApp</option>
 <option value="sms">SMS</option>
 </select>
 </div>
 </div>

 <div>
 <Label>Subject</Label>
 <Input {...register("subject", { required: "Subject is required" })} placeholder="Reminder subject" />
 {errors.subject && <p className="text-xs text-destructive">{(errors.subject as { message?: string }).message}</p>}
 </div>

 <div>
 <Label>Message</Label>
 <textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" {...register("body", { required: "Message is required" })} placeholder="Use {{customer_name}}, {{amount}}, {{due_date}} as variables" />
 {errors.body && <p className="text-xs text-destructive">{(errors.body as { message?: string }).message}</p>}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <div>
 <Label>Frequency</Label>
 <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" {...register("frequency")}>
 <option value="once">Once</option>
 <option value="daily">Daily</option>
 <option value="weekly">Weekly</option>
 <option value="monthly">Monthly</option>
 </select>
 </div>
 <div>
 <Label>Start Date</Label>
 <Input type="date" {...register("startDate")} />
 </div>
 <div>
 <Label>Time</Label>
 <Input type="time" {...register("time")} />
 </div>
 </div>

 <div className="flex gap-3">
 <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
 <Button type="submit" className="flex-1">Create Reminder</Button>
 </div>
 </form>
 </Card>
 );
}

export { ReminderForm };
