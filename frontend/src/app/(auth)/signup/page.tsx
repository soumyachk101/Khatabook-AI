'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Receipt, Eye, EyeOff, User, Phone, Lock, Mail } from 'lucide-react'

export default function SignupPage() {
 const router = useRouter()
 const [showPassword, setShowPassword] = useState(false)
 const [isLoading, setIsLoading] = useState(false)
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 password: '',
 businessName: '',
 userType: 'freelancer',
 })
 const [error, setError] = useState('')

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError('')
 setIsLoading(true)

 await new Promise(r => setTimeout(r, 1200))

 router.push('/dashboard')
 }

 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
 <div className="w-full max-w-sm">
 {/* Logo */}
 <div className="text-center mb-8">
 <Link href="/" className="inline-flex items-center gap-2 mb-4">
 <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white">
 <Receipt className="w-6 h-6" />
 </div>
 </Link>
 <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
 <p className="text-sm text-gray-500 mt-1">Start managing your business finances</p>
 </div>

 <Card>
 <CardContent className="p-6">
 <form onSubmit={handleSubmit} className="space-y-4">
 {error && (
 <div className="p-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm">
 {error}
 </div>
 )}

 <div>
 <Label>Full Name *</Label>
 <div className="relative mt-1.5">
 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input
 value={formData.name}
 onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
 placeholder="Rajesh Kumar"
 required
 className="pl-10"
 />
 </div>
 </div>

 <div>
 <Label>Phone Number *</Label>
 <div className="relative mt-1.5">
 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">+91</div>
 <Phone className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input
 type="tel"
 value={formData.phone}
 onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
 placeholder="98765 43210"
 required
 className="pl-14"
 maxLength={10}
 />
 </div>
 </div>

 <div>
 <Label>Email</Label>
 <div className="relative mt-1.5">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input
 type="email"
 value={formData.email}
 onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
 placeholder="you@example.com"
 className="pl-10"
 />
 </div>
 </div>

 <div>
 <Label>Password *</Label>
 <div className="relative mt-1.5">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input
 type={showPassword ? 'text' : 'password'}
 value={formData.password}
 onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
 placeholder="Min 8 characters"
 required
 minLength={8}
 className="pl-10 pr-10"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
 >
 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
 </button>
 </div>
 <p className="text-xs text-gray-400 mt-1">At least 8 characters with a number</p>
 </div>

 <div>
 <Label>Business Name</Label>
 <Input
 value={formData.businessName}
 onChange={e => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
 placeholder="Your business or brand name"
 className="mt-1.5"
 />
 </div>

 <Button type="submit" className="w-full" size="lg" loading={isLoading}>
 Create Account
 </Button>
 </form>

 <p className="text-center text-sm text-gray-500 mt-6">
 Already have an account?{' '}
 <Link href="/login" className="text-primary-500 font-medium hover:text-primary-600">
 Sign in
 </Link>
 </p>
 </CardContent>
 </Card>

 <p className="text-center text-xs text-gray-400 mt-6">
 By signing up, you agree to our{' '}
 <Link href="#" className="underline">Terms</Link> and{' '}
 <Link href="#" className="underline">Privacy Policy</Link>
 </p>
 </div>
 </div>
 )
}
