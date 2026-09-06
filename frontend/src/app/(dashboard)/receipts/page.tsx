'use client'

import DashboardShell from '@/components/features/dashboard-shell'
import { ReceiptScanner } from '@/components/features/receipt-scanner'
import { useReceipts } from '@/hooks/use-receipts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { IndianRupee, Calendar, Tag, Trash2, Plus } from 'lucide-react'

export default function ReceiptsPage() {
 const { receipts, isLoading, deleteReceipt } = useReceipts()

 return (
 <DashboardShell>
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Receipt Scanner</h1>
 <p className="text-sm text-gray-500 mt-0.5">Upload a receipt and let AI extract the details automatically.</p>
 </div>
 <Button>
 <Plus className="w-4 h-4 mr-2" />
 New Scan
 </Button>
 </div>

 <Tabs defaultValue="scan">
 <TabsList>
 <TabsTrigger value="scan">Scan Receipt</TabsTrigger>
 <TabsTrigger value="history">History ({receipts.length})</TabsTrigger>
 </TabsList>

 <TabsContent value="scan" className="mt-4">
 <ReceiptScanner />
 </TabsContent>

 <TabsContent value="history" className="mt-4">
 {isLoading ? (
 <Card>
 <CardContent className="p-8 text-center">
 <p className="text-sm text-gray-500">Loading receipts...</p>
 </CardContent>
 </Card>
 ) : receipts.length === 0 ? (
 <Card>
 <CardContent className="p-8 text-center">
 <p className="text-sm text-gray-500">No receipts yet. Scan your first receipt to get started!</p>
 </CardContent>
 </Card>
 ) : (
 <div className="space-y-3">
 {receipts.map(receipt => (
 <Card key={receipt.id} className="hover:shadow-md transition-shadow">
 <CardContent className="p-4">
 <div className="flex items-start justify-between">
 <div className="flex items-start gap-3">
 <div className="p-2 rounded-lg bg-primary-100 text-primary-500">
 <IndianRupee className="w-5 h-5" />
 </div>
 <div>
 <h3 className="font-semibold text-gray-900">{receipt.vendor}</h3>
 <p className="text-sm text-gray-500">{receipt.category}</p>
 <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
 <span className="flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 {new Date(receipt.date).toLocaleDateString('en-IN')}
 </span>
 <span className="flex items-center gap-1">
 <Tag className="w-3 h-3" />
 {receipt.paymentMode}
 </span>
 </div>
 {receipt.items && receipt.items.length > 0 && (
 <div className="mt-2 text-xs text-gray-500">
 {receipt.items.map(item => `${item.name} x${item.qty}`).join(', ')}
 </div>
 )}
 </div>
 </div>
 <div className="flex items-center gap-3">
 <div className="text-right">
 <p className="font-semibold text-gray-900 font-mono">₹{receipt.amount.toLocaleString('en-IN')}</p>
 {(receipt.cgst || receipt.sgst) && (
 <p className="text-xs text-gray-400">CGST + SGST included</p>
 )}
 </div>
 <Button variant="ghost" size="icon" onClick={() => deleteReceipt(receipt.id)} className="text-gray-400 hover:text-error-500">
 <Trash2 className="w-4 h-4" />
 </Button>
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
