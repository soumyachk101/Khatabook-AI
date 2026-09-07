"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

function Toaster() {
 const { toasts } = useToast();

 return (
 <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-md">
 {toasts.map(function ({ id, title, description, action, variant, ...props }) {
 return (
 <div key={id} className={cn("flex items-center gap-4 rounded-md border p-4 shadow-lg", {
 "border bg-background": variant === "default" || !variant,
 "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100": variant === "success",
 "border-destructive bg-destructive text-destructive-foreground": variant === "destructive",
 })} {...props}>
 <div className="flex-1">
 {title && <div className="text-sm font-semibold">{title}</div>}
 {description && <div className="text-sm opacity-90">{description}</div>}
 </div>
 {action}
 </div>
 );
 })}
 </div>
 );
}

export { Toaster };
