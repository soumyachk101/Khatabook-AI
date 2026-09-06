/**
 * Khatabook AI — Plans and pricing constants
 */

export type PlanId = 'free' | 'pro' | 'business';

export interface Plan {
 id: PlanId;
 name: string;
 priceMonthly: number;
 priceYearly: number;
 currency: string;
 scanLimitMonthly: number;
 features: string[];
 maxUsers: number;
 gstFiling: boolean;
 prioritySupport: boolean;
 storageLimitGB: number;
 aiCategorization: boolean;
 bulkExport: boolean;
 razorpayPlanId?: string;
}

export const PLANS: Plan[] = [
 {
 id: 'free',
 name: 'Free',
 priceMonthly: 0,
 priceYearly: 0,
 currency: 'INR',
 scanLimitMonthly: 10,
 features: ['Manual entry', 'Basic reports', 'Receipt storage (up to 50)', 'Email support'],
 maxUsers: 1,
 gstFiling: false,
 prioritySupport: false,
 storageLimitGB: 1,
 aiCategorization: false,
 bulkExport: false,
 },
 {
 id: 'pro',
 name: 'Pro',
 priceMonthly: 199,
 priceYearly: 1990,
 currency: 'INR',
 scanLimitMonthly: 100,
 features: [
 'AI receipt scanning',
 'Auto-categorization',
 'GST calculator',
 'Export (CSV/PDF)',
 '10 GB storage',
 'Email + chat support',
 ],
 maxUsers: 2,
 gstFiling: true,
 prioritySupport: false,
 storageLimitGB: 10,
 aiCategorization: true,
 bulkExport: true,
 razorpayPlanId: 'plan_pro_monthly',
 },
 {
 id: 'business',
 name: 'Business',
 priceMonthly: 499,
 priceYearly: 4990,
 currency: 'INR',
 scanLimitMonthly: -1, // unlimited
 features: [
 'Unlimited AI scanning',
 'Multi-business support',
 'GSTR-1/GSTR-3B generation',
 'AI insights & suggestions',
 '100 GB storage',
 'Priority support',
 'Multi-user with roles',
 ],
 maxUsers: 10,
 gstFiling: true,
 prioritySupport: true,
 storageLimitGB: 100,
 aiCategorization: true,
 bulkExport: true,
 razorpayPlanId: 'plan_business_monthly',
 },
];

export const PLANS_BY_ID = new Map(PLANS.map((p) => [p.id, p]));

export const DEFAULT_PLAN: PlanId = 'free';
