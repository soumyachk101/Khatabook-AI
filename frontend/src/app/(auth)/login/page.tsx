'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Receipt, Eye, EyeOff, Phone, Lock } from 'lucide-react'

export default function LoginPage() {
 const router = useRouter()
 const [showPassword, setShowPassword] = useState(false)
 const [formData, setFormData] = useState({ phone: '', password: '' })
 const [error, setError] = useState('')
 const [isLoading, setIsLoading] = useState(false)

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError('')
 setIsLoading(true)

 await new Promise(r => setTimeout(r, 1000))

 if (formData.phone && formData.password) {
 router.push('/dashboard')
 } else {
 setError('Please enter valid credentials')
 setIsLoading(false)
 }
 }

 return (
 <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
 <div className="w-full max-w-sm">
 {/* Logo */}
 <div className="text-center mb-8">
 <Link href="/" className="inline-flex items-center gap-2 mb-4">
 <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white">
 <Receipt className="w-6 h-6" />
 </div>
 </Link>
 <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
 <p className="text-sm text-gray-500 mt-1">Sign in to continue managing your business</p>
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
 <Label>Phone Number</Label>
 <div className="relative mt-1.5">
 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
 +91
 </div>
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
 <Label>Password</Label>
 <div className="relative mt-1.5">
 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <Input
 type={showPassword ? 'text' : 'password'}
 value={formData.password}
 onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
 placeholder="••••••••"
 required
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
 </div>

 <div className="flex items-center justify-between">
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
 <span className="text-sm text-gray-600">Remember me</span>
 </label>
 <Link href="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
 Forgot password?
 </Link>
 </div>

 <Button type="submit" className="w-full" size="lg" loading={isLoading}>
 Sign In
 </Button>
 </form>

 <div className="relative my-6">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-gray-200" />
 </div>
 <div className="relative flex justify-center text-xs uppercase">
 <span className="bg-white px-3 text-gray-500">or continue with</span>
 </div>
 </div>

 <div className="grid grid-cols-3 gap-3">
 <Button variant="outline" type="button">
 <svg className="w-5 h-5" viewBox="0 0 24 24">
 <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
 <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
 <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
 <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
 </svg>
 </Button>
 <Button variant="outline" type="button">
 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
 <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C3.79 15.4 4.63 7.43 9.09 6.84c1.39.15 2.25.7 2.95 1.83-.94.56-1.87 1.39-2.45 2.4-.6 1.05-.4 2.35.25 3.39.58 1.04 1.45 1.83 2.45 2.4-1.05.6-2.25 1.5-2.05 3.1.22 1.77 1.6 2.7 3.3 2.42 1.85-.29 2.75-1.55 2.95-3.1.55 1.02 1.35 1.74 2.25 2.3-.05.07-.1.14-.15.2zM12.03 7.25c-.24-2.18 1.77-4.03 3.94-4.18.32 2.28-1.87 4.4-3.94 4.18z"/>
 </svg>
 </Button>
 <Button variant="outline" type="button">
 <Phone className="w-5 h-5" />
 </Button>
 </div>

 <p className="text-center text-sm text-gray-500 mt-6">
 Don&apos;t have an account?{' '}
 <Link href="/signup" className="text-primary-500 font-medium hover:text-primary-600">
 Sign up
 </Link>
 </p>
 </CardContent>
 </Card>

 <p className="text-center text-xs text-gray-400 mt-6">
 By signing in, you agree to our{' '}
 <Link href="#" className="underline">Terms</Link> and{' '}
 <Link href="#" className="underline">Privacy Policy</Link>
 </p>
 </div>
 </div>
 )
}
