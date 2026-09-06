/**
 * Khatabook AI — Shared Constants
 *
 * Central barrel file. New constants live in topic-specific sub-modules
 * and are re-exported here so every consumer can import from a single path.
 */

// ─── Expense categories ────────────────────────────────────────────────────────

export const DEFAULT_EXPENSE_CATEGORIES = [
 'Office Supplies',
 'Rent & Utilities',
 'Software & SaaS',
 'Travel & Lodging',
 'Meals & Entertainment',
 'Advertising & Marketing',
 'Professional Services',
 'Hardware & Equipment',
 'Miscellaneous',
] as const;

export type ExpenseCategory = (typeof DEFAULT_EXPENSE_CATEGORIES)[number];

export const DEFAULT_INCOME_CATEGORIES = [
 'Consulting Services',
 'Product Sales',
 'Software Development',
 'Subscription / Retainer',
 'Affiliate & Referrals',
 'Other Income',
] as const;

export type IncomeCategory = (typeof DEFAULT_INCOME_CATEGORIES)[number];

export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'] as const;
export const DEFAULT_CURRENCY = 'INR';

export const INVOICE_STATUSES = ['draft', 'sent', 'paid', 'overdue'] as const;
export const PAYMENT_METHODS = ['upi', 'card', 'netbanking', 'cash'] as const;

// ─── GST ───────────────────────────────────────────────────────────────────────

export { GST_RATES, GST_RATE_DETAILS, GST_VALIDATION, GST_FILING_DEADLINES } from './gst';

// ─── Indian States ────────────────────────────────────────────────────────────

export {
 INDIAN_STATES,
 STATES_BY_CODE,
 STATES_BY_GST_CODE,
 isInterstate,
} from './states';

// ─── Pricing & Plans ──────────────────────────────────────────────────────────

export {
 PLANS,
 PLANS_BY_ID,
 DEFAULT_PLAN,
 type Plan,
 type PlanId,
} from './pricing';
