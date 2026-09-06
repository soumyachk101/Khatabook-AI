/**
 * GST rates used across the app. Standard Indian GST slabs.
 */

export const GST_RATES = [0, 5, 12, 18, 28] as const;

export type GstRate = (typeof GST_RATES)[number];

export const GST_RATE_DETAILS: Record<
 GstRate,
 { label: string; commonItems: string[]; description: string }
> = {
 0: {
 label: 'Nil-rated (0%)',
 commonItems: ['Fresh fruits', 'Vegetables', 'Eggs', 'Milk', 'Curd', 'Bread', 'Salt', 'Bindi', 'Saree (unstitched fabric)'],
 description: 'Items exempt from GST under Schedule I',
 },
 5: {
 label: '5%',
 commonItems: ['Packaged food', 'Restaurant food', 'Transport', 'Small restaurants', 'Coaching', 'Sweets'],
 description: 'Essential goods and services',
 },
 12: {
 label: '12%',
 commonItems: ['Processed food', 'Computers', 'Mobile phones (parts)', 'Butter', 'Ghee', 'Namkeen'],
 description: 'Standard processed goods',
 },
 18: {
 label: '18%',
 commonItems: ['Software', 'IT services', 'Telecom', 'Financial services', 'Restaurants (AC)', 'Hotel rooms'],
 description: 'Most common rate for services',
 },
 28: {
 label: '28%',
 commonItems: ['Luxury cars', 'Cement', 'Pan masala', 'Tobacco', 'Aerated drinks', '5-star hotel'],
 description: 'Luxury and demerit goods',
 },
};

export const GST_VALIDATION = {
 GSTIN_LENGTH: 15,
 GSTIN_REGEX: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
 STATE_CODE_OFFSET: 0,
 STATE_CODE_LENGTH: 2,
 PAN_OFFSET: 2,
 PAN_LENGTH: 10,
 ENTITY_NUMBER_INDEX: 12,
} as const;

export const INTERSTATE_THRESHOLD_AMOUNT = 0;

export const GST_FILING_DEADLINES = {
 GSTR1_DUE_DAY: 11, // 11th of following month
 GSTR3B_DUE_DAY: 20, // 20th of following month
 ANNUAL_RETURN_DUE_MONTH: 12,
 ANNUAL_RETURN_DUE_DAY: 31,
} as const;
