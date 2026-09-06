import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Invoice {
 id: string
 number: string
 clientName: string
 clientEmail?: string
 amount: number
 subtotal: number
 cgst: number
 sgst: number
 status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue'
 date: string
 dueDate: string
 paidDate?: string
 items: { description: string; qty: number; rate: number }[]
 notes?: string
}

const mockInvoices: Invoice[] = [
 {
 id: '1',
 number: 'INV-202609-104',
 clientName: 'Rajesh Kumar',
 clientEmail: 'rajesh@email.com',
 amount: 7670,
 subtotal: 6500,
 cgst: 585,
 sgst: 585,
 status: 'paid',
 date: '2026-09-06',
 dueDate: '2026-10-06',
 paidDate: '2026-10-05',
 items: [
 { description: 'Logo Design', qty: 10, rate: 500 },
 { description: 'Revision', qty: 5, rate: 300 },
 ],
 notes: 'Thank you for your business!',
 },
 {
 id: '2',
 number: 'INV-202609-103',
 clientName: 'Priya Sharma',
 amount: 3200,
 subtotal: 2712,
 cgst: 244,
 sgst: 244,
 status: 'sent',
 date: '2026-09-05',
 dueDate: '2026-10-05',
 items: [
 { description: 'Website Update', qty: 1, rate: 3200 },
 ],
 },
 {
 id: '3',
 number: 'INV-202609-102',
 clientName: 'Amit Patel',
 amount: 12000,
 subtotal: 10169,
 cgst: 915,
 sgst: 916,
 status: 'viewed',
 date: '2026-09-01',
 dueDate: '2026-10-01',
 items: [
 { description: 'Consulting', qty: 20, rate: 600 },
 ],
 },
 {
 id: '4',
 number: 'INV-202608-101',
 clientName: 'Sneha Gupta',
 amount: 5400,
 subtotal: 4576,
 cgst: 412,
 sgst: 412,
 status: 'overdue',
 date: '2026-08-15',
 dueDate: '2026-09-15',
 items: [
 { description: 'Design Work', qty: 1, rate: 5400 },
 ],
 },
 {
 id: '5',
 number: 'INV-202609-100',
 clientName: 'New Client',
 amount: 8000,
 subtotal: 6780,
 cgst: 610,
 sgst: 610,
 status: 'draft',
 date: '2026-09-06',
 dueDate: '',
 items: [],
 notes: 'Not sent yet',
 },
]

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export function useInvoices() {
 const queryClient = useQueryClient()

 const invoicesQuery = useQuery({
 queryKey: ['invoices'],
 queryFn: async () => {
 await delay(300)
 return mockInvoices
 },
 })

 const createInvoice = useMutation({
 mutationFn: async (data: Omit<Invoice, 'id' | 'number' | 'createdAt'>) => {
 await delay(500)
 const num = `INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`
 const newInvoice: Invoice = {
 ...data,
 id: Date.now().toString(),
 number: num,
 }
 mockInvoices.unshift(newInvoice)
 return newInvoice
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
 })

 const updateInvoice = useMutation({
 mutationFn: async ({ id, ...data }: Partial<Invoice> & { id: string }) => {
 await delay(400)
 const idx = mockInvoices.findIndex(i => i.id === id)
 if (idx >= 0) mockInvoices[idx] = { ...mockInvoices[idx], ...data }
 return mockInvoices[idx]
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
 })

 const markAsPaid = useMutation({
 mutationFn: async (id: string) => {
 await delay(400)
 const idx = mockInvoices.findIndex(i => i.id === id)
 if (idx >= 0) {
 mockInvoices[idx] = {
 ...mockInvoices[idx],
 status: 'paid',
 paidDate: new Date().toISOString().split('T')[0],
 }
 }
 return mockInvoices[idx]
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
 })

 const deleteInvoice = useMutation({
 mutationFn: async (id: string) => {
 await delay(300)
 const idx = mockInvoices.findIndex(i => i.id === id)
 if (idx >= 0) mockInvoices.splice(idx, 1)
 },
 onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
 })

 return {
 invoices: invoicesQuery.data ?? [],
 isLoading: invoicesQuery.isLoading,
 createInvoice,
 updateInvoice,
 markAsPaid,
 deleteInvoice,
 refetch: invoicesQuery.refetch,
 }
}
