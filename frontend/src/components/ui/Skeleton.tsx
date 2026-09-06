import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
 className?: string
 width?: string
 height?: string
 circle?: boolean
}

export function Skeleton({ className, width, height, circle = false }: SkeletonProps) {
 return (
 <div
 className={cn(
 'skeleton-shimmer rounded-md',
 circle ? 'rounded-full' : '',
 className
 )}
 style={{
 width: width || (circle ? '40px' : '100%'),
 height: height || (circle ? '40px' : '20px'),
 }}
 />
 )
}

export function StatCardSkeleton() {
 return (
 <div className="bg-white rounded-card border border-gray-200 p-4 space-y-3">
 <Skeleton width="60px" height="16px" />
 <Skeleton width="120px" height="28px" />
 <Skeleton width="80px" height="12px" />
 </div>
 )
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
 return (
 <div className="flex items-center gap-4 py-3 border-b border-gray-100">
 {Array.from({ length: columns }).map((_, i) => (
 <Skeleton key={i} width={i === 0 ? '80px' : i === columns - 1 ? '60px' : '100px'} height="16px" />
 ))}
 </div>
 )
}
