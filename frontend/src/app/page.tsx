import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scan, FileText, Wallet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
 return (
 <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
 <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
 <div className="container mx-auto px-4 h-16 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
 <FileText className="w-5 h-5 text-white" />
 </div>
 <span className="font-bold text-xl">Khatabook AI</span>
 </div>
 <div className="flex items-center gap-3">
 <Button variant="ghost" asChild>
 <Link href="/app">Sign In</Link>
 </Button>
 <Button asChild>
 <Link href="/app">
 Get Started <ArrowRight className="ml-2 w-4 h-4" />
 </Link>
 </Button>
 </div>
 </div>
 </nav>

 <main>
 <section className="container mx-auto px-4 py-20 text-center">
 <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
 <Sparkles className="w-4 h-4" />
 AI-Powered Accounting for India
 </div>
 <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
 Smarter Books.{" "}
 <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
 Happier Business.
 </span>
 </h1>
 <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
 The intelligent accounting platform built for Indian businesses.
 Scan receipts with AI, generate GST-ready invoices, accept UPI
 payments instantly.
 </p>
 <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
 <Button size="lg" asChild>
 <Link href="/app">
 Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
 </Link>
 </Button>
 <Button size="lg" variant="outline" asChild>
 <Link href="#features">See How It Works</Link>
 </Button>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
 {[
 {
 icon: Scan,
 label: "AI Receipt Scan",
 desc: "Scan & auto-extract",
 },
 {
 icon: FileText,
 label: "GST Invoices",
 desc: "Compliant & fast",
 },
 {
 icon: Wallet,
 label: "UPI Payments",
 desc: "Instant collections",
 },
 {
 icon: Sparkles,
 label: "Smart Reports",
 desc: "AI insights",
 },
 ].map((feature) => (
 <div
 key={feature.label}
 className="p-6 rounded-2xl bg-card border shadow-sm"
 >
 <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
 <div className="font-semibold text-sm">{feature.label}</div>
 <div className="text-xs text-muted-foreground mt-1">
 {feature.desc}
 </div>
 </div>
 ))}
 </div>
 </section>

 <section id="features" className="container mx-auto px-4 py-20">
 <div className="text-center mb-12">
 <h2 className="text-3xl font-bold mb-4">
 Everything your business needs
 </h2>
 <p className="text-muted-foreground">
 Designed for Indian MSMEs, trusted by thousands
 </p>
 </div>
 <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
 {[
 {
 title: "Smart Receipt Scanner",
 desc: "Upload or snap a photo — AI extracts vendor, date, items, and tax instantly.",
 },
 {
 title: "GST-Ready Invoicing",
 desc: "Create HSN/SAC-coded invoices with automatic GST calculation. GSTR-1 & 3B ready.",
 },
 {
 title: "UPI Payment Links",
 desc: "Generate payment links and QR codes. Accept payments via any UPI app.",
 },
 {
 title: "Auto GST Reports",
 desc: "Monthly and quarterly summaries. ITC tracking, B2B/B2C breakdowns.",
 },
 {
 title: "Payment Reminders",
 desc: "Automated WhatsApp and email reminders. Get paid faster.",
 },
 {
 title: "Indian Number Format",
 desc: "All amounts in Lakhs, Crores. Clear, compliant reports in ₹.",
 },
 ].map((feature) => (
 <div
 key={feature.title}
 className="p-6 rounded-xl bg-card border shadow-sm"
 >
 <h3 className="font-semibold mb-2">{feature.title}</h3>
 <p className="text-sm text-muted-foreground">{feature.desc}</p>
 </div>
 ))}
 </div>
 </section>

 <section className="container mx-auto px-4 py-20">
 <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-12 text-center text-white">
 <h2 className="text-3xl md:text-4xl font-bold mb-4">
 Ready to simplify your accounting?
 </h2>
 <p className="text-white/80 mb-8 max-w-xl mx-auto">
 Join thousands of Indian businesses using Khatabook AI to save time
 and stay GST compliant.
 </p>
 <Button size="lg" variant="secondary" asChild>
 <Link href="/app">
 Get Started for Free <ArrowRight className="ml-2 w-4 h-4" />
 </Link>
 </Button>
 </div>
 </section>
 </main>

 <footer className="border-t py-8">
 <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
 Khatabook AI. Built with pride for Indian businesses.
 </div>
 </footer>
 </div>
 );
}
