/**
 * Khatabook AI — Shared AI Types
 *
 * Exported from shared/ so both frontend and backend can reference
 * the exact same contracts without duplication.
 */

export interface ReceiptLineItem {
 description: string;
 quantity: number | null;
 unitPrice: number | null;
 gstRate: number | null;
 amount: number | null;
}

export interface ReceiptExtraction {
 vendorName: string | null;
 vendorAddress: string | null;
 vendorGstin: string | null;
 invoiceNumber: string | null;
 invoiceDate: string | null;
 dueDate: string | null;
 paymentMode: string | null;
 subTotal: number | null;
 cgstAmount: number | null;
 sgstAmount: number | null;
 igstAmount: number | null;
 cessAmount: number | null;
 discountAmount: number | null;
 totalAmount: number | null;
 currency: string;
 lineItems: ReceiptLineItem[];
 confidence: number;
 processingStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'review_required';
 processingError: string | null;
 modelVersion: string | null;
}

export interface CategorizeRequest {
 description: string;
 amount: number;
 vendorName?: string;
 vendorGstin?: string;
 previousCategoryId?: string | null;
 businessId?: string;
}

export interface CategorizeResult {
 categoryId: string;
 categoryName: string;
 categorySlug: string;
 categoryGroup: string;
 confidence: number;
 gstRate: number | null;
 hsnCode: string | null;
 suggestedSubcategory: string | null;
 reasoning: string;
}

export interface GSTDetail {
 vendorGstin: string;
 placeOfSupply: string;
 placeOfSupplyState: string;
 isInterstate: boolean;
 subTotal: number;
 cgstAmount: number;
 sgstAmount: number;
 igstAmount: number;
 totalTax: number;
 gstRate: number;
 hsnCode: string | null;
}

export interface GSTR1Entry {
 invoiceNumber: string;
 invoiceDate: string;
 recipientGstin: string;
 recipientName: string;
 placeOfSupply: string;
 taxableValue: number;
 cgst: number;
 sgst: number;
 igst: number;
 cess: number;
 invoiceType: 'B2B' | 'B2C' | 'B2CL' | 'B2CS';
 hsnCode: string | null;
}

export interface GSTR3BSummary {
 outwardTaxable: number;
 outwardIgst: number;
 outwardCess: number;
 inwardTaxable: number;
 inputCgst: number;
 inputSgst: number;
 inputIgst: number;
 inputCess: number;
 netCgstLiability: number;
 netSgstLiability: number;
 netIgstLiability: number;
 totalLiability: number;
}

export interface SpendingInsight {
 id: string;
 type: 'trend' | 'anomaly' | 'suggestion' | 'alert';
 title: string;
 description: string;
 category: string;
 amount: number;
 period: string;
 priority: 'low' | 'medium' | 'high';
 actionable: boolean;
 actionLabel?: string;
 actionRoute?: string;
}

export interface TaxSavingSuggestion {
 id: string;
 title: string;
 description: string;
 estimatedSaving: number;
 section: string;
 documents?: string[];
 priority: 'low' | 'medium' | 'high';
 deadline?: string;
}

export interface SystemCategory {
 id: string;
 name: string;
 slug: string;
 type: 'income' | 'expense';
 group: string;
 color: string;
 icon: string;
 gstRate: number | null;
 keywords: string[];
}

export interface GSTReturn {
 id: string;
 userId: string;
 businessId: string;
 financialYear: string;
 quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
 quarterStartDate: Date | string;
 quarterEndDate: Date | string;
 totalTaxableValue: number;
 totalCgst: number;
 totalSgst: number;
 totalIgst: number;
 inputCgst: number;
 inputSgst: number;
 inputIgst: number;
 netCgst: number;
 netSgst: number;
 netIgst: number;
 netLiability: number;
 filingStatus: 'draft' | 'ready_to_file' | 'filed' | 'amended';
 filedAt?: Date | string | null;
 createdAt: Date | string;
}

