"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGstr1Tables } from "@/hooks/use-gst";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";

function Gstr1Table() {
 const { data: tables, isLoading } = useGstr1Tables();

 if (isLoading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 const sections = ["B2B", "B2C", "B2CS", "B2BA", "CDNR", "CDNUR"];

 return (
 <Card className="p-6">
 <h3 className="font-semibold text-lg mb-4">GSTR-1 Tables</h3>
 <Tabs defaultValue="B2B">
 <TabsList>
 {sections.map((s) => (
 <TabsTrigger key={s} value={s}>{s}</TabsTrigger>
 ))}
 </TabsList>
 {sections.map((section) => {
 const table = tables?.find((t) => t.section === section);
 return (
 <TabsContent key={section} value={section}>
 {table ? (
 <div className="overflow-x-auto">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Invoice #</TableHead>
 <TableHead>GSTIN</TableHead>
 <TableHead>Date</TableHead>
 <TableHead>Value</TableHead>
 <TableHead>Place of Supply</TableHead>
 <TableHead className="text-right">Taxable</TableHead>
 <TableHead className="text-right">CGST</TableHead>
 <TableHead className="text-right">SGST</TableHead>
 <TableHead className="text-right">IGST</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 <TableRow>
 <TableCell colSpan={3} className="text-center text-muted-foreground">No invoices in this section</TableCell>
 <TableCell colSpan={6} className="text-right">
 <div className="flex justify-between text-sm">
 <span>Total Taxable: <IndianNumberFormat value={table.totalTaxableValue} /></span>
 <span>CGST: <IndianNumberFormat value={table.totalCgst} /></span>
 <span>SGST: <IndianNumberFormat value={table.totalSgst} /></span>
 <span>IGST: <IndianNumberFormat value={table.totalIgst} /></span>
 </div>
 </TableCell>
 </TableRow>
 </TableBody>
 </Table>
 </div>
 ) : (
 <p className="text-center text-muted-foreground py-8">No data for this section</p>
 )}
 </TabsContent>
 );
 })}
 </Tabs>
 </Card>
 );
}

export { Gstr1Table };
