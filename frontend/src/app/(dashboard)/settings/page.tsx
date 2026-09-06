'use client'

import DashboardShell from '@/components/features/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Receipt, User, Building2, FileText, Bell, Globe, Upload, Download, Shield, CreditCard, HelpCircle, LogOut } from 'lucide-react'

export default function SettingsPage() {
 return (
 <DashboardShell>
 <div className="space-y-6 max-w-3xl">
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
 <p className="text-sm text-gray-500 mt-0.5">Manage your account, business, and preferences.</p>
 </div>

 <Tabs defaultValue="profile">
 <TabsList className="w-full justify-start">
 <TabsTrigger value="profile">Profile</TabsTrigger>
 <TabsTrigger value="business">Business</TabsTrigger>
 <TabsTrigger value="invoice">Invoice Defaults</TabsTrigger>
 <TabsTrigger value="notifications">Notifications</TabsTrigger>
 <TabsTrigger value="preferences">Preferences</TabsTrigger>
 <TabsTrigger value="data">Data & Privacy</TabsTrigger>
 <TabsTrigger value="subscription">Subscription</TabsTrigger>
 </TabsList>

 {/* Profile */}
 <TabsContent value="profile" className="mt-4 space-y-4">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <User className="w-5 h-5 text-primary-500" />
 Profile
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center gap-4">
 <Avatar className="w-16 h-16">
 <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-500 text-xl font-bold">
 R
 </div>
 </Avatar>
 <div>
 <h3 className="font-semibold text-gray-900">Rajesh Kumar</h3>
 <p className="text-sm text-gray-500">rajesh@email.com</p>
 <p className="text-sm text-gray-500">+91 98765 43210</p>
 </div>
 </div>
 <Button variant="outline">Edit Profile</Button>
 </CardContent>
 </Card>
 </TabsContent>

 {/* Business */}
 <TabsContent value="business" className="mt-4 space-y-4">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Building2 className="w-5 h-5 text-primary-500" />
 Business Details
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="grid gap-4 md:grid-cols-2">
 <div>
 <Label>Business Name</Label>
 <Input defaultValue="Rajesh Graphics" className="mt-1.5" />
 </div>
 <div>
 <Label>Business Type</Label>
 <Select defaultValue="freelancer" options={[
 { value: 'freelancer', label: 'Freelancer' },
 { value: 'small-business', label: 'Small Business' },
 { value: 'both', label: 'Both' },
 ]} className="mt-1.5" />
 </div>
 <div>
 <Label>GSTIN</Label>
 <Input defaultValue="27AAPFU1234F1ZX" className="mt-1.5 font-mono" />
 </div>
 <div>
 <Label>State</Label>
 <Select defaultValue="maharashtra" options={[
 { value: 'maharashtra', label: 'Maharashtra' },
 { value: 'karnataka', label: 'Karnataka' },
 { value: 'delhi', label: 'Delhi' },
 ]} className="mt-1.5" />
 </div>
 </div>
 <div>
 <Label>Address</Label>
 <Textarea defaultValue="123 Main Street, Mumbai - 400001" className="mt-1.5" rows={2} />
 </div>
 <Button>Save Changes</Button>
 </CardContent>
 </Card>
 </TabsContent>

 {/* Invoice Defaults */}
 <TabsContent value="invoice" className="mt-4 space-y-4">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <FileText className="w-5 h-5 text-primary-500" />
 Invoice Defaults
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="grid gap-4 md:grid-cols-2">
 <div>
 <Label>Invoice Prefix</Label>
 <Input defaultValue="INV-" className="mt-1.5" />
 </div>
 <div>
 <Label>Default Due Days</Label>
 <Input type="number" defaultValue="30" className="mt-1.5" />
 </div>
 <div>
 <Label>Default GST Rate</Label>
 <Select defaultValue="18" options={[
 { value: '0', label: '0%' },
 { value: '5', label: '5%' },
 { value: '12', label: '12%' },
 { value: '18', label: '18%' },
 { value: '28', label: '28%' },
 ]} className="mt-1.5" />
 </div>
 <div>
 <Label>Currency</Label>
 <Select defaultValue="inr" options={[
 { value: 'inr', label: '₹ INR' },
 { value: 'usd', label: '$ USD' },
 ]} className="mt-1.5" />
 </div>
 </div>
 <div>
 <Label>Payment Terms</Label>
 <Textarea defaultValue="Payment due within 30 days." className="mt-1.5" rows={2} />
 </div>
 <Button>Save Defaults</Button>
 </CardContent>
 </Card>
 </TabsContent>

 {/* Notifications */}
 <TabsContent value="notifications" className="mt-4 space-y-4">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Bell className="w-5 h-5 text-primary-500" />
 Notification Preferences
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 {[
 { label: 'Push Notifications', desc: 'Payment received, invoice viewed, GST deadlines', checked: true },
 { label: 'Email Notifications', desc: 'Invoice sent, payment received, GST reminders', checked: true },
 { label: 'WhatsApp Notifications', desc: 'Payment requests, confirmations', checked: true },
 { label: 'SMS Notifications', desc: 'Urgent reminders only', checked: false },
 ].map((item, i) => (
 <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
 <div>
 <p className="text-sm font-medium text-gray-900">{item.label}</p>
 <p className="text-xs text-gray-500">{item.desc}</p>
 </div>
 <label className="relative inline-flex items-center cursor-pointer">
 <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" />
 </label>
 </div>
 ))}
 </CardContent>
 </Card>
 </TabsContent>

 {/* Preferences */}
 <TabsContent value="preferences" className="mt-4 space-y-4">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Globe className="w-5 h-5 text-primary-500" />
 Preferences
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="grid gap-4 md:grid-cols-2">
 <div>
 <Label>Language</Label>
 <Select defaultValue="en" options={[
 { value: 'en', label: 'English' },
 { value: 'hi', label: 'Hindi (हिंदी)' },
 { value: 'ta', label: 'Tamil (தமிழ்)' },
 { value: 'te', label: 'Telugu (తెలుగు)' },
 ]} className="mt-1.5" />
 </div>
 <div>
 <Label>Theme</Label>
 <Select defaultValue="system" options={[
 { value: 'light', label: 'Light' },
 { value: 'dark', label: 'Dark' },
 { value: 'system', label: 'System' },
 ]} className="mt-1.5" />
 </div>
 <div>
 <Label>Date Format</Label>
 <Select defaultValue="ddmmyyyy" options={[
 { value: 'ddmmyyyy', label: 'DD/MM/YYYY' },
 { value: 'mmddyyyy', label: 'MM/DD/YYYY' },
 { value: 'yyyymmdd', label: 'YYYY-MM-DD' },
 ]} className="mt-1.5" />
 </div>
 <div>
 <Label>Number Format</Label>
 <Select defaultValue="indian" options={[
 { value: 'indian', label: 'Indian (1,00,000)' },
 { value: 'international', label: 'International (100,000)' },
 ]} className="mt-1.5" />
 </div>
 </div>
 <Button>Save Preferences</Button>
 </CardContent>
 </Card>
 </TabsContent>

 {/* Data & Privacy */}
 <TabsContent value="data" className="mt-4 space-y-4">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Shield className="w-5 h-5 text-primary-500" />
 Data & Privacy
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <div>
 <p className="text-sm font-medium text-gray-900 mb-2">Export Data</p>
 <div className="flex flex-wrap gap-2">
 <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />CSV</Button>
 <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Excel</Button>
 <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />PDF</Button>
 <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />JSON</Button>
 </div>
 </div>
 <Separator />
 <div>
 <p className="text-sm font-medium text-gray-900 mb-2">Backup & Restore</p>
 <div className="flex gap-2">
 <Button variant="outline" size="sm">Create Backup</Button>
 <Button variant="outline" size="sm">Restore from Backup</Button>
 </div>
 </div>
 <Separator />
 <div>
 <p className="text-sm font-medium text-error-600 mb-2">Danger Zone</p>
 <Button variant="destructive" size="sm">Delete Account</Button>
 </div>
 </CardContent>
 </Card>
 </TabsContent>

 {/* Subscription */}
 <TabsContent value="subscription" className="mt-4 space-y-4">
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <CreditCard className="w-5 h-5 text-primary-500" />
 Subscription
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
 <div>
 <p className="text-sm font-medium text-gray-900">Current Plan: Free</p>
 <p className="text-xs text-gray-500 mt-1">5/10 scans used this month</p>
 <p className="text-xs text-gray-500">2/5 invoices used this month</p>
 </div>
 <Badge status="draft" text="Free" />
 </div>
 <div className="grid gap-3 md:grid-cols-3">
 <Card className="border-gray-200">
 <CardContent className="p-4 text-center">
 <h3 className="font-semibold">Pro</h3>
 <p className="text-2xl font-bold mt-1">₹149<span className="text-sm font-normal text-gray-400">/mo</span></p>
 <ul className="text-xs text-gray-500 mt-3 space-y-1">
 <li>Unlimited scans</li>
 <li>GST reports</li>
 <li>Priority support</li>
 </ul>
 <Button className="w-full mt-3" size="sm">Upgrade</Button>
 </CardContent>
 </Card>
 <Card className="border-primary-200">
 <CardContent className="p-4 text-center">
 <h3 className="font-semibold">Pro ⭐</h3>
 <p className="text-2xl font-bold mt-1">₹149<span className="text-sm font-normal text-gray-400">/mo</span></p>
 <ul className="text-xs text-gray-500 mt-3 space-y-1">
 <li>Everything in Free</li>
 <li>Unlimited invoices</li>
 <li>WhatsApp support</li>
 </ul>
 <Button className="w-full mt-3" size="sm">Current Plan</Button>
 </CardContent>
 </Card>
 <Card className="border-gray-200">
 <CardContent className="p-4 text-center">
 <h3 className="font-semibold">Business</h3>
 <p className="text-2xl font-bold mt-1">₹399<span className="text-sm font-normal text-gray-400">/mo</span></p>
 <ul className="text-xs text-gray-500 mt-3 space-y-1">
 <li>Multi-user access</li>
 <li>Custom branding</li>
 <li>API access</li>
 </ul>
 <Button className="w-full mt-3" size="sm" variant="outline">Upgrade</Button>
 </CardContent>
 </Card>
 </div>
 </CardContent>
 </Card>
 </TabsContent>
 </Tabs>
 </div>
 </DashboardShell>
 )
}
