"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
 page: number;
 totalPages: number;
 onPageChange: (page: number) => void;
 className?: string;
}

function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
 if (totalPages <= 1) return null;
 return (
 <div className={cn("flex items-center justify-between", className)}>
 <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
 <ChevronLeft className="size-4 mr-1" /> Previous
 </Button>
 <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
 <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
 Next <ChevronRight className="size-4 ml-1" />
 </Button>
 </div>
 );
}

export { Pagination };
