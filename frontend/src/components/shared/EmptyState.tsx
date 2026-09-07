"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps extends React.ComponentProps<"div"> {
 icon?: React.ReactNode;
 title: string;
 description?: string;
 action?: {
 label: string;
 onClick: () => void;
 };
}

function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
 return (
 <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)} {...props}>
 {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
 <h3 className="text-lg font-semibold mb-2">{title}</h3>
 {description && <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>}
 {action && (
 <Button onClick={action.onClick} size="sm">
 {action.label}
 </Button>
 )}
 </div>
 );
}

export { EmptyState };
