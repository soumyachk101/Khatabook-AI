import React from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
 icon: React.ReactNode
 title: string
 message: string
 actionLabel?: string
 onAction?: () => void
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
 return (
 <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
 <div className="w-16 h-16 flex items-center justify-center text-gray-300 mb-4">
 {icon}
 </div>
 <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
 <p className="text-sm text-gray-500 max-w-xs mb-6">{message}</p>
 {actionLabel && onAction && (
 <button
 onClick={onAction}
 className="px-5 py-2.5 bg-primary-500 text-white rounded-input font-semibold text-sm hover:bg-primary-600 transition-colors btn-press"
 >
 {actionLabel}
 </button>
 )}
 </div>
 )
}
