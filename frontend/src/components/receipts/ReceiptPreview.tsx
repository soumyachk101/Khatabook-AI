"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RefreshCw, Check } from "lucide-react";

interface ReceiptPreviewProps {
 imageUrl?: string;
 onBack?: () => void;
 onExtract?: () => void;
}

function ReceiptPreview({ imageUrl, onBack, onExtract }: ReceiptPreviewProps) {
 const [zoom, setZoom] = React.useState(1);

 return (
 <div className="max-w-2xl mx-auto">
 <div className="flex items-center justify-between mb-4">
 <h1 className="text-xl font-bold">Receipt Preview</h1>
 <div className="flex gap-2">
 <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}>
 <ZoomOut className="size-4" />
 </Button>
 <Button variant="outline" size="icon" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
 <ZoomIn className="size-4" />
 </Button>
 <Button variant="outline" size="icon" onClick={onBack}>
 <RefreshCw className="size-4" />
 </Button>
 </div>
 </div>

 <Card className="p-4">
 <div className="relative bg-muted rounded-lg overflow-hidden min-h-[300px] flex items-center justify-center">
 <div
 className="bg-white rounded shadow-lg p-4 transition-transform"
 style={{ transform: `scale(${zoom})` }}
 >
 <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center min-w-[200px]">
 <div className="text-2xl font-bold mb-2">Sample Receipt</div>
 <div className="text-sm text-gray-600 mb-1">Date: 04 Sep 2025</div>
 <div className="text-sm text-gray-600 mb-1">Total: ₹2,450.75</div>
 <div className="text-xs text-gray-400 mt-4">Crop handles shown for demo</div>
 </div>
 </div>

 <div className="absolute top-2 left-2 right-2 border-2 border-primary/50 rounded pointer-events-none" />
 <div className="absolute bottom-2 left-2 right-2 border-2 border-primary/50 rounded pointer-events-none" />
 <div className="absolute top-2 bottom-2 left-2 border-2 border-primary/50 rounded pointer-events-none" />
 <div className="absolute top-2 bottom-2 right-2 border-2 border-primary/50 rounded pointer-events-none" />
 </div>
 </Card>

 <div className="mt-4 flex gap-3">
 <Button variant="outline" onClick={onBack} className="flex-1">
 Retake
 </Button>
 <Button onClick={onExtract} className="flex-1">
 <Check className="size-4 mr-2" />
 Extract Data
 </Button>
 </div>
 </div>
 );
}

export { ReceiptPreview };
