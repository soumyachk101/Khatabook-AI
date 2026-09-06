import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
 label?: string
 error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
 const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`

 return (
 <div className="w-full">
 {label && (
 <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
 {label}
 {props.required && <span className="text-error-500 ml-0.5">*</span>}
 </label>
 )}
 <textarea
 id={inputId}
 className={cn(
 'w-full min-h-[100px] px-4 py-3 rounded-input border-2 bg-white',
 'text-gray-900 placeholder-gray-400',
 'transition-colors duration-200 resize-vertical',
 'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
 'disabled:bg-gray-100 disabled:text-gray-400',
 error ? 'border-error-400' : 'border-gray-200 hover:border-gray-300',
 className
 )}
 {...props}
 />
 {error && (
 <p className="mt-1.5 text-sm text-error-500 flex items-center gap-1">
 <span className="text-xs">⚠</span>
 {error}
 </p>
 )}
 </div>
 )
}
