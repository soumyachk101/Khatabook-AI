"use client";

import * as React from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { InvoiceList } from "@/components/invoices/InvoiceList";

function InvoicesPage() {
 return (
 <AppShell>
 <InvoiceList />
 </AppShell>
 );
}

export default InvoicesPage;
