"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Camera, FileText, Plus, Receipt } from "lucide-react";

function QuickActions() {
 const actions = [
 { href: "/app/receipts/scan", icon: Camera, label: "Scan Receipt", color: "bg-blue-50 text-blue-600 dark:bg-blue-950" },
 { href: "/app/invoices/new", icon: FileText, label: "New Invoice", color: "bg-green-50 text-green-600 dark:bg-green-950" },
 { href: "/app/expenses/categories", icon: Plus, label: "Add Expense", color: "bg-amber-50 text-amber-600 dark:bg-amber-950" },
 { href: "/app/gst", icon: Receipt, label: "GST Summary", color: "bg-purple-50 text-purple-600 dark:bg-purple-950" },
 ];

 return (
 <Card className="p-6">
 <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {actions.map((action) => {
 const Icon = action.icon;
 return (
 <Link key={action.href} href={action.href}>
 <Button variant="outline" className={`w-full h-auto py-4 flex flex-col items-center gap-2 ${action.color}`}>
 <Icon className="size-6" />
 <span className="text-xs font-medium">{action.label}</span>
 </Button>
 </Link>
 );
 })}
 </div>
 </Card>
 );
}

export { QuickActions };
