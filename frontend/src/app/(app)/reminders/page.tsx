"use client";

import * as React from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { ReminderList } from "@/components/reminders/ReminderList";

function RemindersPage() {
 return (
 <AppShell>
 <ReminderList />
 </AppShell>
 );
}

export default RemindersPage;
