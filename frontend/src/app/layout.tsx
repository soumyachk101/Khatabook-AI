import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/lib/providers/query-provider";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
 title: "Khatabook AI - Smart Accounting for Indian Businesses",
 description:
 "AI-powered accounting and invoicing for Indian MSMEs. GST returns, UPI payments, receipt scanning, and more.",
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html lang="en" suppressHydrationWarning>
 <body className={inter.className}>
 <ThemeProvider
 attribute="class"
 defaultTheme="system"
 enableSystem
 disableTransitionOnChange
 >
 <QueryProvider>
 {children}
 <Toaster />
 </QueryProvider>
 </ThemeProvider>
 </body>
 </html>
 );
}
