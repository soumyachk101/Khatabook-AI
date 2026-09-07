#!/usr/bin/env tsx
// =============================================================================
// Khatabook-AI — Database Seed Script
// =============================================================================
// Seeds a demo user, business, categories, receipts, invoices, and expenses
// for local development and testing.
// =============================================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Config ─────────────────────────────────────────────────────────────────────
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_EMAIL = "demo@khatabook.ai";
const DEMO_PASSWORD = "$2b$12$demo_hashed_password_change_in_production"; // bcrypt of "password123"
const DEMO_PHONE = "+919876543210";

const BUSINESS_NAME = "Demo Freelance Studio";
const BUSINESS_GSTIN = "27AABCT1234R1ZX";
const BUSINESS_PAN = "AABCT1234R";
const BUSINESS_STATE = "Maharashtra";

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
 console.log("🌱 Starting Khatabook-AI seed...\n");

 // Check if demo user already exists
 const existing = await prisma.profile.findUnique({
 where: { userId: DEMO_USER_ID },
 });

 if (existing) {
 console.log("⚠️ Demo user already exists. Skipping seed.");
 console.log(` Profile ID: ${existing.id}`);
 await prisma.$disconnect();
 return;
 }

 // ── Profile + Business ──────────────────────────────────────────────────────
 console.log("Creating demo user & business...");
 const profile = await prisma.profile.create({
 data: {
 id: DEMO_USER_ID,
 email: DEMO_EMAIL,
 phone: DEMO_PHONE,
 fullName: "Demo User",
 isOnboarded: true,
 business: {
 create: {
 name: BUSINESS_NAME,
 type: "sole_proprietor",
 gstin: BUSINESS_GSTIN,
 pan: BUSINESS_PAN,
 state: BUSINESS_STATE,
 city: "Mumbai",
 pincode: "400001",
 address: "123, Marine Drive, Nariman Point",
 financialYearStart: 4,
 currency: "INR",
 timezone: "Asia/Kolkata",
 },
 },
 },
 include: { business: true },
 });

 const business = profile.business!;
 console.log(` ✅ Profile: ${profile.email}`);
 console.log(` ✅ Business: ${business.name} (${business.gstin})\n`);

 // ── Categories ──────────────────────────────────────────────────────────────
 console.log("Creating categories...");
 const categories = await prisma.category.createMany({
 data: [
 // Income categories
 { name: "Consulting", type: "income", color: "#22c55e", businessId: business.id, isSystem: true },
 { name: "Web Development", type: "income", color: "#10b981", businessId: business.id, isSystem: true },
 { name: "UI/UX Design", type: "income", color: "#34d399", businessId: business.id, isSystem: true },
 { name: "Mobile App Development", type: "income", color: "#6ee7b7", businessId: business.id, isSystem: true },
 { name: "Technical Consulting", type: "income", color: "#a7f3d0", businessId: business.id, isSystem: true },
 { name: "Maintenance Retainer", type: "income", color: "#059669", businessId: business.id, isSystem: true },
 // Expense categories
 { name: "Software Subscriptions", type: "expense", color: "#ef4444", businessId: business.id, isSystem: true },
 { name: "Office Supplies", type: "expense", color: "#f97316", businessId: business.id, isSystem: true },
 { name: "Internet & Phone", type: "expense", color: "#eab308", businessId: business.id, isSystem: true },
 { name: "Travel", type: "expense", color: "#f59e0b", businessId: business.id, isSystem: true },
 { name: "Meals & Entertainment", type: "expense", color: "#d97706", businessId: business.id, isSystem: true },
 { name: "Training & Courses", type: "expense", color: "#b45309", businessId: business.id, isSystem: true },
 ],
 });
 console.log(` ✅ Created ${categories.count} categories\n`);

 const incomeCategories = await prisma.category.findMany({
 where: { businessId: business.id, type: "income" },
 });
 const expenseCategories = await prisma.category.findMany({
 where: { businessId: business.id, type: "expense" },
 });

 // ── Receipts ────────────────────────────────────────────────────────────────
 console.log("Creating demo receipts...");
 const now = new Date();
 const receipts = await prisma.receipt.createMany({
 data: [
 {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Software Subscriptions")?.id,
 imageUrl: "https://images.unsplash.com/photo-1555066931-436e5c000049?w=800",
 rawText: "INVOICE #INV-2024-001\nZoom Video Communications\nPro Plan Monthly\nAmount: ₹1,490.00\nGST: 18%\nTotal: ₹1,758.20",
 extractedData: {
 vendor: "Zoom Video Communications",
 amount: 1490,
 gstRate: 18,
 total: 1758.20,
 date: "2025-01-15",
 category: "Software Subscriptions",
 },
 confidence: 0.95,
 isVerified: true,
 createdAt: new Date(now.getTime() - 30 * 86400000),
 },
 {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Office Supplies")?.id,
 imageUrl: "https://images.unsplash.com/photo-1556742049-0cf9ebd63f78?w=800",
 rawText: "Store Name: Croma\nItems: Ergonomic Chair, Desk Lamp\nTotal: ₹18,500.00\nPayment: UPI",
 extractedData: {
 vendor: "Croma",
 amount: 18500,
 gstRate: 18,
 total: 21830,
 date: "2025-01-20",
 category: "Office Supplies",
 },
 confidence: 0.88,
 isVerified: true,
 createdAt: new Date(now.getTime() - 25 * 86400000),
 },
 {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Travel")?.id,
 imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
 rawText: "IRCTC Railway Ticket\nMumbai → Pune\nAC Chair Car\nAmount: ₹1,250.00",
 extractedData: {
 vendor: "IRCTC",
 amount: 1250,
 date: "2025-02-01",
 category: "Travel",
 },
 confidence: 0.92,
 isVerified: true,
 createdAt: new Date(now.getTime() - 20 * 86400000),
 },
 {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Meals & Entertainment")?.id,
 imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
 rawText: "Restaurant: Blue Tokai Coffee Roasters\nItems: Cold Brew, Croissant, Salad\nTotal: ₹890.00",
 extractedData: {
 vendor: "Blue Tokai Coffee Roasters",
 amount: 890,
 gstRate: 5,
 total: 934.50,
 date: "2025-02-05",
 category: "Meals & Entertainment",
 },
 confidence: 0.91,
 isVerified: true,
 createdAt: new Date(now.getTime() - 15 * 86400000),
 },
 {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Training & Courses")?.id,
 imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b0?w=800",
 rawText: "Udemy Course: Advanced React Patterns\nAmount: ₹499.00",
 extractedData: {
 vendor: "Udemy",
 amount: 499,
 date: "2025-02-10",
 category: "Training & Courses",
 },
 confidence: 0.97,
 isVerified: true,
 createdAt: new Date(now.getTime() - 10 * 86400000),
 },
 ],
 });
 console.log(` ✅ Created ${receipts.count} receipts\n`);

 // ── Invoices ────────────────────────────────────────────────────────────────
 console.log("Creating demo invoices...");
 await prisma.invoice.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 invoiceNumber: "INV-2025-001",
 customerName: "Acme Corporation Pvt Ltd",
 customerEmail: "billing@acme.co.in",
 customerPhone: "+919876543200",
 billingAddress: "Tech Park, Whitefield, Bangalore",
 subtotal: 50000,
 taxRate: 18,
 taxAmount: 9000,
 discount: 0,
 total: 59000,
 currency: "INR",
 status: "paid",
 sentAt: new Date(now.getTime() - 45 * 86400000),
 paidAt: new Date(now.getTime() - 40 * 86400000),
 dueDate: new Date(now.getTime() - 5 * 86400000),
 lineItems: [
 { description: "Website Redesign", quantity: 1, rate: 30000, amount: 30000 },
 { description: "E-commerce Integration", quantity: 1, rate: 20000, amount: 20000 },
 ],
 },
 });

 await prisma.invoice.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 invoiceNumber: "INV-2025-002",
 customerName: "StartupHub Inc",
 customerEmail: "finance@startuphub.io",
 customerPhone: "+919876543201",
 billingAddress: "Koramangala, Bangalore",
 subtotal: 35000,
 taxRate: 18,
 taxAmount: 6300,
 discount: 500,
 total: 40800,
 currency: "INR",
 status: "sent",
 sentAt: new Date(now.getTime() - 5 * 86400000),
 dueDate: new Date(now.getTime() + 20 * 86400000),
 lineItems: [
 { description: "Mobile App UI Design", quantity: 1, rate: 35000, amount: 35000 },
 ],
 },
 });

 await prisma.invoice.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 invoiceNumber: "INV-2025-003",
 customerName: "GreenLeaf Organics",
 customerEmail: "accounts@greenleaf.in",
 billingAddress: "Andheri West, Mumbai",
 subtotal: 25000,
 taxRate: 18,
 taxAmount: 4500,
 discount: 0,
 total: 29500,
 currency: "INR",
 status: "draft",
 lineItems: [
 { description: "POS System Development", quantity: 1, rate: 25000, amount: 25000 },
 ],
 },
 });
 console.log(" ✅ Created 3 invoices\n");

 // ── Expenses ────────────────────────────────────────────────────────────────
 console.log("Creating demo expenses...");
 await prisma.expense.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Software Subscriptions")!.id,
 amount: 1490,
 description: "Zoom Pro subscription — January",
 date: new Date(now.getTime() - 30 * 86400000),
 paymentMethod: "upi",
 referenceNumber: "UPI-20250115001",
 isGstApplicable: true,
 gstRate: 18,
 gstAmount: 268.20,
 notes: "Monthly Zoom Pro plan for team calls",
 },
 });

 await prisma.expense.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Internet & Phone")!.id,
 amount: 1299,
 description: "Airtel Xstream Fiber — February",
 date: new Date(now.getTime() - 10 * 86400000),
 paymentMethod: "upi",
 referenceNumber: "UPI-20250205002",
 isGstApplicable: true,
 gstRate: 18,
 gstAmount: 233.82,
 notes: "Monthly internet bill",
 },
 });

 await prisma.expense.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Travel")!.id,
 amount: 1250,
 description: "Mumbai → Pune train ticket",
 date: new Date(now.getTime() - 20 * 86400000),
 paymentMethod: "upi",
 referenceNumber: "UPI-20250201003",
 isGstApplicable: false,
 notes: "Client meeting travel",
 },
 });

 await prisma.expense.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Meals & Entertainment")!.id,
 amount: 890,
 description: "Team lunch at Blue Tokai",
 date: new Date(now.getTime() - 15 * 86400000),
 paymentMethod: "card",
 isGstApplicable: true,
 gstRate: 5,
 gstAmount: 44.50,
 notes: "Team outing",
 },
 });

 await prisma.expense.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 categoryId: expenseCategories.find((c) => c.name === "Training & Courses")!.id,
 amount: 499,
 description: "Advanced React Patterns — Udemy",
 date: new Date(now.getTime() - 10 * 86400000),
 paymentMethod: "card",
 isGstApplicable: false,
 notes: "Skill development course",
 },
 });
 console.log(" ✅ Created 5 expenses\n");

 // ── Payments ────────────────────────────────────────────────────────────────
 console.log("Creating demo payments...");
 await prisma.payment.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 invoiceId: (await prisma.invoice.findFirst({ where: { invoiceNumber: "INV-2025-001" } }))!.id,
 amount: 59000,
 currency: "INR",
 method: "razorpay",
 status: "completed",
 razorpayPaymentId: "pay_DEMO2025001",
 razorpayOrderId: "order_DEMO2025001",
 paidAt: new Date(now.getTime() - 40 * 86400000),
 },
 });
 console.log(" ✅ Created 1 payment\n");

 // ── GST Return ──────────────────────────────────────────────────────────────
 console.log("Creating demo GST return...");
 await prisma.gstReturn.create({
 data: {
 businessId: business.id,
 profileId: profile.id,
 returnType: "GSTR-3B",
 financialYear: "2024-25",
 quarter: "Q4",
 month: 1,
 periodStart: new Date("2025-01-01"),
 periodEnd: new Date("2025-01-31"),
 totalOutwardSupply: 50000,
 totalInwardSupply: 5000,
 outputTax: 9000,
 inputTax: 900,
 taxPayable: 8100,
 itcAvailable: 900,
 status: "filed",
 filedAt: new Date(now.getTime() - 5 * 86400000),
 dueDate: new Date("2025-02-20"),
 },
 });
 console.log(" ✅ Created 1 GST return\n");

 // ── Summary ─────────────────────────────────────────────────────────────────
 console.log("═══════════════════════════════════════════════════════");
 console.log("✅ Seed completed successfully!");
 console.log("═══════════════════════════════════════════════════════");
 console.log(` Profile : ${profile.email}`);
 console.log(` Business: ${business.name}`);
 console.log(` User ID : ${profile.id}`);
 console.log(`\n Login with email: ${DEMO_EMAIL}`);
 console.log(` (Password is pre-hashed for demo — use signup endpoint for real auth)`);
 console.log("═══════════════════════════════════════════════════════\n");

 await prisma.$disconnect();
}

main().catch((err) => {
 console.error(`\n❌ Seed failed: ${err.message}\n`);
 prisma.$disconnect().then(() => process.exit(1));
});
