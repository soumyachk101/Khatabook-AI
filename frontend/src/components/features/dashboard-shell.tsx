'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Receipt, Scan, FileText, Wallet, BarChart3, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
 { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
 { label: 'Receipts', href: '/receipts', icon: Scan },
 { label: 'Invoices', href: '/invoices', icon: FileText },
 { label: 'Expenses', href: '/expenses', icon: Wallet },
 { label: 'GST', href: '/gst', icon: Receipt },
 { label: 'Settings', href: '/settings', icon: Settings },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
 const pathname = usePathname()
 const [sidebarOpen, setSidebarOpen] = useState(false)

 return (
 <div className="flex min-h-screen bg-gray-50">
 {/* Mobile sidebar overlay */}
 {sidebarOpen && (
 <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
 )}

 {/* Sidebar - Desktop */}
 <aside className={cn(
 'fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300',
 'hidden lg:flex flex-col w-[240px]'
 )}>
 <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-100">
 <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
 <Receipt className="w-5 h-5" />
 </div>
 <span className="font-bold text-lg text-gray-900">Khatabook</span>
 </div>

 <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
 {navItems.map((item) => {
 const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
 return (
 <Link
 key={item.href}
 href={item.href}
 className={cn(
 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
 isActive
 ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
 )}
 >
 <item.icon className="w-5 h-5 shrink-0" />
 {item.label}
 </Link>
 )
 })}
 </nav>

 <div className="p-3 border-t border-gray-100">
 <div className="flex items-center gap-3 px-3 py-2">
 <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
 R
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-gray-900 truncate">Rajesh</p>
 <p className="text-xs text-gray-500 truncate">Pro Plan</p>
 </div>
 </div>
 </div>
 </aside>

 {/* Mobile Header */}
 <div className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b bg-white z-30 flex items-center justify-between px-4">
 <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
 {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
 </button>
 <Link href="/dashboard" className="flex items-center gap-2">
 <Receipt className="h-5 w-5 text-primary-500" />
 <span className="font-bold">Khatabook AI</span>
 </Link>
 <div className="w-9" />
 </div>

 {/* Mobile sidebar */}
 {sidebarOpen && (
 <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-gray-200">
 <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-100">
 <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white">
 <Receipt className="w-5 h-5" />
 </div>
 <span className="font-bold text-lg text-gray-900">Khatabook</span>
 </div>
 <nav className="py-4 px-3 space-y-1">
 {navItems.map((item) => {
 const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
 return (
 <Link
 key={item.href}
 href={item.href}
 onClick={() => setSidebarOpen(false)}
 className={cn(
 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
 isActive
 ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
 )}
 >
 <item.icon className="w-5 h-5 shrink-0" />
 {item.label}
 </Link>
 )
 })}
 </nav>
 </aside>
 )}

 {/* Main Content */}
 <main className="flex-1 lg:ml-[240px] pt-14 lg:pt-0">
 <div className="p-4 md:p-8 max-w-7xl mx-auto">
 {children}
 </div>
 </main>
 </div>
 )
}
