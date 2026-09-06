import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'

export interface LineItem {
 id: string
 description: string
 quantity: number
 rate: number
 gstPercent: number
}

interface InvoiceCreatorProps {
 onSubmit?: (data: InvoiceFormData) => void
 className?: string
}

export interface InvoiceFormData {
 clientName: string
 clientEmail: string
 clientGstin: string
 items: LineItem[]
 notes: string
 dueDate: string
}

const expenseCategories = [
 { value: 'design', label: 'Design & Creative' },
 { value: 'development', label: 'Development' },
 { value: 'marketing', label: 'Marketing' },
 { value: 'consulting', label: 'Consulting' },
 { value: 'other', label: 'Other' },
]

export function InvoiceCreator({ onSubmit, className }: InvoiceCreatorProps) {
 const [step, setStep] = useState(1)
 const [formData, setFormData] = useState<InvoiceFormData>({
 clientName: '',
 clientEmail: '',
 clientGstin: '',
 items: [{ id: '1', description: '', quantity: 1, rate: 0, gstPercent: 18 }],
 notes: '',
 dueDate: '',
 })

 const updateField = (field: keyof InvoiceFormData, value: string) => {
 setFormData(prev => ({ ...prev, [field]: value }))
 }

 const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
 setFormData(prev => ({
 ...prev,
 items: prev.items.map(item =>
 item.id === id ? { ...item, [field]: value } : item
 ),
 }))
 }

 const addItem = () => {
 setFormData(prev => ({
 ...prev,
 items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, gstPercent: 18 }],
 }))
 }

 const removeItem = (id: string) => {
 setFormData(prev => ({
 ...prev,
 items: prev.items.filter(item => item.id !== id),
 }))
 }

 const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
 const totalGst = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate * item.gstPercent) / 100, 0)
 const grandTotal = subtotal + totalGst

 const handleSubmit = () => {
 onSubmit?.(formData)
 }

 return (
 <div className={cn('space-y-6', className)}>
 {/* Step indicator */}
 <div className="flex items-center justify-center gap-2">
 {[1, 2, 3].map(s => (
 <div key={s} className="flex items-center gap-2">
 <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
 s <= step ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'
 )}>
 {s}
 </div>
 {s < 3 && <div className={cn('w-12 h-0.5', s < step ? 'bg-primary-500' : 'bg-gray-200')} />}
 </div>
 ))}
 </div>
 <div className="text-center text-sm text-gray-500">
 {step === 1 && 'Step 1: Client Information'}
 {step === 2 && 'Step 2: Items & Services'}
 {step === 3 && 'Step 3: Terms & Preview'}
 </div>

 {/* Step 1: Client Info */}
 {step === 1 && (
 <Card>
 <CardContent className="p-6 space-y-4">
 <div>
 <Label>Client Name *</Label>
 <Input value={formData.clientName} onChange={e => updateField('clientName', e.target.value)} placeholder="Rajesh Kumar" required />
 </div>
 <div>
 <Label>Email</Label>
 <Input type="email" value={formData.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} placeholder="client@email.com" />
 </div>
 <div>
 <Label>GSTIN</Label>
 <Input value={formData.clientGstin} onChange={e => updateField('clientGstin', e.target.value)} placeholder="27AAPFU1234F1ZX" />
 </div>
 <div className="flex justify-end">
 <Button onClick={() => setStep(2)}>Continue →</Button>
 </div>
 </CardContent>
 </Card>
 )}

 {/* Step 2: Line Items */}
 {step === 2 && (
 <Card>
 <CardContent className="p-6 space-y-4">
 <div className="space-y-3">
 {formData.items.map((item, index) => (
 <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
 <div className="col-span-12 sm:col-span-4">
 <Label>Item</Label>
 <Input value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Description" />
 </div>
 <div className="col-span-4 sm:col-span-2">
 <Label>Qty</Label>
 <Input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} min={1} />
 </div>
 <div className="col-span-4 sm:col-span-2">
 <Label>Rate (₹)</Label>
 <Input type="number" value={item.rate} onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
 </div>
 <div className="col-span-3 sm:col-span-2">
 <Label>GST%</Label>
 <Select value={item.gstPercent.toString()} onChange={e => updateItem(item.id, 'gstPercent', parseInt(e.target.value))} options={[
 { value: '0', label: '0%' },
 { value: '5', label: '5%' },
 { value: '12', label: '12%' },
 { value: '18', label: '18%' },
 { value: '28', label: '28%' },
 ]} />
 </div>
 <div className="col-span-1 flex justify-center pb-2">
 {formData.items.length > 1 && (
 <button onClick={() => removeItem(item.id)} className="p-2 text-error-500 hover:bg-error-50 rounded-lg transition-colors">
 <Trash2 className="w-4 h-4" />
 </button>
 )}
 </div>
 </div>
 ))}
 </div>

 <Button variant="outline" onClick={addItem} className="w-full">
 <Plus className="w-4 h-4 mr-2" />
 Add Item
 </Button>

 <div className="border-t pt-4 space-y-1 text-sm">
 <div className="flex justify-between text-gray-600">
 <span>Subtotal</span>
 <span className="font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between text-gray-600">
 <span>GST</span>
 <span className="font-mono">₹{totalGst.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
 <span>Total</span>
 <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
 </div>
 </div>

 <div className="flex justify-between">
 <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
 <Button onClick={() => setStep(3)}>Continue →</Button>
 </div>
 </CardContent>
 </Card>
 )}

 {/* Step 3: Terms & Preview */}
 {step === 3 && (
 <Card>
 <CardContent className="p-6 space-y-4">
 <div>
 <Label>Invoice Number</Label>
 <Input value={`INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}-${Math.floor(1000+Math.random()*9000)}`} readOnly />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <Label>Invoice Date</Label>
 <Input type="date" value={formData.dueDate} onChange={e => updateField('dueDate', e.target.value)} />
 </div>
 <div>
 <Label>Due Date</Label>
 <Input type="date" />
 </div>
 </div>
 <div>
 <Label>Notes / Terms</Label>
 <Textarea value={formData.notes} onChange={e => updateField('notes', e.target.value)} placeholder="Thank you for your business!" />
 </div>

 {/* Preview */}
 <div className="border rounded-lg p-4 bg-gray-50">
 <h4 className="text-sm font-semibold text-gray-500 mb-2">Preview</h4>
 <div className="bg-white rounded border p-4 text-sm space-y-2">
 <p className="font-bold">{formData.clientName || 'Client Name'}</p>
 <p className="text-gray-600">{formData.items.filter(i => i.description).map(i => `${i.description} x${i.quantity} = ₹${(i.quantity * i.rate).toLocaleString('en-IN')}`).join('<br/>')}</p>
 <div className="border-t pt-2 font-bold text-right">
 Total: ₹{grandTotal.toLocaleString('en-IN')}
 </div>
 </div>
 </div>

 <div className="flex flex-col gap-2">
 <Button variant="outline" onClick={() => setStep(2)} className="w-full">← Back</Button>
 <div className="flex gap-2">
 <Button variant="secondary" onClick={() => { /* save draft */ }} className="flex-1">Save Draft</Button>
 <Button onClick={handleSubmit} className="flex-1">Send Now ✉️</Button>
 </div>
 </div>
 </CardContent>
 </Card>
 )}
 </div>
 )
}
