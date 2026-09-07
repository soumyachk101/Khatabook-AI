"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

function DashboardPage() {
 return (
 <AppShell>
 <DashboardContent />
 </AppShell>
 );
}

export default DashboardPage;
