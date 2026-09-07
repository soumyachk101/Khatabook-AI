"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ReminderManagerProps {
 invoiceId?: string;
}

function ReminderManager({ invoiceId }: ReminderManagerProps) {
 const [settings, setSettings] = React.useState({
 enabled: true,
 frequency: "weekly",
 channels: { email: true, whatsapp: true, sms: false },
 daysBefore: 3,
 });

 const toggleChannel = (channel: keyof typeof settings.channels) => {
 setSettings((prev) => ({ ...prev, channels: { ...prev.channels, [channel]: !prev.channels[channel] } }));
 };

 return (
 <Card className="p-6 max-w-md">
 <h3 className="font-semibold text-lg mb-4">Payment Reminders</h3>

 <div className="flex items-center justify-between mb-4">
 <div>
 <p className="font-medium">Enable Reminders</p>
 <p className="text-sm text-muted-foreground">Automatically send payment reminders</p>
 </div>
 <Switch checked={settings.enabled} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))} />
 </div>

 {settings.enabled && (
 <div className="space-y-4">
 <div>
 <Label>Frequency</Label>
 <select value={settings.frequency} onChange={(e) => setSettings((prev) => ({ ...prev, frequency: e.target.value }))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
 <option value="daily">Daily</option>
 <option value="weekly">Weekly</option>
 <option value="monthly">Monthly</option>
 </select>
 </div>

 <div>
 <Label>Remind (days before due)</Label>
 <Input type="number" value={settings.daysBefore} onChange={(e) => setSettings((prev) => ({ ...prev, daysBefore: parseInt(e.target.value) || 0 }))} />
 </div>

 <div>
 <Label className="mb-2 block">Channels</Label>
 <div className="space-y-2">
 {Object.entries(settings.channels).map(([channel, enabled]) => (
 <div key={channel} className="flex items-center justify-between">
 <span className="text-sm capitalize">{channel}</span>
 <Switch checked={enabled} onCheckedChange={() => toggleChannel(channel as keyof typeof settings.channels)} />
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 <Button className="w-full mt-4">Save Settings</Button>
 </Card>
 );
}

export { ReminderManager };
