"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitives.Root>) {
 return (
 <SwitchPrimitives.Root
 data-slot="switch"
 className={cn(
 "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-all",
 "bg-muted data-[state=checked]:bg-primary",
 "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
 "disabled:cursor-not-allowed disabled:opacity-50",
 className
 )}
 {...props}
 >
 <SwitchPrimitives.Thumb
 data-slot="switch-thumb"
 className={cn(
 "pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
 "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
 )}
 />
 </SwitchPrimitives.Root>
 );
}

export { Switch };
