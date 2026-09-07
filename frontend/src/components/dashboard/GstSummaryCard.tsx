"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGstReturns } from "@/hooks/use-gst";
import { formatIndianCurrency } from "@/lib/format";
import { IndianNumberFormat } from "@/components/shared/IndianNumberFormat";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

function GstSummaryCard() {
 const { data: returns } = useGstReturns();
 const latestReturn = returns?.[0];

 if (!latestReturn) return null;

 const itcUtilization = latestReturn.itcAvailable > 0 ? (latestReturn.itcClaimed / latestReturn.itcAvailable) * 100 : 0;

 return (
 <Card className="p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold">GST Summary</h3>
 <Badge variant={latestReturn.status === "filed" ? "success" : "warning"}>{latestReturn.status}</Badge>
 </div>
 <div className="space-y-3">
 <div className="flex justify-between">
 <span className="text-sm text-muted-foreground">Return</span>
 <span className="text-sm font-medium">{latestReturn.returnType} {latestReturn.quarter}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-sm text-muted-foreground">Turnover</span>
 <span className="text-sm font-medium"><IndianNumberFormat value={latestReturn.totalTurnover} /></span>
 </div>
 <div className="flex justify-between">
 <span className="text-sm text-muted-foreground">Tax</span>
 <span className="text-sm font-medium"><IndianNumberFormat value={latestReturn.totalTax} /></span>
 </div>
 <div>
 <div className="flex justify-between mb-1">
 <span className="text-sm text-muted-foreground">ITC Utilization</span>
 <span className="text-xs text-muted-foreground">{Math.round(itcUtilization)}%</span>
 </div>
 <Progress value={itcUtilization} />
 </div>
 </div>
 <Button variant="outline" size="sm" className="w-full mt-4" asChild>
 <Link href="/app/gst">View Details</Link>
 </Button>
 </Card>
 );
}

export { GstSummaryCard };
