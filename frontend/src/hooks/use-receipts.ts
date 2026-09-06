import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Receipt {
 id: string
 vendor: string
 amount: number
 date: string
 category: string
 paymentMode: string
 items?: { name: string; qty: number; price: number }[]
 notes?: string
 cgst?: number
 sgst?: number
 createdAt: string
}

const mockReceipts: Receipt[] = [
 {
 id: '1',
 vendor: 'BigBasket',
 amount: 2450,
 date: '2026-09-06',
 category: 'Groceries',
 paymentMode: 'UPI',
 items: [
 { name: 'Milk 2L', qty: 1, price: 60 },
 { name: 'Bread', qty: 1, price: 40 },
 { name: 'Eggs (12)', qty: 1, price: 90 },
 ],
 notes: 'Monthly groceries',
 cgst: 78,
 sgst: 78,
 createdAt: '2026-09-06T10:30:00Z',
 },
 {
 id: '2',
 vendor: 'Shell Station',
 amount: 800,
 date: '2026-09-05',
 category: 'Travel & Transport',
 paymentMode: 'Cash',
 notes: 'Petrol refill',
 createdAt: '2026-09-05T08:15:00Z',
 },
 {
 id: '3',
 vendor: 'Airtel Xtreme',
 amount: 1200,
 date: '2026-09-01',
 category: 'Utilities',
 paymentMode: 'Card',
 notes: 'Internet bill',
 createdAt: '2026-09-01T00:00:00Z',
 },
]

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export function useReceipts() {
 const queryClient = useQueryClient()

 const receiptsQuery = useQuery({
 queryKey: ['receipts'],
 queryFn: async () => {
 await delay(300)
 return mockReceipts
 },
 })

 const addReceipt = useMutation({
 mutationFn: async (receipt: Omit<Receipt, 'id' | 'createdAt'>) => {
 await delay(500)
 const newReceipt: Receipt = {
 ...receipt,
 id: Date.now().toString(),
 createdAt: new Date().toISOString(),
 }
 mockReceipts.unshift(newReceipt)
 return newReceipt
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['receipts'] }),
 })

 const deleteReceipt = useMutation({
 mutationFn: async (id: string) => {
 await delay(300)
 const idx = mockReceipts.findIndex(r => r.id === id)
 if (idx >= 0) mockReceipts.splice(idx, 1)
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['receipts'] }),
 })

 return {
 receipts: receiptsQuery.data ?? [],
 isLoading: receiptsQuery.isLoading,
 addReceipt,
 deleteReceipt,
 refetch: receiptsQuery.refetch,
 }
}
