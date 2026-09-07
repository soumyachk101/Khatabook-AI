"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Receipt, FileInput, Wallet, ReceiptText, Bell, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { SheetContent, SheetTrigger, Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/lib/store";

const navItems = [
 { href: "/dashboard", icon: FileText, label: "Dashboard" },
 { href: "/receipts", icon: Receipt, label: "Receipts" },
 { href: "/invoices", icon: FileInput, label: "Invoices" },
 { href: "/expenses", icon: Wallet, label: "Expenses" },
 { href: "/gst", icon: ReceiptText, label: "GST" },
 { href: "/payments", icon: Wallet, label: "Payments" },
 { href: "/reminders", icon: Bell, label: "Reminders" },
 { href: "/settings", icon: Settings, label: "Settings" },
];

function SidebarNavItem({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
 const pathname = usePathname();
 const isActive = pathname === href || pathname.startsWith(href + "/");

 return (
 <Link
 href={href}
 className={cn(
 "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
 isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
 )}
 >
 <Icon className="size-4" />
 {label}
 </Link>
 );
}

function SidebarContent() {
 const { user, logout } = useUserStore();

 return (
 <div className="flex flex-col h-full">
 <div className="p-4 border-b">
 <Link href="/dashboard" className="flex items-center gap-2">
 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
 <FileText className="w-5 h-5 text-white" />
 </div>
 <span className="font-bold text-lg">Khatabook AI</span>
 </Link>
 </div>

 <ScrollArea className="flex-1 px-3 py-4">
 <nav className="space-y-1">
 {navItems.map((item) => (
 <SidebarNavItem key={item.href} {...item} />
 ))}
 </nav>
 </ScrollArea>

 <Separator />
 <div className="p-3">
 {user && (
 <div className="flex items-center gap-3 p-2">
 <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
 {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate">{user.name}</p>
 <p className="text-xs text-muted-foreground truncate">{user.businessName}</p>
 </div>
 </div>
 )}
 <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
 <LogOut className="size-4 mr-2" />
 Sign Out
 </Button>
 </div>
 </div>
 );
}

function Sidebar() {
 return (
 <>
 <aside className="hidden md:flex w-64 h-screen sticky top-0 border-r bg-background">
 <SidebarContent />
 </aside>
 <Sheet>
 <SheetTrigger asChild>
 <Button variant="ghost" size="icon" className="md:hidden">
 <FileText className="size-5" />
 </Button>
 </SheetTrigger>
 <SheetContent side="left" className="w-64 p-0">
 <SidebarContent />
 </SheetContent>
 </Sheet>
 </>
 );
}

export { Sidebar };
