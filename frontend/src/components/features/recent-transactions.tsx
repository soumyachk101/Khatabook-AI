import React from 'react'
import { cn } from '@/lib/utils'
import { Receipt, FileText, Wallet } from 'lucide-react'

export interface RecentTransaction {
 id: string
 type: 'receipt' | 'invoice' | 'expense'
 title: string
 amount: string
 description: string
 time: string
 status?: string
}

interface RecentTransactionsProps {
 transactions: RecentTransaction[]
 onViewAll?: () => void
 title?: string
}

const iconMap = {
 receipt: Receipt,
 invoice: FileText,
 expense: Wallet,
}

const colorMap = {
 receipt: 'text-primary-500 bg-primary-100',
 invoice: 'text-success-500 bg-success-100',
 expense: 'text-error-500 bg-error-100',
}

export function RecentTransactions({ transactions, onViewAll, title = 'Recent Activity' }: RecentTransactionsProps) {
 return (
 <div className="bg-white rounded-card border border-gray-200 shadow-sm">
 <div className="flex items-center justify-between p-4 pb-2">
 <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
 {onViewAll && (
 <button onClick={onViewAll} className="text-sm text-primary-500 hover:text-primary-600 font-medium">
 View All
 </button>
 )}
 </div>
 <div className="divide-y divide-gray-100">
 {transactions.length === 0 ? (
 <div className="p-8 text-center text-sm text-gray-500">
 No transactions yet. Start by scanning a receipt!
 </div>
 ) : (
 transactions.map((tx, i) => {
 const Icon = iconMap[tx.type]
 return (
 <div key={tx.id} className={cn('flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors', i === 0 && 'rounded-t-card')}>
 <div className={cn('p-2 rounded-lg', colorMap[tx.type])}>
 <Icon className="w-4 h-4" />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between">
 <p className="text-sm font-medium text-gray-900 truncate">{tx.title}</p>
 <p className="text-sm font-semibold text-gray-900 font-mono">{tx.amount}</p>
 </div>
 <p className="text-xs text-gray-500 mt-0.5">{tx.description}</p>
 </div>
 </div>
 )
 })
 )}
 </div>
 </div>
 )
}
