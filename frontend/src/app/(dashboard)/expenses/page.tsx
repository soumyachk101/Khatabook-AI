'use client'

import DashboardShell from '@/components/features/dashboard-shell'
import { useExpenses } from '@/hooks/use-expenses'
import { ExpenseForm } from '@/components/features/expense-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Wallet, TrendingUp, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'

export default function ExpensesPage() {
 const { expenses, totalExpenses, categoryTotals, addExpense, deleteExpense, isLoading } = useExpenses()
 const [showForm, setShowForm] = useState(false)

 const handleAddExpense = (data: any) => {
 addExpense(data)
 setShowForm(false)
 }

 return (
 <DashboardShell>
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
 <p className="text-sm text-gray-500 mt-0.5">Track and categorize your business expenses.</p>
 </div>
 <Button onClick={() => setShowForm(!showForm)}>
 <Plus className="w-4 h-4 mr-2" />
 {showForm ? 'Hide Form' : 'Add Expense'}
 </Button>
 </div>

 {showForm && (
 <ExpenseForm onSubmit={handleAddExpense} />
 )}

 <div className="grid gap-4 md:grid-cols-3">
 <Card>
 <CardContent className="p-5">
 <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
 <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">₹{totalExpenses.toLocaleString('en-IN')}</p>
 <p className="text-xs text-error-500 mt-1 flex items-center gap-1">
 <TrendingUp className="w-3 h-3" />
 ↑ 8% from last month
 </p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-5">
 <p className="text-sm text-gray-500 font-medium">This Month</p>
 <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">₹{expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN')}</p>
 </CardContent>
 </Card>
 <Card>
 <CardContent className="p-5">
 <p className="text-sm text-gray-500 font-medium">Categories</p>
 <p className="text-2xl font-bold text-gray-900 mt-1">{Object.keys(categoryTotals).length}</p>
 </CardContent>
 </Card>
 </div>

 <div className="grid gap-6 lg:grid-cols-3">
 {/* Category Breakdown */}
 <Card className="lg:col-span-1">
 <CardHeader>
 <CardTitle className="text-base">Category Breakdown</CardTitle>
 </CardHeader>
 <CardContent>
 {isLoading ? (
 <p className="text-sm text-gray-500 text-center py-8">Loading...</p>
 ) : Object.keys(categoryTotals).length === 0 ? (
 <p className="text-sm text-gray-500 text-center py-8">No expenses recorded yet.</p>
 ) : (
 <div className="space-y-3">
 {Object.entries(categoryTotals).map(([name, amount]) => {
 const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
 return (
 <div key={name}>
 <div className="flex items-center justify-between text-sm mb-1">
 <span className="text-gray-700">{name}</span>
 <span className="font-medium text-gray-900 font-mono text-xs">₹{amount.toLocaleString('en-IN')} ({Math.round(pct)}%)</span>
 </div>
 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
 <div className="h-full bg-primary-500 rounded-full" style={{ width: `${pct}%` }} />
 </div>
 </div>
 )
 })}
 </div>
 )}
 </CardContent>
 </Card>

 {/* Recent Expenses */}
 <Card className="lg:col-span-2">
 <CardHeader>
 <CardTitle className="text-base">Recent Expenses</CardTitle>
 </CardHeader>
 <CardContent>
 {isLoading ? (
 <p className="text-sm text-gray-500 text-center py-8">Loading...</p>
 ) : expenses.length === 0 ? (
 <p className="text-sm text-gray-500 text-center py-8">No expenses yet. Add your first expense!</p>
 ) : (
 <div className="space-y-2 divide-y divide-gray-100">
 {expenses.slice(0, 10).map(expense => (
 <div key={expense.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-lg bg-error-100 text-error-500">
 <Wallet className="w-4 h-4" />
 </div>
 <div>
 <p className="text-sm font-medium text-gray-900">{expense.vendor || expense.category}</p>
 <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString('en-IN')} · {expense.paymentMode}</p>
 </div>
 </div>
 <div className="flex items-center gap-3">
 <p className="font-semibold text-error-600 font-mono text-sm">-₹{expense.amount.toLocaleString('en-IN')}</p>
 <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)} className="text-gray-300 hover:text-error-500">
 <Trash2 className="w-4 h-4" />
 </Button>
 </div>
 </div>
 ))}
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 </div>
 </DashboardShell>
 )
}
