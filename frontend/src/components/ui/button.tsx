import * as React from "react";

import { cn } from "@/lib/utils";

function Button({ className, variant = "default", size = "default", ...props }: React.ComponentProps<"button"> & { variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "upi" }) {
 return (
 <button
 data-slot="button"
 className={cn(
 "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
 {
 "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
 "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
 "border bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
 "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
 "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
 "text-primary underline-offset-4 hover:underline": variant === "link",
 "bg-upi-green text-white hover:bg-upi-green/90": variant === "upi",
 },
 {
 "h-9 px-4 py-2": size === "default",
 "h-8 rounded-md gap-1.5 px-3": size === "sm",
 "h-10 rounded-md px-6": size === "lg",
 "h-11 rounded-full px-6": size === "xl",
 "h-9 w-9": size === "icon",
 },
 className
 )}
 {...props}
 />
 );
}

export { Button };
