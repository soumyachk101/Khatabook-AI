'use client'

import DashboardShell from '@/components/features/dashboard-shell'
import { GstReportCard } from '@/components/features/gst-report-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { FileCheck, Calendar, Download } from 'lucide-react'
import { useInvoices } from '@/hooks/use-invoices'

export default function GSTPage() {
 const { invoices } = useInvoices()

 const paidInvoices = invoices.filter(i => i.status === 'paid')
 const totalOutput = paidInvoices.reduce((s, i) => s + i.amount, 0)
 const totalOutputTax = paidInvoices.reduce((s, i) => s + i.cgst + i.sgst, 0)

 const pendingInvoices = invoices.filter(i => ['sent', 'viewed', 'overdue'].includes(i.status))
 const totalInputTax = pendingInvoices.reduce((s, i) => s + i.cgst + i.sgst, 0)

 const netPayable = totalOutputTax - totalInputTax

 return (
 <DashboardShell>
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">GST Reports</h1>
 <p className="text-sm text-gray-500 mt-0.5">Generate and download your GST returns. FY 2026-27</p>
 </div>
 <div className="flex items-center gap-2">
 <Button variant="outline" size="sm">Q2 2026 ▾</Button>
 </div>
 </div>

 {/* Summary Cards */}
 <div className="grid gap-4 md:grid-cols-3">
 <Card>
 <CardContent className="p-5">
 <p className="text-sm text-gray-500 font-medium">Output GST</p>
 <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">₹{totalOutputTax.toLocaleString('en-IN')}</p>
 <p className="text-xs text-success-500 mt-1">↑ 12% from last month</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-5">
 <p className="text-sm text-gray-500 font-medium">Input GST (ITC)</p>
 <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">₹{totalInputTax.toLocaleString('en-IN')}</p>
 <p className="text-xs text-success-500 mt-1">↑ 8% from last month</p>
 </CardContent>
 </Card>
 <Card className="border-primary-200">
 <CardContent className="p-5">
 <p className="text-sm text-gray-500 font-medium">Net GST Payable</p>
 <p className="text-2xl font-bold text-primary-500 mt-1 font-mono">₹{Math.max(0, netPayable).toLocaleString('en-IN')}</p>
 <p className="text-xs text-error-500 mt-1">Due: 20 Sep 2026</p>
 </CardContent>
 </Card>
 </div>

 {/* Compliance Calendar */}
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-base">
 <Calendar className="w-5 h-5 text-primary-500" />
 Compliance Calendar
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="grid grid-cols-7 gap-1 text-center text-xs">
 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
 <div key={d} className="font-medium text-gray-500 py-2">{d}</div>
 ))}
 {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
 const isDue = day === 10 || day === 20
 return (
 <div key={day} className={cn(
 'py-2 rounded-md',
 isDue ? 'bg-error-100 text-error-700 font-semibold' : 'text-gray-600'
 )}>
 {day}
 {isDue && <span className="block text-[10px]">Due</span>}
 </div>
 )
 })}
 </div>
 <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
 <span className="flex items-center gap-1"><span className="w-2 h-2 bg-error-500 rounded-full" /> Due Date</span>
 <span className="flex items-center gap-1"><span className="w-2 h-2 bg-success-500 rounded-full" /> Filed</span>
 <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-200 rounded-full" /> No data</span>
 </div>
 </CardContent>
 </Card>

 {/* Reports */}
 <Tabs defaultValue="gstr1">
 <TabsList>
 <TabsTrigger value="gstr1">GSTR-1</TabsTrigger>
 <TabsTrigger value="gstr3b">GSTR-3B</TabsTrigger>
 <TabsTrigger value="itc">ITC</TabsTrigger>
 </TabsList>

 <TabsContent value="gstr1" className="mt-4">
 <GstReportCard
 title="GSTR-1"
 description="Outward Supplies"
 amount={`₹${totalOutput.toLocaleString('en-IN')}`}
 change="+12% from last month"
 taxAmount={`₹${totalOutputTax.toLocaleString('en-IN')}`}
 invoices={paidInvoices.length}
 variant="highlight"
 onView={() => {}}
 />
 </TabsContent>

 <TabsContent value="gstr3b" className="mt-4">
 <GstReportCard
 title="GSTR-3B"
 description="Monthly Return Summary"
 amount={`₹${Math.max(0, netPayable).toLocaleString('en-IN')}`}
 change="Payable amount"
 taxAmount={`Output: ₹${totalOutputTax.toLocaleString('en-IN')} · ITC: ₹${totalInputTax.toLocaleString('en-IN')}`}
 variant="highlight"
 onView={() => {}}
 />
 </TabsContent>

 <TabsContent value="itc" className="mt-4">
 <GstReportCard
 title="Input Tax Credit"
 description="Available vs Claimed"
 amount={`₹${totalInputTax.toLocaleString('en-IN')}`}
 change="Fully utilized"
 onView={() => {}}
 />
 </TabsContent>
 </Tabs>

 {/* Export buttons */}
 <div className="flex flex-wrap gap-3">
 <Button variant="outline">
 <Download className="w-4 h-4 mr-2" />
 Download GSTR-1 JSON
 </Button>
 <Button variant="outline">
 <Download className="w-4 h-4 mr-2" />
 Download GSTR-3B Excel
 </Button>
 <Button variant="outline">
 <Download className="w-4 h-4 mr-2" />
 Annual Summary PDF
 </Button>
 </div>
 </div>
 </DashboardShell>
 )
}
