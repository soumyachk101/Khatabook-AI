import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Calendar, FileCheck } from 'lucide-react'

export interface GstReportCardProps {
 title: string
 description: string
 amount: string
 change?: string
 dueDate?: string
 invoices?: number
 taxAmount?: string
 onView?: () => void
 variant?: 'default' | 'highlight'
}

export function GstReportCard({ title, description, amount, change, dueDate, invoices, taxAmount, onView, variant = 'default' }: GstReportCardProps) {
 return (
 <Card className={cn(variant === 'highlight' && 'border-primary-200 shadow-md')}>
 <CardContent className="p-5">
 <div className="flex items-start justify-between">
 <div>
 <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
 {title === 'GSTR-1' && <FileCheck className="w-4 h-4" />}
 {title === 'GSTR-3B' && <FileCheck className="w-4 h-4" />}
 {title === 'Input Tax Credit' && <TrendingUp className="w-4 h-4" />}
 {title}
 </p>
 <p className="text-xs text-gray-400 mt-0.5">{description}</p>
 </div>
 <Badge status={variant === 'highlight' ? 'pending' : 'draft'} />
 </div>

 <div className="mt-4">
 <p className="text-2xl font-bold text-gray-900 font-mono">{amount}</p>
 {change && (
 <p className={cn('text-xs font-medium mt-1 flex items-center gap-1', change.startsWith('+') ? 'text-success-500' : 'text-error-500')}>
 <TrendingUp className="w-3 h-3" />
 {change}
 </p>
 )}
 </div>

 {taxAmount && (
 <p className="text-sm text-gray-600 mt-2">
 Tax: <span className="font-semibold font-mono">{taxAmount}</span>
 </p>
 )}

 {invoices !== undefined && (
 <p className="text-xs text-gray-500 mt-1">{invoices} invoices</p>
 )}

 {dueDate && (
 <p className="text-xs text-error-500 mt-2 flex items-center gap-1">
 <Calendar className="w-3 h-3" />
 Due: {dueDate}
 </p>
 )}

 {onView && (
 <button onClick={onView} className="mt-4 text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">
 Review & File →
 </button>
 )}
 </CardContent>
 </Card>
 )
}
