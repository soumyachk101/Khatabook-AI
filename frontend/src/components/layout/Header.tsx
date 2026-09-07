"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/SearchInput";
import { CurrencySelector } from "@/components/shared/CurrencySelector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUiStore } from "@/lib/store";
import { useUserStore } from "@/lib/store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Bell } from "lucide-react";

function Header() {
 const pathname = usePathname();
 const { toggleSidebar } = useUiStore();
 const { user, language } = useUserStore();

 return (
 <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4">
 <div className="flex items-center gap-3">
 <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
 <Menu className="size-5" />
 </Button>
 <Link href="/dashboard" className="flex items-center gap-2">
 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
 <FileText className="w-5 h-5 text-white" />
 </div>
 <span className="font-bold text-xl hidden sm:block">Khatabook AI</span>
 </Link>
 </div>

 <div className="flex-1 max-w-md mx-4 hidden sm:block">
 <SearchInput placeholder="Search invoices, receipts..." className="w-full" />
 </div>

 <div className="flex items-center gap-2 ml-auto">
 <div className="hidden md:block">
 <CurrencySelector />
 </div>

 <Button variant="ghost" size="icon" className="relative">
 <Bell className="size-5" />
 <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
 </Button>

 <Avatar className="h-8 w-8">
 <AvatarFallback className="bg-primary text-primary-foreground text-xs">
 {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"}
 </AvatarFallback>
 </Avatar>
 </div>
 </header>
 );
}

export { Header };
