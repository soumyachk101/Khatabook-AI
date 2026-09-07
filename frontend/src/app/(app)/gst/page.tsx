"use client";

import * as React from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { GstSummary } from "@/components/gst/GstSummary";

function GstPage() {
 return (
 <AppShell>
 <GstSummary />
 </AppShell>
 );
}

export default GstPage;
