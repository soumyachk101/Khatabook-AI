import { useQuery, useMutation, useQueryClient } from '@tanstack/react/query'

export interface Expense {
 id: string
 amount: number
 category: string
 date: string
 paymentMode: string
 vendor?: string
 notes?: string
 createdAt: string
}

const mockExpenses: Expense[] = [
 {
 id: '1',
 amount: 2450,
 category: 'Groceries',
 date: '2026-09-06',
 paymentMode: 'UPI',
 vendor: 'BigBasket',
 notes: 'Monthly groceries',
 createdAt: '2026-09-06T10:30:00Z',
 },
 {
 id: '2',
 amount: 800,
 category: 'Travel & Transport',
 date: '2026-09-05',
 paymentMode: 'Cash',
 vendor: 'Shell Station',
 notes: 'Petrol',
 createdAt: '2026-09-05T08:15:00Z',
 },
 {
 id: '3',
 amount: 1200,
 category: 'Utilities',
 date: '2026-09-01',
 paymentMode: 'Card',
 vendor: 'Airtel Xtreme',
 notes: 'Internet bill',
 createdAt: '2026-09-01T00:00:00Z',
 },
 {
 id: '4',
 amount: 5400,
 category: 'Office Supplies',
 date: '2026-08-28',
 paymentMode: 'UPI',
 vendor: 'Amazon',
 notes: 'Stationery & supplies',
 createdAt: '2026-08-28T14:20:00Z',
 },
]

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

const categoryTotals = (expenses: Expense[]) => {
 const totals: Record<string, number> = {}
 expenses.forEach(e => {
 totals[e.category] = (totals[e.category] || 0) + e.amount
 })
 return totals
}

export function useExpenses() {
 const queryClient = useQueryClient()

 const expensesQuery = useQuery({
 queryKey: ['expenses'],
 queryFn: async () => {
 await delay(300)
 return mockExpenses
 },
 })

 const addExpense = useMutation({
 mutationFn: async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
 await delay(500)
 const newExpense: Expense = {
 ...expense,
 id: Date.now().toString(),
 createdAt: new Date().toISOString(),
 }
 mockExpenses.unshift(newExpense)
 return newExpense
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
 })

 const deleteExpense = useMutation({
 mutationFn: async (id: string) => {
 await delay(300)
 const idx = mockExpenses.findIndex(e => e.id === id)
 if (idx >= 0) mockExpenses.splice(idx, 1)
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['expenses'] }),
 })

 const totalExpenses = expensesQuery.data?.reduce((sum, e) => sum + e.amount, 0) ?? 0

 return {
 expenses: expensesQuery.data ?? [],
 isLoading: expensesQuery.isLoading,
 addExpense,
 deleteExpense,
 totalExpenses,
 categoryTotals: categoryTotals(expensesQuery.data ?? []),
 refetch: expensesQuery.refetch,
 }
}
