"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, FileText, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

function BottomNav() {
 const pathname = usePathname();

 const navItems = [
 { href: "/dashboard", icon: Home, label: "Dashboard" },
 { href: "/receipts/scan", icon: Camera, label: "Scan" },
 { href: "/invoices", icon: FileText, label: "Invoices" },
 { href: "/settings", icon: MoreHorizontal, label: "More" },
 ];

 return (
 <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t bg-background md:hidden">
 <div className="flex items-center justify-around h-full px-2">
 {navItems.map((item) => {
 const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
 return (
 <Link
 key={item.href}
 href={item.href}
 className={cn(
 "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
 isActive ? "text-primary" : "text-muted-foreground"
 )}
 >
 <item.icon className={cn("size-5", isActive && "fill-primary/20")} />
 <span className="text-[10px] font-medium">{item.label}</span>
 </Link>
 );
 })}
 </div>
 </nav>
 );
}

export { BottomNav };
