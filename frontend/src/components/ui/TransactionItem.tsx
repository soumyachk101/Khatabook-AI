import React from 'react'
import { cn } from '@/lib/utils'
import { MoreVertical } from 'lucide-react'

interface TransactionItemProps {
 icon: React.ReactNode
 title: string
 subtitle: string
 amount: string
 amountColor?: string
 status?: React.ReactNode
 onClick?: () => void
}

export function TransactionItem({ icon, title, subtitle, amount, amountColor = 'text-gray-900', status, onClick }: TransactionItemProps) {
 return (
 <div
 onClick={onClick}
 className={cn(
 'flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0',
 onClick && 'cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors'
 )}
 >
 <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
 {icon}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
 <p className="text-xs text-gray-500 truncate">{subtitle}</p>
 </div>
 <div className="text-right shrink-0">
 <p className={cn('text-sm font-semibold indian-number', amountColor)}>{amount}</p>
 {status && <div className="mt-0.5">{status}</div>}
 </div>
 </div>
 )
}

interface QuickActionProps {
 icon: React.ReactNode
 label: string
 onClick: () => void
 variant?: 'primary' | 'default'
}

export function QuickAction({ icon, label, onClick, variant = 'default' }: QuickActionProps) {
 return (
 <button
 onClick={onClick}
 className={cn(
 'flex flex-col items-center justify-center gap-2 p-4 rounded-card border transition-all btn-press',
 variant === 'primary'
 ? 'bg-success-500 border-success-500 text-white shadow-md'
 : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50'
 )}
 >
 <div className={cn('p-2 rounded-lg', variant === 'primary' ? 'bg-white/20' : 'bg-gray-100')}>
 {icon}
 </div>
 <span className="text-xs font-semibold">{label}</span>
 </button>
 )
}

interface SectionHeaderProps {
 title: string
 subtitle?: string
 action?: React.ReactNode
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
 return (
 <div className="flex items-center justify-between mb-4">
 <div>
 <h2 className="text-lg font-bold text-gray-900">{title}</h2>
 {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
 </div>
 {action}
 </div>
 )
}
