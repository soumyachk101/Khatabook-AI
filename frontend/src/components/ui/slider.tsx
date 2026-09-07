"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
 return (
 <SliderPrimitive.Root
 data-slot="slider"
 className={cn(
 "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:flex-col",
 className
 )}
 {...props}
 >
 <SliderPrimitive.Track
 data-slot="slider-track"
 className={cn(
 "relative grow overflow-hidden rounded-full bg-secondary data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
 )}
 >
 <SliderPrimitive.Range
 data-slot="slider-range"
 className={cn("absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")}
 />
 </SliderPrimitive.Track>
 {Array.from({ length: props.value?.length ?? 1 }).map((_, i) => (
 <SliderPrimitive.Thumb
 key={i}
 data-slot="slider-thumb"
 className="block size-4 rounded-full border border-primary/50 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
 />
 ))}
 </SliderPrimitive.Root>
 );
}

export { Slider };
