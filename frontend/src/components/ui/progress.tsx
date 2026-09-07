"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

function Progress({ className, value = 0, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
 return (
 <ProgressPrimitive.Root
 data-slot="progress-root"
 className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
 {...props}
 >
 <ProgressPrimitive.Indicator
 data-slot="progress-indicator"
 className="h-full bg-primary transition-all"
 style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
 />
 </ProgressPrimitive.Root>
 );
}

export { Progress };
