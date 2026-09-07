"use client";

import * as React from "react";
import { IndianRupee } from "lucide-react";

interface IndianNumberFormatProps {
 value: number;
 currency?: boolean;
 className?: string;
}

function IndianNumberFormat({ value, currency = true, className }: IndianNumberFormatProps) {
 const formatted = new Intl.NumberFormat("en-IN", {
 style: currency ? "currency" : "decimal",
 currency: "INR",
 maximumFractionDigits: currency ? 2 : 0,
 }).format(value);

 return (
 <span className={cn("indian-number inline-flex items-center gap-1", className)}>
 {currency && <IndianRupee className="size-3.5" />}
 {formatted}
 </span>
 );
}

export { IndianNumberFormat };
