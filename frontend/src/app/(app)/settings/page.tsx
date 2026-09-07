"use client";

import * as React from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { SettingsPageContent } from "@/components/shared/SettingsPageContent";

function SettingsPage() {
 return (
 <AppShell>
 <SettingsPageContent />
 </AppShell>
 );
}

export default SettingsPage;
