import React from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
 label?: string
 error?: string
 options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
 const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`

 return (
 <div className="w-full">
 {label && (
 <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
 {label}
 {props.required && <span className="text-error-500 ml-0.5">*</span>}
 </label>
 )}
 <div className="relative">
 <select
 id={selectId}
 className={cn(
 'w-full h-12 px-4 pr-10 rounded-input border-2 bg-white appearance-none',
 'text-gray-900',
 'transition-colors duration-200',
 'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
 'disabled:bg-gray-100 disabled:text-gray-400',
 error ? 'border-error-400' : 'border-gray-200 hover:border-gray-300',
 className
 )}
 {...props}
 >
 {options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
 </svg>
 </div>
 {error && (
 <p className="mt-1.5 text-sm text-error-500 flex items-center gap-1">
 <span className="text-xs">⚠</span>
 {error}
 </p>
 )}
 </div>
 )
}
