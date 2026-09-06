'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Receipt, ArrowLeft, Phone, Lock } from 'lucide-react'

export default function ForgotPasswordPage() {
 const [isLoading, setIsLoading] = useState(false)
 const [sent, setSent] = useState(false)
 const [phone, setPhone] = useState('')

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setIsLoading(true)
 await new Promise(r => setTimeout(r, 1200))
 setSent(true)
 setIsLoading(false)
 }

 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
 <div className="w-full max-w-sm">
 <div className="text-center mb-8">
 <Link href="/" className="inline-flex items-center gap-2 mb-4">
 <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white">
 <Receipt className="w-6 h-6" />
 </div>
 </Link>
 <h1 className="text-2xl font-bold text-gray-900">
 {sent ? 'Check your phone' : 'Reset your password'}
 </h1>
 <p className="text-sm text-gray-500 mt-1">
 {sent ? 'We sent a verification code to your number' : "We'll send you a reset link"}
 </p>
 </div>

 <Card>
 <CardContent className="p-6">
 {!sent ? (
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <Label>Phone Number</Label>
 <div className="relative mt-1.5">
 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</div>
 <Phone className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input
 type="tel"
 value={phone}
 onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
 placeholder="98765 43210"
 required
 className="pl-14"
 maxLength={10}
 />
 </div>
 </div>

 <Button type="submit" className="w-full" size="lg" loading={isLoading}>
 Send Reset Link
 </Button>
 </form>
 ) : (
 <div className="text-center space-y-4">
 <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto">
 <Lock className="w-8 h-8 text-success-500" />
 </div>
 <p className="text-sm text-gray-600">
 If you have an account with us, you&apos;ll receive a password reset link shortly.
 </p>
 <Button variant="outline" onClick={() => setSent(false)} className="w-full">
 Try Again
 </Button>
 </div>
 )}

 <p className="text-center text-sm text-gray-500 mt-6">
 <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600 inline-flex items-center gap-1">
 <ArrowLeft className="w-4 h-4" />
 Back to login
 </Link>
 </p>
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
