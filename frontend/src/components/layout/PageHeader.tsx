"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
 label: string;
 href?: string;
}

interface PageHeaderProps {
 title: string;
 description?: string;
 breadcrumbs?: BreadcrumbItem[];
 actions?: React.ReactNode;
 className?: string;
}

function PageHeader({ title, description, breadcrumbs, actions, className }: PageHeaderProps) {
 return (
 <div className={cn("mb-6", className)}>
 {breadcrumbs && breadcrumbs.length > 0 && (
 <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
 <Link href="/dashboard" className="hover:text-foreground">
 <Home className="size-4" />
 </Link>
 {breadcrumbs.map((crumb, i) => (
 <React.Fragment key={i}>
 <ChevronRight className="size-3" />
 {crumb.href ? (
 <Link href={crumb.href} className="hover:text-foreground">
 {crumb.label}
 </Link>
 ) : (
 <span className="text-foreground font-medium">{crumb.label}</span>
 )}
 </React.Fragment>
 ))}
 </nav>
 )}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold">{title}</h1>
 {description && <p className="text-muted-foreground mt-1">{description}</p>}
 </div>
 {actions && <div className="flex items-center gap-2">{actions}</div>}
 </div>
 </div>
 );
}

export { PageHeader };
