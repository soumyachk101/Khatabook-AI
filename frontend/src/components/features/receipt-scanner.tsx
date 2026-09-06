import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Camera, Zap } from 'lucide-react'

interface ReceiptScannerProps {
 onScan?: () => void
 className?: string
}

export function ReceiptScanner({ onScan, className }: ReceiptScannerProps) {
 return (
 <Card className={cn('overflow-hidden', className)}>
 <CardContent className="p-0">
 <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 aspect-[4/3] flex items-center justify-center">
 {/* Frame guide overlay */}
 <div className="border-2 border-white/30 rounded-xl p-8 mx-8">
 <div className="border-2 border-dashed border-white/50 rounded-lg p-12 text-center">
 <Camera className="w-12 h-12 text-white/70 mx-auto mb-3" />
 <p className="text-white/80 text-sm font-medium">Place receipt here</p>
 <p className="text-white/50 text-xs mt-1">AI will auto-detect edges</p>
 </div>
 </div>

 {/* Flash icon */}
 <div className="absolute top-4 right-4">
 <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
 <Zap className="w-5 h-5" />
 </button>
 </div>

 {/* Capture button */}
 <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
 <button
 onClick={onScan}
 className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
 >
 <div className="w-12 h-12 rounded-full border-4 border-primary-500" />
 </button>
 </div>
 </div>

 <div className="p-4 text-center">
 <p className="text-sm text-gray-600 font-medium">Align the receipt within the frame</p>
 <div className="flex items-center justify-center gap-4 mt-3">
 <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 transition-colors">
 <Camera className="w-4 h-4" />
 Gallery
 </button>
 <span className="text-gray-300">|</span>
 <button className="flex items-center gap-2 text-sm text-primary-500 font-medium">
 Camera
 </button>
 </div>
 </div>
 </CardContent>
 </Card>
 )
}
