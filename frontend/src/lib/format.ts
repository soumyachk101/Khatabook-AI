import { formatInTimeZone } from "date-fns";

export function formatIndianCurrency(amount: number, currency = "INR"): string {
 if (isNaN(amount)) return "₹0";
 const abs = Math.abs(amount);
 const formatted = new Intl.NumberFormat("en-IN", {
 style: "decimal",
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 }).format(abs);
 return `${amount < 0 ? "-" : ""}₹${formatted}`;
}

export function formatIndianNumber(num: number): string {
 if (isNaN(num)) return "0";
 return new Intl.NumberFormat("en-IN").format(num);
}

export function formatDate(date: string | Date, format = "dd MMM yyyy"): string {
 return formatInTimeZone(new Date(date), "Asia/Kolkata", format);
}

export function formatDateTime(date: string | Date): string {
 return formatDate(date, "dd MMM yyyy, hh:mm a");
}
