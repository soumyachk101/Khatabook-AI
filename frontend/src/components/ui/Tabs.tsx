"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Tabs({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) {
 return <div className={cn("", className)} role="tablist" {...props} />
}
Tabs.displayName = "Tabs"

function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
 return (
 <div
 className={cn(
 "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
 className
 )}
 {...props} />
 )
}
TabsList.displayName = "TabsList"

function TabsTrigger({
 className,
 ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
 return (
 <button
 className={cn(
 "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm",
 className
 )}
 {...props} />
 )
}
TabsTrigger.displayName = "TabsTrigger"

function TabsContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
 return <div className={cn("mt-2", className)} {...props} />
}
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
