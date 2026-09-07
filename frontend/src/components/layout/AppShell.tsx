"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useUiStore } from "@/lib/store";

function AppShell({ children }: { children: React.ReactNode }) {
 const { sidebarOpen } = useUiStore();

 return (
 <div className="min-h-screen bg-background">
 <Sidebar />
 <div className="md:ml-64">
 <Header />
 <main className="p-4 md:p-6 pb-24 md:pb-6">
 <ErrorBoundary>
 {children}
 </ErrorBoundary>
 </main>
 </div>
 <BottomNav />
 </div>
 );
}

export { AppShell };
