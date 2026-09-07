"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useScan } from "@/hooks/use-scan";
import { ReceiptPreview } from "@/components/receipts/ReceiptPreview";

function ReceiptScanner() {
 const router = useRouter();
 const { isScanning, error, startScan, stopScan, processImage, setError } = useScan();
 const [file, setFile] = React.useState<File | null>(null);
 const [mode, setMode] = React.useState<"upload" | "camera">("upload");
 const [showPreview, setShowPreview] = React.useState(false);

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const selected = e.target.files?.[0];
 if (selected) setFile(selected);
 };

 const handleScan = async () => {
 if (!file && mode === "upload") {
 setError("Please select a file first");
 return;
 }
 try {
 if (mode === "upload" && file) {
 await processImage(file);
 } else {
 await processImage(new File([], "camera.jpg"));
 }
 setShowPreview(true);
 } catch (err) {
 setError("Scan failed. Please try again.");
 }
 };

 if (showPreview) {
 return <ReceiptPreview onBack={() => setShowPreview(false)} />;
 }

 return (
 <div className="max-w-2xl mx-auto">
 <div className="text-center mb-8">
 <h1 className="text-2xl font-bold mb-2">Scan Receipt</h1>
 <p className="text-muted-foreground">Upload or capture a receipt to extract data with AI</p>
 </div>

 <Card className="p-6">
 <div className="flex rounded-lg border mb-6">
 <Button
 variant={mode === "upload" ? "default" : "ghost"}
 className="flex-1 rounded-none rounded-l-lg"
 onClick={() => setMode("upload")}
 >
 <Upload className="size-4 mr-2" />
 Upload
 </Button>
 <Button
 variant={mode === "camera" ? "default" : "ghost"}
 className="flex-1 rounded-none rounded-r-lg"
 onClick={() => setMode("camera")}
 >
 <Camera className="size-4 mr-2" />
 Camera
 </Button>
 </div>

 {mode === "upload" ? (
 <div className="border-2 border-dashed rounded-lg p-8 text-center">
 <Upload className="size-12 text-muted-foreground mx-auto mb-4" />
 <p className="text-sm text-muted-foreground mb-4">Drop a receipt image here or click to browse</p>
 <input
 type="file"
 accept="image/*"
 onChange={handleFileChange}
 className="hidden"
 id="receipt-upload"
 />
 <label htmlFor="receipt-upload">
 <Button variant="outline" asChild>
 <span>Choose File</span>
 </Button>
 </label>
 {file && <p className="text-sm mt-2 text-primary">{file.name}</p>}
 </div>
 ) : (
 <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
 <Camera className="size-12 text-muted-foreground mx-auto mb-4" />
 <p className="text-sm text-muted-foreground mb-4">Position receipt in frame and tap scan</p>
 <Button onClick={startScan} disabled={isScanning}>
 {isScanning ? "Scanning..." : "Start Camera"}
 </Button>
 </div>
 )}

 {error && <p className="text-sm text-destructive mt-4">{error}</p>}

 <div className="mt-6">
 <Button onClick={handleScan} disabled={isScanning} className="w-full" size="lg">
 {isScanning ? (
 <>
 <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
 Scanning...
 </>
 ) : (
 "Extract Data"
 )}
 </Button>
 </div>
 </Card>
 </div>
 );
}

export { ReceiptScanner };
