import { useQuery } from '@tanstack/react-query'
import { useInvoices } from './use-invoices'
import { useExpenses } from './use-expenses'
import { useReceipts } from './use-receipts'

export interface DashboardStats {
 totalIncome: number
 totalExpenses: number
 pendingInvoices: number
 pendingAmount: number
 gstDue: number
 profit: number
 incomeTrend: string
 expenseTrend: string
}

export interface CategorySpend {
 name: string
 amount: number
 percentage: number
 color: string
}

export interface MonthlyData {
 month: string
 income: number
 expenses: number
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export function useDashboard() {
 const { invoices } = useInvoices()
 const { expenses, totalExpenses, categoryTotals } = useExpenses()
 const { receipts } = useReceipts()

 const statsQuery = useQuery({
 queryKey: ['dashboard-stats'],
 queryFn: async (): Promise<DashboardStats> => {
 await delay(300)

 const paidInvoices = invoices.filter(i => i.status === 'paid')
 const totalIncome = paidInvoices.reduce((sum, i) => sum + i.amount, 0)
 const pendingInvoices = invoices.filter(i => ['sent', 'viewed', 'overdue'].includes(i.status))
 const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.amount, 0)
 const gstDue = invoices
 .filter(i => ['sent', 'viewed', 'overdue'].includes(i.status))
 .reduce((sum, i) => sum + i.cgst + i.sgst, 0)
 const profit = totalIncome - totalExpenses

 return {
 totalIncome,
 totalExpenses,
 pendingInvoices: pendingInvoices.length,
 pendingAmount,
 gstDue,
 profit,
 incomeTrend: '+12%',
 expenseTrend: '+5%',
 }
 },
 })

 const categorySpendQuery = useQuery({
 queryKey: ['category-spend'],
 queryFn: async (): Promise<CategorySpend[]> => {
 await delay(300)
 const entries = Object.entries(categoryTotals)
 const total = entries.reduce((sum, [, val]) => sum + val, 0)
 const colors = ['bg-primary-500', 'bg-success-500', 'bg-accent-500', 'bg-error-500', 'bg-purple-500', 'bg-blue-500', 'bg-pink-500']
 return entries.map(([name, amount], i) => ({
 name,
 amount,
 percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
 color: colors[i % colors.length],
 }))
 },
 })

 const monthlyQuery = useQuery({
 queryKey: ['monthly-data'],
 queryFn: async (): Promise<MonthlyData[]> => {
 await delay(300)
 return [
 { month: 'Jul', income: 38000, expenses: 22000 },
 { month: 'Aug', income: 42000, expenses: 24000 },
 { month: 'Sep', income: 45200, expenses: 12800 },
 ]
 },
 })

 return {
 stats: statsQuery.data ?? null,
 isLoading: statsQuery.isLoading,
 categorySpend: categorySpendQuery.data ?? [],
 monthlyData: monthlyQuery.data ?? [],
 invoiceCount: invoices.length,
 expenseCount: expenses.length,
 receiptCount: receipts.length,
 }
}
