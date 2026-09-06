import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
 Home,
 Scan,
 Plus,
 FileText,
 BarChart3,
 Settings,
 ChevronLeft,
 Menu,
 X,
 Wallet,
 LogOut,
} from 'lucide-react'

const navItems = [
 { label: 'Dashboard', href: '/dashboard', icon: Home, activeIcon: Home },
 { label: 'Scan', href: '/receipts', icon: Scan, activeIcon: Scan },
 { label: 'Invoices', href: '/invoices', icon: FileText, activeIcon: FileText },
 { label: 'Expenses', href: '/expenses', icon: Wallet, activeIcon: Wallet },
 { label: 'GST', href: '/gst', icon: BarChart3, activeIcon: BarChart3 },
 { label: 'Settings', href: '/settings', icon: Settings, activeIcon: Settings },
]

interface SidebarProps {
 collapsed?: boolean
 onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
 const location = useLocation()

 return (
 <aside
 className={cn(
 'fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300',
 'hidden lg:flex flex-col',
 collapsed ? 'w-[72px]' : 'w-[240px]'
 )}
 >
 {/* Logo */}
 <div className="flex items-center gap-3 px-5 h-16 border-b border-gray-100 shrink-0">
 {!collapsed && (
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center text-white">
 <Wallet className="w-5 h-5" />
 </div>
 <span className="font-bold text-lg text-gray-900">Khatabook</span>
 </div>
 )}
 {collapsed && (
 <div className="w-8 h-8 rounded-lg gradient-success flex items-center justify-center text-white mx-auto">
 <Wallet className="w-5 h-5" />
 </div>
 )}
 </div>

 {/* Navigation */}
 <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
 {navItems.map((item) => {
 const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
 return (
 <Link
 key={item.href}
 to={item.href}
 className={cn(
 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
 isActive
 ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
 collapsed && 'justify-center px-2'
 )}
 title={collapsed ? item.label : undefined}
 >
 <item.icon className="w-5 h-5 shrink-0" />
 {!collapsed && <span>{item.label}</span>}
 </Link>
 )
 })}
 </nav>

 {/* Bottom section */}
 <div className="p-3 border-t border-gray-100">
 {!collapsed && (
 <div className="flex items-center gap-3 px-3 py-2">
 <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
 R
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium text-gray-900 truncate">Rajesh</p>
 <p className="text-xs text-gray-500 truncate">Pro Plan</p>
 </div>
 <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
 <LogOut className="w-4 h-4" />
 </button>
 </div>
 )}
 {collapsed && (
 <button className="w-full flex justify-center p-2 rounded-lg hover:bg-gray-100 text-gray-400">
 <LogOut className="w-5 h-5" />
 </button>
 )}
 </div>
 </aside>
 )
}

interface MobileHeaderProps {
 onMenuClick?: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
 return (
 <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
 <div className="flex items-center justify-between px-4 h-14">
 <button onClick={onMenuClick} className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
 <Menu className="w-6 h-6 text-gray-600" />
 </button>
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-md gradient-success flex items-center justify-center text-white">
 <Wallet className="w-4 h-4" />
 </div>
 <span className="font-bold text-base text-gray-900">Khatabook</span>
 </div>
 <div className="w-9" />
 </div>
 </header>
 )
}

interface BottomNavProps {
 activeRoute?: string
}

export function BottomNav({ activeRoute = 'dashboard' }: BottomNavProps) {
 return (
 <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
 <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
 {navItems.slice(0, 5).map((item) => {
 const isActive = activeRoute === item.label.toLowerCase() || activeRoute.startsWith(item.href)
 return (
 <Link
 key={item.href}
 to={item.href}
 className={cn(
 'flex flex-col items-center justify-center gap-0.5 py-1 px-2 min-w-[56px]',
 isActive ? 'text-primary-500' : 'text-gray-400'
 )}
 >
 <item.icon className="w-5 h-5" />
 <span className="text-[10px] font-medium">{item.label}</span>
 </Link>
 )
 })}
 </div>
 </nav>
 )
}
