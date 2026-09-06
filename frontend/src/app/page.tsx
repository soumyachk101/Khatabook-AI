import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
 Receipt,
 Camera,
 FileText,
 Calculator,
 Wallet,
 Users,
 TrendingUp,
 Shield,
 Smartphone,
 Sparkles,
 Star,
 CheckCircle2,
 ArrowRight,
 PlayCircle,
 Menu,
 X,
 IndianRupee,
 Zap,
 ChevronRight,
 Globe,
 Award,
 Clock,
 Phone,
 Mail,
 MapPin,
 Github,
 Twitter,
 Linkedin
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
 const features = [
 {
 icon: Camera,
 title: "AI Receipt Scanner",
 description: "Snap a photo of any bill or receipt. Our AI reads vendor, amount, GST, items in just 3 seconds.",
 color: "from-emerald-500 to-teal-500",
 points: ["AI reads all data", "Auto categorization", "Hindi & English OCR"],
 cta: "Try Now",
 href: "/signup",
 },
 {
 icon: FileText,
 title: "Smart Invoices",
 description: "Create professional GST invoices in under a minute. Share via WhatsApp with UPI payment links.",
 color: "from-blue-500 to-indigo-500",
 points: ["WhatsApp share", "Auto GST calc", "Payment tracking"],
 cta: "Create Invoice",
 href: "/signup",
 },
 {
 icon: Calculator,
 title: "Auto GST Reports",
 description: "GSTR-1 and GSTR-3B auto-generated from invoices. Never miss another filing deadline.",
 color: "from-purple-500 to-pink-500",
 points: ["GSTR-1 & GSTR-3B", "ITC tracking", "Deadline alerts"],
 cta: "View Reports",
 href: "/signup",
 },
 {
 icon: Wallet,
 title: "Get Paid Faster",
 description: "Share UPI QR codes and payment links. Auto-reminders for overdue invoices sent via WhatsApp.",
 color: "from-amber-500 to-orange-500",
 points: ["UPI QR codes", "Auto reminders", "Payment links"],
 cta: "Learn More",
 href: "/signup",
 },
 {
 icon: TrendingUp,
 title: "Smart Analytics",
 description: "Real-time profit & loss, expense breakdowns, and cash flow forecasts. Make data-backed decisions.",
 color: "from-rose-500 to-pink-500",
 points: ["Income vs Expenses", "Category analytics", "Cash flow forecast"],
 cta: "Explore",
 href: "/signup",
 },
 {
 icon: Shield,
 title: "Bank-Grade Security",
 description: "256-bit encryption, automatic backups, and SOC 2 compliant. Your data is always safe with us.",
 color: "from-cyan-500 to-blue-500",
 points: ["256-bit encryption", "Auto backups", "SOC 2 compliant"],
 cta: "Security",
 href: "/signup",
 },
 ]

 const steps = [
 {
 icon: Camera,
 label: "SNAP",
 title: "Take a photo",
 description: "Use your camera or upload from gallery. Works with any bill, receipt, or invoice.",
 },
 {
 icon: Sparkles,
 label: "AI MAGIC",
 title: "AI does the work",
 description: "OCR reads vendor, amount, GST. Auto-categorizes expenses in just 3 seconds.",
 },
 {
 icon: IndianRupee,
 label: "PAID",
 title: "Get paid faster",
 description: "Share invoices via WhatsApp with UPI links. Get reminders auto-sent for overdue payments.",
 },
 ]

 const pricing = [
 {
 name: "Free",
 description: "Perfect for trying out Khatabook AI",
 price: "₹0",
 period: "/forever",
 cta: "Get Started",
 featured: false,
 features: [
 { text: "10 scans per month", included: true },
 { text: "5 invoices per month", included: true },
 { text: "Basic GST reports", included: true },
 { text: "Email support", included: true },
 { text: "WhatsApp share", included: false },
 { text: "Priority support", included: false },
 ],
 },
 {
 name: "Pro",
 description: "For serious freelancers",
 price: "₹149",
 period: "/month",
 cta: "Start Pro",
 featured: true,
 badge: "Most Popular",
 features: [
 { text: "Unlimited scans", included: true },
 { text: "Unlimited invoices", included: true },
 { text: "Advanced GST reports", included: true },
 { text: "WhatsApp support", included: true },
 { text: "Priority support", included: true },
 { text: "No ads", included: true },
 ],
 },
 {
 name: "Business",
 description: "For small business teams",
 price: "₹399",
 period: "/month",
 cta: "Contact Sales",
 featured: false,
 features: [
 { text: "Everything in Pro", included: true },
 { text: "Multi-user access", included: true },
 { text: "Custom branding", included: true },
 { text: "Dedicated CA support", included: true },
 { text: "API access", included: true },
 { text: "Custom integrations", included: true },
 ],
 },
 ]

 const testimonials = [
 {
 name: "Rajesh Kumar",
 role: "Freelance Designer",
 avatar: "RK",
 rating: 5,
 quote: "Saved me 10 hours a month on GST filing. The AI receipt scanner is pure magic. I can&apos;t imagine going back to manual bookkeeping.",
 },
 {
 name: "Priya Sharma",
 role: "Small Business Owner",
 avatar: "PS",
 rating: 5,
 quote: "I used to lose track of expenses. With Khatabook AI, everything is auto-categorized and I always know my GST status. Best business app for India!",
 },
 {
 name: "Amit Patel",
 role: "Consultant",
 avatar: "AP",
 rating: 5,
 quote: "Sending professional invoices was complicated before. Now I create one in 30 seconds and share via WhatsApp. Clients pay faster than ever.",
 },
 ]

 return (
 <div className="min-h-screen bg-white">
 {/* Navigation */}
 <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
 <div className="container mx-auto px-4 flex h-16 items-center justify-between">
 <Link href="/" className="flex items-center gap-2">
 <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
 <Receipt className="w-5 h-5" />
 </div>
 <span className="text-xl font-bold text-gray-900">Khatabook AI</span>
 </Link>

 <nav className="hidden md:flex items-center gap-8">
 <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
 <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How it works</Link>
 <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
 <Link href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Reviews</Link>
 </nav>

 <div className="flex items-center gap-2">
 <Link href="/login" className="hidden sm:inline-flex">
 <Button variant="ghost" size="sm">Log in</Button>
 </Link>
 <Link href="/signup">
 <Button size="sm">Sign Up Free</Button>
 </Link>
 </div>
 </div>
 </header>

 {/* Hero Section */}
 <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 md:py-20">
 <div className="absolute inset-0 bg-grid-pattern opacity-5" />
 <div className="container mx-auto px-4 relative">
 <div className="grid lg:grid-cols-2 gap-12 items-center">
 <div className="space-y-6 text-center lg:text-left">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
 <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
 <span className="text-xs font-semibold text-emerald-700">AI-powered GST filing now in beta</span>
 </div>

 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
 The Smartest Way to{' '}
 <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
 Manage Your Business Money
 </span>
 </h1>

 <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
 Scan receipts with AI, auto-generate GST reports, send invoices on WhatsApp, and get paid faster. Built for Indian freelancers and small businesses.
 </p>

 <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
 <div className="flex items-center gap-2 text-sm text-gray-500">
 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Scan receipts
 </div>
 <div className="flex items-center gap-2 text-sm text-gray-500">
 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Create invoices
 </div>
 <div className="flex items-center gap-2 text-sm text-gray-500">
 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Auto GST
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
 <Link href="/signup">
 <Button size="lg" className="w-full sm:w-auto text-base px-8">
 Start for Free
 <ArrowRight className="w-4 h-4 ml-2" />
 </Button>
 </Link>
 <Link href="#features">
 <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
 <PlayCircle className="w-4 h-4 mr-2" />
 Watch Demo (2:30)
 </Button>
 </Link>
 </div>

 {/* Trust indicators */}
 <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6 text-xs text-gray-500">
 <div className="flex items-center gap-1">
 <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
 <span className="font-semibold text-gray-900">4.8/5</span>
 <span>on Play Store</span>
 </div>
 <div className="font-semibold">50K+ Businesses</div>
 <div className="font-semibold">₹500Cr+ Tracked</div>
 </div>
 </div>

 {/* Hero illustration */}
 <div className="relative hidden lg:block">
 <div className="relative mx-auto w-full max-w-md">
 <div className="absolute -top-6 -right-6 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
 <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
 <Card className="relative border-2 shadow-2xl">
 <CardContent className="p-6">
 <div className="flex items-center justify-between pb-4 border-b">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
 <Receipt className="w-4 h-4 text-emerald-600" />
 </div>
 <span className="font-semibold text-sm">Recent Transactions</span>
 </div>
 <span className="text-xs text-emerald-600 font-semibold">+₹45,200</span>
 </div>
 <div className="space-y-3 pt-4">
 {[
 { icon: '📷', title: 'BigBasket Groceries', amount: '-₹2,450', color: 'bg-emerald-100 text-emerald-700' },
 { icon: '📄', title: 'Invoice INV-104', amount: '+₹7,670', color: 'bg-blue-100 text-blue-700' },
 { icon: '💸', title: 'Petrol · Shell Station', amount: '-₹800', color: 'bg-rose-100 text-rose-700' },
 ].map((tx, i) => (
 <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
 <div className="flex items-center gap-3">
 <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', tx.color)}>
 <span className="text-base">{tx.icon}</span>
 </div>
 <p className="text-sm font-medium text-gray-900">{tx.title}</p>
 </div>
 <p className={cn('font-semibold text-sm font-mono', tx.amount.startsWith('-') ? 'text-rose-600' : 'text-emerald-600')}>
 {tx.amount}
 </p>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 </section>

 {/* Features Section */}
 <section id="features" className="py-20 md:py-28 bg-white">
 <div className="container mx-auto px-4">
 <div className="text-center max-w-2xl mx-auto mb-12">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 mb-4">
 <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
 <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Features</span>
 </div>
 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
 Everything you need to run your business
 </h2>
 <p className="mt-4 text-lg text-gray-600">
 Powerful features designed specifically for Indian freelancers and businesses.
 </p>
 </div>

 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {features.map((feature, i) => (
 <Card key={i} className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200">
 <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', feature.color)} />
 <CardContent className="p-6">
 <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 text-white shadow-md', feature.color)}>
 <feature.icon className="w-6 h-6" />
 </div>
 <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
 <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
 <ul className="space-y-2 mb-4">
 {feature.points.map((p, j) => (
 <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
 <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
 {p}
 </li>
 ))}
 </ul>
 <Link href={feature.href} className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700">
 {feature.cta}
 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
 </Link>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 </section>

 {/* How It Works */}
 <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-emerald-50/30">
 <div className="container mx-auto px-4">
 <div className="text-center max-w-2xl mx-auto mb-12">
 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
 How it works
 </h2>
 <p className="mt-4 text-lg text-gray-600">Three simple steps from bill to paid.</p>
 </div>

 <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
 {/* Connector line */}
 <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-200" />

 {steps.map((step, i) => (
 <div key={i} className="relative">
 <Card className="text-center p-8 hover:shadow-lg transition-shadow border-gray-200 bg-white">
 <div className="relative inline-flex">
 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg mb-4 mx-auto">
 <step.icon className="w-10 h-10" />
 </div>
 <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center font-bold text-sm shadow-md">
 {i + 1}
 </div>
 </div>
 <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-4 mb-1">{step.label}</p>
 <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
 <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
 </Card>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Stats */}
 <section className="py-16 bg-emerald-600 text-white">
 <div className="container mx-auto px-4">
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
 <div>
 <div className="text-3xl md:text-4xl font-bold">50K+</div>
 <p className="text-emerald-100 text-sm mt-1">Active Businesses</p>
 </div>
 <div>
 <div className="text-3xl md:text-4xl font-bold">₹500Cr+</div>
 <p className="text-emerald-100 text-sm mt-1">Transactions Tracked</p>
 </div>
 <div>
 <div className="text-3xl md:text-4xl font-bold">4.8★</div>
 <p className="text-emerald-100 text-sm mt-1">Play Store Rating</p>
 </div>
 <div>
 <div className="text-3xl md:text-4xl font-bold">10hrs</div>
 <p className="text-emerald-100 text-sm mt-1">Saved Monthly</p>
 </div>
 </div>
 </div>
 </section>

 {/* Pricing */}
 <section id="pricing" className="py-20 md:py-28 bg-white">
 <div className="container mx-auto px-4">
 <div className="text-center max-w-2xl mx-auto mb-12">
 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 mb-4">
 <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
 <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Pricing</span>
 </div>
 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
 Simple, transparent pricing
 </h2>
 <p className="mt-4 text-lg text-gray-600">
 Start free, upgrade when you need more. No hidden fees, cancel anytime.
 </p>
 </div>

 <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
 {pricing.map((plan, i) => (
 <Card key={i} className={cn(
 'relative overflow-hidden transition-all duration-300 hover:shadow-xl',
 plan.featured ? 'border-2 border-emerald-500 shadow-xl lg:scale-105' : 'border-gray-200'
 )}>
 {plan.badge && (
 <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
 {plan.badge}
 </div>
 )}
 <CardContent className="p-6">
 <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
 <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
 <div className="mt-4">
 <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
 <span className="text-sm text-gray-500">{plan.period}</span>
 </div>

 <ul className="space-y-3 my-6">
 {plan.features.map((feat, j) => (
 <li key={j} className="flex items-start gap-2 text-sm">
 {feat.included ? (
 <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
 ) : (
 <X className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
 )}
 <span className={feat.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
 {feat.text}
 </span>
 </li>
 ))}
 </ul>

 <Link href="/signup" className="block">
 <Button className="w-full" variant={plan.featured ? 'default' : 'outline'}>
 {plan.cta}
 </Button>
 </Link>
 </CardContent>
 </Card>
 ))}
 </div>

 <p className="text-center text-sm text-gray-500 mt-8">
 All plans include: 256-bit encryption, GST compliant, Indian number formatting, UPI integration.
 </p>
 </div>
 </section>

 {/* Testimonials */}
 <section id="testimonials" className="py-20 md:py-28 bg-gray-50">
 <div className="container mx-auto px-4">
 <div className="text-center max-w-2xl mx-auto mb-12">
 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
 Loved by 50,000+ businesses
 </h2>
 <p className="mt-4 text-lg text-gray-600">
 Don&apos;t just take our word for it. Here&apos;s what our users say.
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-6">
 {testimonials.map((testimonial, i) => (
 <Card key={i} className="bg-white hover:shadow-md transition-shadow border-gray-200">
 <CardContent className="p-6">
 <div className="flex gap-1 mb-4">
 {Array.from({ length: testimonial.rating }).map((_, j) => (
 <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
 ))}
 </div>
 <p className="text-sm text-gray-700 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: `&ldquo;${testimonial.quote.replace(/&apos;/g, "’")}&rdquo;` }} />
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
 {testimonial.avatar}
 </div>
 <div>
 <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
 <p className="text-xs text-gray-500">{testimonial.role}</p>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 </div>
 </section>

 {/* CTA Section */}
 <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white relative overflow-hidden">
 <div className="absolute inset-0 bg-grid-pattern opacity-10" />
 <div className="container mx-auto px-4 text-center relative">
 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
 Ready to simplify your finances?
 </h2>
 <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
 Join 50,000+ Indian freelancers and small businesses saving hours every month with Khatabook AI.
 </p>
 <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
 <Link href="/signup">
 <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-base px-8">
 Start Free Today
 <ArrowRight className="w-4 h-4 ml-2" />
 </Button>
 </Link>
 <Link href="#features">
 <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 text-base">
 Learn More
 </Button>
 </Link>
 </div>
 <p className="mt-6 text-sm text-emerald-100">No credit card required · 14-day Pro trial · Cancel anytime</p>
 </div>
 </section>

 {/* Footer */}
 <footer className="bg-gray-900 text-gray-400 py-12">
 <div className="container mx-auto px-4">
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
 <div>
 <Link href="/" className="flex items-center gap-2 mb-4">
 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
 <Receipt className="w-5 h-5" />
 </div>
 <span className="text-base font-bold text-white">Khatabook AI</span>
 </Link>
 <p className="text-sm">The smartest way to manage business money in India.</p>
 </div>

 <div>
 <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
 <ul className="space-y-2 text-sm">
 <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
 <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
 <li><Link href="#" className="hover:text-white transition-colors">Downloads</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
 <ul className="space-y-2 text-sm">
 <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
 <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
 <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
 <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
 </ul>
 </div>

 <div>
 <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
 <ul className="space-y-2 text-sm">
 <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
 <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
 <li><Link href="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
 <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
 </ul>
 </div>
 </div>

 <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
 <p className="text-sm">© 2026 Khatabook AI. Made with ❤️ in India.</p>
 <div className="flex gap-3">
 <a href="#" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
 <Twitter className="w-4 h-4" />
 </a>
 <a href="#" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
 <Github className="w-4 h-4" />
 </a>
 <a href="#" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
 <Linkedin className="w-4 h-4" />
 </a>
 </div>
 </div>
 </div>
 </footer>
 </div>
 )
}
