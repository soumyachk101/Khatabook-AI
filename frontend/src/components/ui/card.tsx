import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CardProps {
 children: React.ReactNode
 className?: string
 variant?: 'default' | 'stats' | 'hoverable'
 onClick?: () => void
 padding?: 'sm' | 'md' | 'lg'
}

const paddingMap = {
 sm: 'p-3',
 md: 'p-4',
 lg: 'p-6',
}

export function Card({ children, className, variant = 'default', onClick, padding = 'md' }: CardProps) {
 const hoverable = variant === 'hoverable' ? 'cursor-pointer card-hover' : ''
 const statsBorder = variant === 'stats' ? 'border-t-4' : ''

 return (
 <div
 className={cn(
 'bg-white rounded-card border border-gray-200 shadow-sm',
 paddingMap[padding],
 statsBorder,
 hoverable,
 onClick && 'cursor-pointer',
 className
 )}
 onClick={onClick}
 >
 {children}
 </div>
 )
}

interface StatCardProps {
 label: string
 value: string
 rawValue?: number
 trend: string
 trendUp: boolean
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

export function StatCard({ label, value, trend, trendUp, icon, color }: StatCardProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 className={cn('bg-white rounded-card border-t-4 border shadow-sm p-4', colorClasses[color])}
 >
 <div className="flex items-start justify-between">
 <div>
 <p className="text-sm text-gray-500 font-medium">{label}</p>
 <p className="text-2xl font-bold text-gray-900 mt-1 indian-number">{value}</p>
 <p className={cn('text-xs font-medium mt-1 flex items-center gap-1', trendUp ? 'text-success-500' : 'text-error-500')}>
 {trendUp ? <span>↑</span> : <span>↓</span>}
 {trend}
 </p>
 </div>
 <div className={cn('p-2 rounded-lg', iconColorClasses[color])}>
 {icon}
 </div>
 </div>
 </motion.div>
 )
}

interface BadgeProps {
 status: 'paid' | 'pending' | 'overdue' | 'draft' | 'processing' | 'sent' | 'viewed'
 text?: string
 size?: 'sm' | 'md'
}

const badgeConfig = {
 paid: { bg: 'bg-success-100', text: 'text-success-700', label: 'Paid', dot: 'bg-success-500' },
 pending: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'Pending', dot: 'bg-primary-500' },
 overdue: { bg: 'bg-error-100', text: 'text-error-700', label: 'Overdue', dot: 'bg-error-500' },
 draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft', dot: 'bg-gray-400' },
 processing: { bg: 'bg-accent-100', text: 'text-accent-700', label: 'Processing', dot: 'bg-accent-500' },
 sent: { bg: 'bg-primary-100', text: 'text-primary-700', label: 'Sent', dot: 'bg-primary-500' },
 viewed: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Viewed', dot: 'bg-purple-500' },
}

export function Badge({ status, text, size = 'md' }: BadgeProps) {
 const config = badgeConfig[status]
 const label = text || config.label
 const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

 return (
 <span className={cn('inline-flex items-center gap-1.5 rounded-full font-semibold', config.bg, config.text, sizeClasses)}>
 <span className={cn('w-2 h-2 rounded-full', config.dot)} />
 {label}
 </span>
 )
}
