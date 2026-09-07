"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.ComponentProps<"div"> {
 size?: "sm" | "md" | "lg";
}

function LoadingSpinner({ className, size = "md", ...props }: LoadingSpinnerProps) {
 const sizeClasses = {
 sm: "size-4",
 md: "size-8",
 lg: "size-12",
 };

 return (
 <div className={cn("flex items-center justify-center", className)} {...props}>
 <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
 </div>
 );
}

export { LoadingSpinner };
