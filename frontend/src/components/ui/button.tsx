import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
 size?: 'sm' | 'md' | 'lg' | 'icon'
 loading?: boolean
}

const variantStyles = {
 primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-md',
 secondary: 'bg-success-500 text-white hover:bg-success-600 shadow-md',
 outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
 ghost: 'text-gray-600 hover:text-primary-500 hover:bg-gray-100',
 destructive: 'bg-error-500 text-white hover:bg-error-600 shadow-md',
}

const sizeStyles = {
 sm: 'px-3 py-1.5 text-sm h-9',
 md: 'px-5 py-2.5 text-base h-12',
 lg: 'px-8 py-3 text-lg h-14',
 icon: 'p-2 h-10 w-10',
}

export function Button({
 variant = 'primary',
 size = 'md',
 loading = false,
 className,
 children,
 disabled,
 ...props
}: ButtonProps) {
 return (
 <button
 className={cn(
 'inline-flex items-center justify-center gap-2 rounded-input font-semibold transition-all duration-200 btn-press disabled:opacity-50 disabled:cursor-not-allowed',
 variantStyles[variant],
 sizeStyles[size],
 className
 )}
 disabled={disabled || loading}
 {...props}
 >
 {loading && (
 <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
 </svg>
 )}
 {children}
 </button>
 )
}