export const DEFAULT_SYSTEM_CATEGORIES: SystemCategory[] = [
 { id: 'meals-entertainment', name: 'Meals & Entertainment', slug: 'meals-entertainment', type: 'expense', group: 'food', color: '#f97316', icon: 'utensils', gstRate: 5, keywords: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'meal'] },
 { id: 'travel-transport', name: 'Travel & Transport', slug: 'travel-transport', type: 'expense', group: 'travel', color: '#3b82f6', icon: 'car', gstRate: 5, keywords: ['uber', 'ola', 'rapido', 'cab', 'taxi', 'metro', 'bus', 'train', 'flight', 'parking'] },
 { id: 'internet-phone', name: 'Internet & Phone', slug: 'internet-phone', type: 'expense', group: 'utilities', color: '#10b981', icon: 'smartphone', gstRate: 18, keywords: ['broadband', 'mobile', 'data', 'recharge', 'wifi', 'jio', 'airtel', 'bsnl', 'vi'] },
 { id: 'electricity-utilities', name: 'Electricity & Utilities', slug: 'electricity-utilities', type: 'expense', group: 'utilities', color: '#f59e0b', icon: 'zap', gstRate: 18, keywords: ['electricity', 'water', 'gas', 'lpg', 'power'] },
 { id: 'software-subscriptions', name: 'Software & Subscriptions', slug: 'software-subscriptions', type: 'expense', group: 'software', color: '#8b5cf6', icon: 'cloud', gstRate: 18, keywords: ['aws', 'gcp', 'azure', 'software', 'subscription', 'saas', 'notion', 'figma', 'adobe', 'github'] },
 { id: 'rent-office', name: 'Rent & Office Space', slug: 'rent-office', type: 'expense', group: 'office', color: '#ef4444', icon: 'building', gstRate: null, keywords: ['rent', 'lease', 'office rent', 'shop rent', 'godown'] },
 { id: 'salary-wages', name: 'Salary & Wages', slug: 'salary-wages', type: 'expense', group: 'salary', color: '#6366f1', icon: 'users', gstRate: null, keywords: ['salary', 'wage', 'payroll', 'staff payment'] },
 { id: 'equipment-hardware', name: 'Equipment & Hardware', slug: 'equipment-hardware', type: 'expense', group: 'equipment', color: '#14b8a6', icon: 'laptop', gstRate: 18, keywords: ['laptop', 'computer', 'monitor', 'keyboard', 'mouse', 'printer', 'hardware'] },
 { id: 'insurance', name: 'Insurance', slug: 'insurance', type: 'expense', group: 'professional', color: '#06b6d4', icon: 'shield', gstRate: 18, keywords: ['insurance', 'premium', 'policy'] },
 { id: 'fuel', name: 'Fuel', slug: 'fuel', type: 'expense', group: 'travel', color: '#eab308', icon: 'fuel', gstRate: 5, keywords: ['petrol', 'diesel', 'fuel station', 'iocl', 'bpcl', 'hpcl'] },
 { id: 'marketing-advertising', name: 'Marketing & Advertising', slug: 'marketing-advertising', type: 'expense', group: 'marketing', color: '#ec4899', icon: 'megaphone', gstRate: 18, keywords: ['ads', 'marketing', 'promotion', 'facebook', 'google ads', 'instagram ad', 'campaign'] },
 { id: 'professional-services', name: 'Professional Services', slug: 'professional-services', type: 'expense', group: 'professional', color: '#64748b', icon: 'briefcase', gstRate: 18, keywords: ['ca', 'accountant', 'lawyer', 'auditor', 'consultant', 'consulting', 'legal'] },
 { id: 'courier-shipping', name: 'Courier & Shipping', slug: 'courier-shipping', type: 'expense', group: 'other', color: '#f43f5e', icon: 'truck', gstRate: 18, keywords: ['courier', 'shipping', 'delivery charge', 'postage', 'bluedart', 'dhl', 'delhivery'] },
 { id: 'training-courses', name: 'Training & Courses', slug: 'training-courses', type: 'expense', group: 'professional', color: '#22c55e', icon: 'graduation-cap', gstRate: 18, keywords: ['course', 'training', 'class', 'udemy', 'coursera', 'workshop'] },
 { id: 'raw-materials', name: 'Raw Materials & Inventory', slug: 'raw-materials', type: 'expense', group: 'other', color: '#84cc16', icon: 'package', gstRate: 18, keywords: ['raw material', 'inventory', 'wholesale', 'kirana', 'stock', 'goods purchased', 'material'] },
 { id: 'client-payment', name: 'Client Payments', slug: 'client-payment', type: 'income', group: 'income', color: '#10b981', icon: 'dollar-sign', gstRate: null, keywords: [] },
 { id: 'freelance-project', name: 'Freelance Projects', slug: 'freelance-project', type: 'income', group: 'income', color: '#06b6d4', icon: 'code', gstRate: null, keywords: [] },
 { id: 'consulting', name: 'Consulting Income', slug: 'consulting', type: 'income', group: 'income', color: '#3b82f6', icon: 'message-circle', gstRate: null, keywords: [] },
 { id: 'other', name: 'Other / Uncategorized', slug: 'other', type: 'expense', group: 'other', color: '#94a3b8', icon: 'help-circle', gstRate: 0, keywords: [] },
];

export const CATEGORY_BY_SLUG = new Map(DEFAULT_SYSTEM_CATEGORIES.map((c) => [c.slug, c]));
