import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
 title: string
 value: string
 rawValue?: number
 trend?: string
 trendUp?: boolean
 icon: React.ReactNode
 color: 'primary' | 'success' | 'accent' | 'error'
}

const colorClasses = {
 primary: 'border-t-primary-500 bg-primary-50',
 success: 'border-t-success-500 bg-success-50',
 accent: 'border-t-accent-500 bg-accent-50',
 error: 'border-t-error-500 bg-error-50',
}

const iconColorClasses = {
 primary: 'text-primary-500 bg-primary-100',
 success: 'text-success-500 bg-success-100',
 accent: 'text-accent-500 bg-accent-100',
 error: 'text-error-500 bg-error-100',
}

export function StatsCard({ title, value, trend, trendUp = true, icon, color }: StatsCardProps) {
 return (
 <div className={cn('bg-white rounded-card border-t-4 border shadow-sm p-4', colorClasses[color])}>
 <div className="flex items-start justify-between">
 <div>
 <p className="text-sm text-gray-500 font-medium">{title}</p>
 <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">{value}</p>
 {trend && (
 <p className={cn('text-xs font-medium mt-1 flex items-center gap-1', trendUp ? 'text-success-500' : 'text-error-500')}>
 {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
 {trend}
 </p>
 )}
 </div>
 <div className={cn('p-2 rounded-lg', iconColorClasses[color])}>
 {icon}
 </div>
 </div>
 </div>
 )
}
