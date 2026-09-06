import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR') {
 return new Intl.NumberFormat('en-IN', {
 style: 'currency',
 currency,
 }).format(amount);
}

export function formatDate(date: Date | string) {
 return new Intl.DateTimeFormat('en-IN', {
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 }).format(new Date(date));
}

export function generateInvoiceNumber(): string {
 const date = new Date();
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, '0');
 const random = Math.floor(1000 + Math.random() * 9000);
 return `INV-${year}${month}-${random}`;
}
