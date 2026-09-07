"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SendInvoiceDialogProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 invoice?: unknown;
}

function SendInvoiceDialog({ open, onOpenChange, invoice }: SendInvoiceDialogProps) {
 const [channels, setChannels] = React.useState({ email: true, whatsapp: false, sms: false });
 const [sending, setSending] = React.useState(false);

 const toggleChannel = (channel: keyof typeof channels) => {
 setChannels((prev) => ({ ...prev, [channel]: !prev[channel] }));
 };

 const handleSend = () => {
 setSending(true);
 setTimeout(() => {
 setSending(false);
 onOpenChange(false);
 }, 1500);
 };

 return (
 <Card className="p-6">
 <h2 className="text-lg font-semibold mb-4">Send Invoice</h2>

 <div className="space-y-4">
 <div>
 <Label htmlFor="recipient">Recipient</Label>
 <Input id="recipient" defaultValue="billing@tcs.com" placeholder="email@example.com" />
 </div>

 <div>
 <Label className="mb-2 block">Send via</Label>
 <div className="space-y-2">
 <div className="flex items-center gap-2">
 <Checkbox id="email" checked={channels.email} onCheckedChange={() => toggleChannel("email")} />
 <Label htmlFor="email" className="cursor-pointer">Email</Label>
 </div>
 <div className="flex items-center gap-2">
 <Checkbox id="whatsapp" checked={channels.whatsapp} onCheckedChange={() => toggleChannel("whatsapp")} />
 <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
 </div>
 <div className="flex items-center gap-2">
 <Checkbox id="sms" checked={channels.sms} onCheckedChange={() => toggleChannel("sms")} />
 <Label htmlFor="sms" className="cursor-pointer">SMS</Label>
 </div>
 </div>
 </div>

 <div>
 <Label htmlFor="message">Message</Label>
 <textarea id="message" className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" defaultValue="Please find the attached invoice. Let us know if you have any questions." />
 </div>

 <div className="flex gap-3 pt-2">
 <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
 <Button onClick={handleSend} disabled={sending} className="flex-1">
 {sending ? "Sending..." : "Send Invoice"}
 </Button>
 </div>
 </div>
 </Card>
 );
}

export { SendInvoiceDialog };
