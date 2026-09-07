"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PaymentStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

const statusConfig: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "outline" }> = {
 draft: { label: "Draft", variant: "secondary" },
 sent: { label: "Sent", variant: "default" },
 paid: { label: "Paid", variant: "success" },
 overdue: { label: "Overdue", variant: "destructive" },
 cancelled: { label: "Cancelled", variant: "outline" },
};

interface PaymentStatusBadgeProps {
 status: PaymentStatus;
 className?: string;
}

function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
 const config = statusConfig[status] || statusConfig.draft;

 return (
 <Badge variant={config.variant} className={cn("capitalize", className)}>
 {config.label}
 </Badge>
 );
}

export { PaymentStatusBadge };
