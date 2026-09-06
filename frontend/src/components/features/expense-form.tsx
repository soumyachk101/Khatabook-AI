import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { IndianRupee, Receipt, Calendar, Tag } from 'lucide-react'

export interface Expense {
 id: string
 amount: number
 category: string
 date: string
 paymentMode: string
 notes?: string
 vendor?: string
}

interface ExpenseFormProps {
 onSubmit?: (expense: Omit<Expense, 'id'>) => void
 initialData?: Partial<Expense>
 className?: string
}

const expenseCategories = [
 { value: 'office-supplies', label: 'Office Supplies' },
 { value: 'travel', label: 'Travel & Transport' },
 { value: 'food', label: 'Food & Dining' },
 { value: 'utilities', label: 'Utilities' },
 { value: 'marketing', label: 'Marketing' },
 { value: 'professional', label: 'Professional Services' },
 { value: 'rent', label: 'Rent & Office' },
 { value: 'software', label: 'Software & Subscriptions' },
 { value: 'emi', label: 'EMI & Loans' },
 { value: 'other', label: 'Miscellaneous' },
]

const paymentModes = [
 { value: 'cash', label: 'Cash' },
 { value: 'upi', label: 'UPI' },
 { value: 'card', label: 'Credit/Debit Card' },
 { value: 'bank', label: 'Bank Transfer' },
 { value: 'cheque', label: 'Cheque' },
 { value: 'other', label: 'Other' },
]

export function ExpenseForm({ onSubmit, initialData, className }: ExpenseFormProps) {
 const today = new Date().toISOString().split('T')[0]

 const [formData, setFormData] = useState({
 amount: initialData?.amount?.toString() || '',
 category: initialData?.category || '',
 date: initialData?.date || today,
 paymentMode: initialData?.paymentMode || '',
 vendor: initialData?.vendor || '',
 notes: initialData?.notes || '',
 })

 const updateField = (field: string, value: string) => {
 setFormData(prev => ({ ...prev, [field]: value }))
 }

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault()
 onSubmit?.({
 amount: parseFloat(formData.amount) || 0,
 category: formData.category,
 date: formData.date,
 paymentMode: formData.paymentMode,
 vendor: formData.vendor,
 notes: formData.notes,
 })
 }

 return (
 <Card className={className}>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <IndianRupee className="w-5 h-5 text-primary-500" />
 Add Expense
 </CardTitle>
 </CardHeader>
 <CardContent>
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <Label>Amount (₹) *</Label>
 <div className="relative">
 <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
 <Input
 type="number"
 value={formData.amount}
 onChange={e => updateField('amount', e.target.value)}
 placeholder="0.00"
 required
 className="pl-10 font-mono"
 />
 </div>
 </div>

 <div>
 <Label>Category *</Label>
 <Select value={formData.category} onChange={e => updateField('category', e.target.value)} options={expenseCategories} placeholder="Select category" required />
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <Label>Date *</Label>
 <div className="relative">
 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input type="date" value={formData.date} onChange={e => updateField('date', e.target.value)} required className="pl-10" />
 </div>
 </div>
 <div>
 <Label>Payment Mode *</Label>
 <Select value={formData.paymentMode} onChange={e => updateField('paymentMode', e.target.value)} options={paymentModes} placeholder="Select mode" required />
 </div>
 </div>

 <div>
 <Label>Vendor / Payee</Label>
 <div className="relative">
 <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input value={formData.vendor} onChange={e => updateField('vendor', e.target.value)} placeholder="Vendor name" className="pl-10" />
 </div>
 </div>

 <div>
 <Label>Notes</Label>
 <Textarea value={formData.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Optional notes..." rows={3} />
 </div>

 <Button type="submit" className="w-full">
 Save Expense
 </Button>
 </form>
 </CardContent>
 </Card>
 )
}
