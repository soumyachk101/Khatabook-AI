"use client";

import * as React from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { ReceiptList } from "@/components/receipts/ReceiptList";

function ReceiptsPage() {
 return (
 <AppShell>
 <ReceiptList />
 </AppShell>
 );
}

export default ReceiptsPage;
