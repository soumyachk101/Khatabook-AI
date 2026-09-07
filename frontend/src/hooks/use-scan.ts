"use client";

import { useState } from "react";

interface UseScanOptions {
 onScanComplete?: (data: { vendor: string; amount: number; date: string }) => void;
}

export function useScan(options?: UseScanOptions) {
 const [isScanning, setIsScanning] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const startScan = () => {
 setIsScanning(true);
 setError(null);
 };

 const stopScan = () => {
 setIsScanning(false);
 };

 const processImage = async (file: File) => {
 setIsScanning(true);
 setError(null);
 try {
 const result = await new Promise<{ vendor: string; amount: number; date: string }>((resolve) => {
 setTimeout(() => {
 resolve({
 vendor: "Scanned Vendor",
 amount: Math.round(Math.random() * 5000 + 100),
 date: new Date().toISOString().split("T")[0],
 });
 }, 2000);
 });
 options?.onScanComplete?.(result);
 setIsScanning(false);
 return result;
 } catch (err) {
 setError("Failed to scan receipt");
 setIsScanning(false);
 throw err;
 }
 };

 return { isScanning, error, startScan, stopScan, processImage, setError };
}
