"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useReminders } from "@/hooks/use-reminders";
import { Bell, Plus } from "lucide-react";

function ReminderList() {
 const { data: reminders, isLoading } = useReminders();

 if (isLoading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 if (!reminders || reminders.length === 0) {
 return (
 <EmptyState
 icon={<Bell className="size-12" />}
 title="No reminders"
 description="Create reminders to never miss a payment or GST deadline."
 action={{ label: "Create Reminder", onClick: () => {} }}
 />
 );
 }

 return (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="text-xl font-bold">Reminders</h2>
 <Button>
 <Plus className="size-4 mr-2" />
 New Reminder
 </Button>
 </div>

 <div className="space-y-3">
 {reminders.map((reminder) => (
 <Card key={reminder.id} className="p-4">
 <div className="flex items-start justify-between">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span className={`text-xs px-2 py-0.5 rounded-full ${reminder.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
 {reminder.isActive ? "Active" : "Paused"}
 </span>
 <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">{reminder.channel}</span>
 <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 capitalize">{reminder.type}</span>
 </div>
 <p className="font-medium">{reminder.subject}</p>
 <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{reminder.body}</p>
 <p className="text-xs text-muted-foreground mt-2">
 {reminder.schedule.frequency} at {reminder.schedule.time}
 </p>
 </div>
 <div className="flex gap-1 ml-4">
 <Button variant="ghost" size="sm">Edit</Button>
 </div>
 </div>
 </Card>
 ))}
 </div>
 </div>
 );
}

export { ReminderList };
