'use client'

import DashboardShell from '@/components/features/dashboard-shell'
import { useInvoices } from '@/hooks/use-invoices'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Plus, Eye, Download, Share2, MoreVertical, FileText, IndianRupee } from 'lucide-react'
import { useState } from 'react'

export default function InvoicesPage() {
 const { invoices, isLoading, markAsPaid, deleteInvoice } = useInvoices()
 const [activeTab, setActiveTab] = useState('all')

 const filtered = activeTab === 'all'
 ? invoices
 : invoices.filter(i => i.status === activeTab)

 const totals = {
 total: invoices.reduce((s, i) => s + i.amount, 0),
 paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
 due: invoices.filter(i => ['sent', 'viewed', 'overdue'].includes(i.status)).reduce((s, i) => s + i.amount, 0),
 }

 const statusCounts = {
 all: invoices.length,
 draft: invoices.filter(i => i.status === 'draft').length,
 sent: invoices.filter(i => i.status === 'sent').length,
 viewed: invoices.filter(i => i.status === 'viewed').length,
 paid: invoices.filter(i => i.status === 'paid').length,
 overdue: invoices.filter(i => i.status === 'overdue').length,
 }

 return (
 <DashboardShell>
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
 <p className="text-sm text-gray-500 mt-0.5">Manage and send invoices to your clients.</p>
 </div>
 <Link href="/invoices/create">
 <Button>
 <Plus className="w-4 h-4 mr-2" />
 Create Invoice
 </Button>
 </Link>
 </div>

 {/* Summary */}
 <div className="grid grid-cols-3 gap-4">
 <Card>
 <CardContent className="p-4">
 <p className="text-sm text-gray-500">Total</p>
 <p className="text-xl font-bold text-gray-900 font-mono">₹{totals.total.toLocaleString('en-IN')}</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <p className="text-sm text-gray-500">Paid</p>
 <p className="text-xl font-bold text-success-500 font-mono">₹{totals.paid.toLocaleString('en-IN')}</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-4">
 <p className="text-sm text-gray-500">Due</p>
 <p className="text-xl font-bold text-accent-500 font-mono">₹{totals.due.toLocaleString('en-IN')}</p>
 </CardContent>
 </Card>
 </div>

 {/* Filter tabs */}
 <Tabs value={activeTab} onValueChange={setActiveTab}>
 <TabsList className="w-full justify-start overflow-x-auto">
 <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
 <TabsTrigger value="draft">Draft ({statusCounts.draft})</TabsTrigger>
 <TabsTrigger value="sent">Sent ({statusCounts.sent})</TabsTrigger>
 <TabsTrigger value="paid">Paid ({statusCounts.paid})</TabsTrigger>
 <TabsTrigger value="overdue">Overdue ({statusCounts.overdue})</TabsTrigger>
 </TabsList>

 <TabsContent value={activeTab} className="mt-4">
 {isLoading ? (
 <Card><CardContent className="p-8 text-center text-sm text-gray-500">Loading...</CardContent></Card>
 ) : filtered.length === 0 ? (
 <Card>
 <CardContent className="p-8 text-center">
 <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
 <p className="text-sm text-gray-500">No invoices found. Create your first invoice!</p>
 <Link href="/invoices/create">
 <Button className="mt-4">Create Invoice</Button>
 </Link>
 </CardContent>
 </Card>
 ) : (
 <div className="space-y-3">
 {filtered.map(invoice => (
 <Card key={invoice.id} className="hover:shadow-md transition-shadow">
 <CardContent className="p-4">
 <div className="flex items-start justify-between">
 <div className="flex items-start gap-3">
 <div className="p-2 rounded-lg bg-primary-100 text-primary-500">
 <FileText className="w-5 h-5" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="font-semibold text-gray-900">{invoice.number}</h3>
 <Badge status={invoice.status} />
 </div>
 <p className="text-sm text-gray-600 mt-0.5">{invoice.clientName}</p>
 <p className="text-xs text-gray-400 mt-1">
 {invoice.status === 'paid' && invoice.paidDate ? `Paid on ${new Date(invoice.paidDate).toLocaleDateString('en-IN')}` : (
 invoice.status === 'overdue' ? '22 days overdue' : (
 invoice.status === 'sent' ? `Due ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}` : 'Not sent yet'
 )
 )}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="text-right">
 <p className="font-semibold text-gray-900 font-mono">₹{invoice.amount.toLocaleString('en-IN')}</p>
 <p className="text-xs text-gray-400">{new Date(invoice.date).toLocaleDateString('en-IN')}</p>
 </div>
 <div className="flex gap-1">
 {invoice.status !== 'paid' && (
 <Button variant="ghost" size="icon" onClick={() => markAsPaid(invoice.id)} title="Mark as paid">
 <IndianRupee className="w-4 h-4 text-success-500" />
 </Button>
 )}
 <Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-gray-400" /></Button>
 <Button variant="ghost" size="icon"><Download className="w-4 h-4 text-gray-400" /></Button>
 <Button variant="ghost" size="icon" onClick={() => deleteInvoice(invoice.id)}><Trash2 className="w-4 h-4 text-gray-400" /></Button>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}
 </TabsContent>
 </Tabs>
 </div>
 </DashboardShell>
 )
}
