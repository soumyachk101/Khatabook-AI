"use client";

import * as React from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { PaymentHistory } from "@/components/payments/PaymentHistory";

function PaymentsPage() {
 return (
 <AppShell>
 <PaymentHistory />
 </AppShell>
 );
}

export default PaymentsPage;
