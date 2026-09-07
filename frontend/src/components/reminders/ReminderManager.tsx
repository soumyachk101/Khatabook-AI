"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useReminders } from "@/hooks/use-reminders";
import { formatDate } from "@/lib/format";
import { Bell, Plus } from "lucide-react";

const templates = [
 { subject: "Payment Reminder", body: "Dear {customer_name}, this is a gentle reminder for invoice {invoice_number} due on {due_date}." },
 { subject: "GST Due Date", body: "Reminder: Your GSTR-{return_type} return is due on {due_date}. Please file on time." },
];

function ReminderManager() {
 const { data: reminders } = useReminders();
 const [type, setType] = React.useState<"payment" | "gst">("payment");
 const [channel, setChannel] = React.useState<"email" | "whatsapp">("whatsapp");
 const [active, setActive] = React.useState(true);

 return (
 <div className="max-w-4xl mx-auto space-y-6">
 <Card className="p-6">
 <div className="flex items-center justify-between mb-6">
 <div>
 <h1 className="text-2xl font-bold">Reminders</h1>
 <p className="text-sm text-muted-foreground">Configure payment and GST reminders</p>
 </div>
 <Button><Plus className="size-4 mr-2" /> New Reminder</Button>
 </div>
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2"><Label>Reminder Type</Label>
 <Select value={type} onValueChange={(v) => setType(v as "payment" | "gst")}><SelectTrigger><SelectValue /></SelectTrigger>
 <SelectContent><SelectItem value="payment">Payment Reminder</SelectItem><SelectItem value="gst">GST Reminder</SelectItem></SelectContent></Select>
 </div>
 <div className="space-y-2"><Label>Channel</Label>
 <Select value={channel} onValueChange={(v) => setChannel(v as "email" | "whatsapp")}><SelectTrigger><SelectValue /></SelectTrigger>
 <SelectContent><SelectItem value="email">Email</SelectItem><SelectItem value="whatsapp">WhatsApp</SelectItem></SelectContent></Select>
 </div>
 <div className="space-y-2"><Label>Frequency</Label>
 <Select defaultValue="weekly"><SelectTrigger><SelectValue /></SelectTrigger>
 <SelectContent><SelectItem value="once">Once</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem><SelectItem value="monthly">Monthly</SelectItem></SelectContent></Select>
 </div>
 <div className="space-y-2"><Label>Template</Label>
 <Select defaultValue="0"><SelectTrigger><SelectValue /></SelectTrigger>
 <SelectContent>{templates.map((t, i) => <SelectItem key={i} value={String(i)}>{t.subject}</SelectItem>)}</SelectContent></Select>
 </div>
 <div className="flex items-center gap-2"><Switch checked={active} onCheckedChange={setActive} /><Label>Active</Label></div>
 </div>
 <Button className="w-full">Save Reminder</Button>
 </div>
 </Card>
 <Card className="p-6">
 <h3 className="font-semibold mb-4">Active Reminders</h3>
 <div className="space-y-3">
 {reminders?.map((reminder) => (
 <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
 <div className="flex items-center gap-3"><Bell className="size-5 text-primary" /><div><p className="font-medium">{reminder.subject}</p><p className="text-xs text-muted-foreground">{reminder.channel} • {reminder.schedule.frequency}</p></div></div>
 <Badge variant={reminder.isActive ? "success" : "secondary"}>{reminder.isActive ? "Active" : "Inactive"}</Badge>
 </div>
 ))}
 {(!reminders || reminders.length === 0) && <p className="text-center text-muted-foreground py-8">No reminders configured</p>}
 </div>
 </Card>
 </div>
 );
}

export { ReminderManager };
