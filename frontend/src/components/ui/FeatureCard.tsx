import React from 'react'
import { cn } from '@/lib/utils'
import { Camera, Image, ScanLine, FileText, TrendingUp, Receipt } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
 Camera: <Camera className="w-8 h-8" />,
 Image: <Image className="w-8 h-8" />,
 ScanLine: <ScanLine className="w-8 h-8" />,
 FileText: <FileText className="w-8 h-8" />,
 TrendingUp: <TrendingUp className="w-8 h-8" />,
 Receipt: <Receipt className="w-8 h-8" />,
}

interface FeatureCardProps {
 icon: string
 title: string
 description: string
 features: string[]
 ctaLabel: string
 onCta?: () => void
}

export function FeatureCard({ icon, title, description, features, ctaLabel, onCta }: FeatureCardProps) {
 return (
 <div className="bg-white rounded-card border border-gray-200 shadow-sm p-6 card-hover flex flex-col h-full">
 <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-lg flex items-center justify-center mb-4">
 {iconMap[icon] || <FileText className="w-6 h-6" />}
 </div>
 <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
 <p className="text-sm text-gray-500 mb-4">{description}</p>
 <ul className="space-y-1.5 mb-6 flex-1">
 {features.map((f, i) => (
 <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
 <span className="text-success-500 mt-0.5">✓</span>
 {f}
 </li>
 ))}
 </ul>
 <button
 onClick={onCta}
 className="mt-auto w-full py-2.5 border-2 border-primary-500 text-primary-500 rounded-input font-semibold text-sm hover:bg-primary-50 transition-colors btn-press"
 >
 {ctaLabel}
 </button>
 </div>
 )
}

interface PricingCardProps {
 name: string
 price: string
 period?: string
 features: string[]
 ctaLabel: string
 highlighted?: boolean
 onCta?: () => void
}

export function PricingCard({ name, price, period, features, ctaLabel, highlighted, onCta }: PricingCardProps) {
 return (
 <div
 className={cn(
 'bg-white rounded-card border shadow-sm p-6 flex flex-col h-full relative',
 highlighted ? 'border-primary-500 border-2 shadow-lg scale-105' : 'border-gray-200'
 )}
 >
 {highlighted && (
 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
 MOST POPULAR
 </div>
 )}
 <div className="text-center mb-6">
 <h3 className="text-lg font-bold text-gray-900 mb-1">{name}</h3>
 <div className="flex items-baseline justify-center gap-1">
 <span className="text-sm text-gray-500">₹</span>
 <span className="text-4xl font-bold text-gray-900 indian-number">{price}</span>
 {period && <span className="text-sm text-gray-500">/{period}</span>}
 </div>
 </div>
 <ul className="space-y-3 mb-8 flex-1">
 {features.map((f, i) => (
 <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
 <span className="text-success-500 mt-0.5 text-base">✓</span>
 {f}
 </li>
 ))}
 </ul>
 <button
 onClick={onCta}
 className={cn(
 'w-full py-3 rounded-input font-semibold text-sm transition-colors btn-press',
 highlighted
 ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-md'
 : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
 )}
 >
 {ctaLabel}
 </button>
 </div>
 )
}
