"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface Column<T> {
 key: string;
 header: string;
 cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
 columns: Column<T>[];
 data: T[];
 loading?: boolean;
 onRowClick?: (row: T) => void;
 emptyState?: { icon: React.ReactNode; title: string; description?: string };
}

function DataTable<T>({ columns, data, loading, onRowClick, emptyState }: DataTableProps<T>) {
 if (loading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 if (!data || data.length === 0) {
 return emptyState ? (
 <EmptyState icon={emptyState.icon} title={emptyState.title} description={emptyState.description} />
 ) : null;
 }

 return (
 <div className="rounded-md border">
 <Table>
 <TableHeader>
 <TableRow>
 {columns.map((col) => (
 <TableHead key={col.key}>{col.header}</TableHead>
 ))}
 </TableRow>
 </TableHeader>
 <TableBody>
 {data.map((row, i) => (
 <TableRow key={i} onClick={() => onRowClick?.(row)} className={onRowClick ? "cursor-pointer" : ""}>
 {columns.map((col) => (
 <TableCell key={col.key}>
 {col.cell ? col.cell(row) : (row as Record<string, unknown>)[col.key]?.toString()}
 </TableCell>
 ))}
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>
 );
}

export { DataTable };
