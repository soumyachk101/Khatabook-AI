"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultTemplates = {
 email: [
 { id: "e1", name: "Payment Reminder", subject: "Payment Reminder: Invoice {{invoice_number}}", body: "Dear {{customer_name}},\n\nThis is a reminder that invoice {{invoice_number}} for ₹{{amount}} is due on {{due_date}}.\n\nPlease make the payment at your earliest convenience.\n\nThank you." },
 { id: "e2", name: "Overdue Notice", subject: "Overdue: Invoice {{invoice_number}}", body: "Dear {{customer_name}},\n\nInvoice {{invoice_number}} for ₹{{amount}} was due on {{due_date}} and is now overdue.\n\nPlease arrange for immediate payment.\n\nRegards," },
 ],
 whatsapp: [
 { id: "w1", name: "Payment Reminder", subject: "Payment Reminder", body: "Hi {{customer_name}}, this is a reminder for invoice {{invoice_number}} of ₹{{amount}} due on {{due_date}}. Please pay via UPI to {{upi_id}}." },
 ],
};

function ReminderTemplateEditor() {
 const [templates, setTemplates] = React.useState(defaultTemplates);
 const [editing, setEditing] = React.useState<{ id: string; channel: string; field: "subject" | "body"; value: string } | null>(null);

 const updateTemplate = (channel: string, id: string, field: "subject" | "body", value: string) => {
 setTemplates((prev) => ({
 ...prev,
 [channel]: prev[channel as keyof typeof prev].map((t) => t.id === id ? { ...t, [field]: value } : t),
 }));
 };

 return (
 <Card className="p-6">
 <h3 className="font-semibold text-lg mb-4">Reminder Templates</h3>
 <Tabs defaultValue="email">
 <TabsList>
 <TabsTrigger value="email">Email</TabsTrigger>
 <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
 </TabsList>
 {Object.entries(templates).map(([channel, channelTemplates]) => (
 <TabsContent key={channel} value={channel} className="space-y-4">
 {channelTemplates.map((template) => (
 <div key={template.id} className="border rounded-lg p-4">
 <div className="flex items-center justify-between mb-3">
 <h4 className="font-medium">{template.name}</h4>
 <Button variant="ghost" size="sm">Edit</Button>
 </div>
 <div className="space-y-2">
 <div>
 <Label>Subject</Label>
 <Input value={template.subject} onChange={(e) => updateTemplate(channel, template.id, "subject", e.target.value)} className="text-sm" />
 </div>
 <div>
 <Label>Message</Label>
 <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={template.body} onChange={(e) => updateTemplate(channel, template.id, "body", e.target.value)} />
 </div>
 </div>
 <div className="mt-3">
 <p className="text-xs text-muted-foreground mb-1">Available variables:</p>
 <div className="flex flex-wrap gap-1">
 {["{{customer_name}}", "{{invoice_number}}", "{{amount}}", "{{due_date}}", "{{upi_id}}"].map((v) => (
 <code key={v} className="text-xs bg-muted px-1.5 py-0.5 rounded">{v}</code>
 ))}
 </div>
 </div>
 </div>
 ))}
 </TabsContent>
 ))}
 </Tabs>
 </Card>
 );
}

export { ReminderTemplateEditor };
