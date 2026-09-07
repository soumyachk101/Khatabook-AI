"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useItcSummary } from "@/hooks/use-gst";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";

function ItcSummary() {
 const { data: itcData, isLoading } = useItcSummary();

 if (isLoading) {
 return (
 <div className="flex justify-center py-12">
 <LoadingSpinner size="lg" />
 </div>
 );
 }

 const data = itcData || [
 { itcType: "input", totalItc: 45000, itcAvailable: 45000, itcClaimed: 42000, itcIneligible: 3000, ineligibleReason: "Blocked ITC" },
 { itcType: "input_service", totalItc: 20000, itcAvailable: 20000, itcClaimed: 18000, itcIneligible: 2000 },
 ];

 return (
 <Card className="p-6">
 <h3 className="font-semibold text-lg mb-4">Input Tax Credit Summary</h3>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
 <div className="p-3 bg-muted/50 rounded-lg">
 <p className="text-xs text-muted-foreground">Total ITC</p>
 <p className="font-bold text-lg"><IndianNumberFormat value={data.reduce((s, d) => s + d.totalItc, 0)} /></p>
 </div>
 <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
 <p className="text-xs text-green-600">Available</p>
 <p className="font-bold text-lg text-green-700"><IndianNumberFormat value={data.reduce((s, d) => s + d.itcAvailable, 0)} /></p>
 </div>
 <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
 <p className="text-xs text-blue-600">Claimed</p>
 <p className="font-bold text-lg text-blue-700"><IndianNumberFormat value={data.reduce((s, d) => s + d.itcClaimed, 0)} /></p>
 </div>
 <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
 <p className="text-xs text-amber-600">Ineligible</p>
 <p className="font-bold text-lg text-amber-700"><IndianNumberFormat value={data.reduce((s, d) => s + d.itcIneligible, 0)} /></p>
 </div>
 </div>

 <h4 className="font-medium mb-3">Utilization</h4>
 {data.map((item) => {
 const utilization = (item.itcClaimed / item.totalItc) * 100;
 return (
 <div key={item.itcType} className="mb-4">
 <div className="flex justify-between text-sm mb-1">
 <span className="capitalize">{item.itcType.replace("_", " ")}</span>
 <span>{Math.round(utilization)}% utilized</span>
 </div>
 <Progress value={utilization} className="h-2" />
 {item.itcIneligible > 0 && (
 <p className="text-xs text-muted-foreground mt-1">{item.ineligibleReason || "Ineligible as per rules"}</p>
 )}
 </div>
 );
 })}
 </Card>
 );
}

export { ItcSummary };
