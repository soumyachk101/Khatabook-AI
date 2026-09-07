"use client";

import * as React from "react";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { ExpenseList } from "@/components/expenses/ExpenseList";

function ExpensesPage() {
 return (
 <AppShell>
 <ExpenseList />
 </AppShell>
 );
}

export default ExpensesPage;
