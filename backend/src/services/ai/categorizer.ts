/**
 * Khatabook AI — AI Expense Categorizer
 *
 * Auto-categorizes expenses using OpenAI GPT-4o-mini with Indian expense categories.
 * Learns from user corrections via a feedback store.
 *
 * This module lives in services/ai/ as the canonical AI categorization entry point.
 * The top-level categorizer.ts re-exports from here.
 */

import OpenAI from 'openai';
import type { SystemCategory, CategorizeRequest, CategorizeResult } from '@/types/ai';
import { DEFAULT_SYSTEM_CATEGORIES } from '@/types/ai';
import { getOpenAIClient, withRetry } from './openai.service';

// ─── Configuration ───────────────────────────────────────────────────────────

const CONFIG = {
 openaiModel: 'gpt-4o-mini',
 maxRetries: 3,
 retryBaseDelayMs: 500,
} as const;

// ─── Feedback Store ─────────────────────────────────────────────────────────
// In production, this would be backed by a database table.
// For now, it uses an in-memory Map — surviving only within a single server instance.

interface CorrectionRecord {
 description: string;
 amount: number;
 vendorName?: string;
 correctedCategoryId: string;
 correctedCategoryName: string;
 correctedAt: Date;
}

class CorrectionStore {
 private corrections: CorrectionRecord[] = [];
 private readonly maxEntries = 500;

 add(record: CorrectionRecord): void {
 this.corrections.unshift(record);
 if (this.corrections.length > this.maxEntries) {
 this.corrections = this.corrections.slice(0, this.maxEntries);
 }
 }

 getAll(): CorrectionRecord[] {
 return [...this.corrections];
 }

 clear(): void {
 this.corrections = [];
 }
}

export const correctionStore = new CorrectionStore();

// ─── Few-Shot Example Builder ────────────────────────────────────────────────

function buildFewShotExamples(corrections: CorrectionRecord[]): string {
 if (corrections.length === 0) return '';

 const examples = corrections.slice(0, 15); // Use up to 15 recent corrections

 let result = '\n--- LEARNED FROM USER CORRECTIONS (use these to improve accuracy) ---\n';
 for (const c of examples) {
 result += `\nInput: "${c.description}" | vendor: "${c.vendorName ?? 'unknown'}" | amount: ₹${c.amount}\n`;
 result += `Correct category: "${c.correctedCategoryName}" (ID: ${c.correctedCategoryId})\n`;
 }
 result += '\n--- END OF LEARNED EXAMPLES ---\n';
 return result;
}

// ─── Prompt Builders ─────────────────────────────────────────────────────────

function buildSystemPrompt(categories: SystemCategory[], corrections: CorrectionRecord[]): string {
 const categoryList = categories
 .map(
 (c) =>
 `- [${c.slug}] ${c.name} (type: ${c.type}, group: ${c.group}${c.gstRate !== null ? `, gstRate: ${c.gstRate}%` : ''})`
 )
 .join('\n');

 const fewShotSection = buildFewShotExamples(corrections);

 return `You are an expert expense categorization engine for Indian small businesses and freelancers.
Your job is to assign the correct category to every business expense based on its description, vendor name, and amount.

## Available Categories
${categoryList}

## Special Rules for Indian Context
1. Food/restaurant bills → meals-entertainment (gstRate: 5%)
2. Uber/Ola/Rapido → travel-transport (gstRate: 5%)
3. Metro card recharge → travel-transport
4. Electricity/water/gas bills → electricity-utilities (gstRate: 18%)
5. Broadband/mobile/data → internet-phone (gstRate: 18%)
6. Amazon/Flipkart purchases → depends on item; if unclear, use the closest category
7. Google Workspace/Zoho/Notion → software-subscriptions (gstRate: 18%)
8. AWS/GCP/Azure → software-subscriptions (gstRate: 18%)
9. Rent payment → rent-office
10. Salary/payroll → salary-wages
11. Insurance premium → insurance (gstRate: 18%)
12. Fuel at petrol pump → fuel (gstRate: 5%)
13. Courier/delivery → courier-shipping (gstRate: 18%)
14. Online courses/Coursera → training-courses (gstRate: 18%)
15. Incoming payments from clients → client-payment
16. Freelance project income → freelance-project
17. Consulting fees received → consulting
18. Raw material purchases (kirana, wholesale) → raw-materials (gstRate: 18%)
19. If vendor name contains "swiggy"/"zomato" → meals-entertainment
20. If vendor name contains "ola"/"uber"/"rapido"/"in-driver" → travel-transport
21. If vendor name contains "jio"/"airtel"/"bsnl"/"vi" → internet-phone
22. If vendor name contains "electricity board"/"msedcl"/"bescom" → electricity-utilities
23. If vendor name contains "godrej"/"pepsi"/"itc" and context is grocery → raw-materials

## Output Requirements
- Return ONLY valid JSON with no markdown, no code fences, no extra text.
- Choose the single best-matching category.
- Provide a short reasoning string explaining your choice.

${fewShotSection}

## JSON Output Format
{
 "categoryId": "system-category-slug",
 "categoryName": "Category Name",
 "categorySlug": "system-category-slug",
 "categoryGroup": "group_name",
 "confidence": 0.95,
 "gstRate": 18,
 "hsnCode": null,
 "suggestedSubcategory": null,
 "reasoning": "Brief explanation of why this category was chosen"
}`;
}

function getUserPrompt(request: CategorizeRequest): string {
 return `Categorize this expense:

Description: ${request.description}
Amount: ₹${request.amount}
${request.vendorName ? `Vendor: ${request.vendorName}` : ''}
${request.vendorGstin ? `GSTIN: ${request.vendorGstin}` : ''}
${request.previousCategoryId ? `Previously assigned category ID: ${request.previousCategoryId}` : ''}`;
}

// ─── Heuristic Fallback ──────────────────────────────────────────────────────

function heuristicCategorize(request: CategorizeRequest, categories: SystemCategory[]): CategorizeResult {
 const desc = request.description.toLowerCase();
 const vendor = (request.vendorName ?? '').toLowerCase();

 const rules: Array<{ test: () => boolean; slug: string; name: string; group: string; gstRate: number | null; reason: string }> = [
 // Food
 {
 test: () => /swiggy|zomato|restaurant|cafe|food|dining|meal|dhaba|mess|tiffin|canteen/i.test(
 desc + ' ' + vendor
 ),
 slug: 'meals-entertainment',
 name: 'Meals & Entertainment',
 group: 'food',
 gstRate: 5,
 reason: 'Matched food/restaurant keywords',
 },
 // Transport
 {
 test: () =>
 /uber|ola|rapido|in-driver|cab|taxi|metro|bus|train|flight|auto|rickshaw|fuel|petrol|diesel|parking/i.test(
 desc + ' ' + vendor
 ),
 slug: 'travel-transport',
 name: 'Travel & Transport',
 group: 'travel',
 gstRate: 5,
 reason: 'Matched transport/travel keywords',
 },
 // Utilities
 {
 test: () =>
 /electricity|power|water|gas|lpg|broadband|internet|mobile|data|recharge|wifi|jio|airtel|bsnl|vi|vodafone/i.test(
 desc + ' ' + vendor
 ),
 slug: /internet|mobile|data|recharge|broadband|jio|airtel|bsnl|vi|vodafone/i.test(desc + ' ' + vendor)
 ? 'internet-phone'
 : 'electricity-utilities',
 name: /internet|mobile|data|recharge|broadband|jio|airtel|bsnl|vi|vodafone/i.test(desc + ' ' + vendor)
 ? 'Internet & Phone'
 : 'Electricity & Utilities',
 group: 'utilities',
 gstRate: 18,
 reason: 'Matched utility keywords',
 },
 // Software
 {
 test: () =>
 /aws|gcp|azure|google cloud|hosting|domain|software|subscription|saas|notion|figma|adobe|canva|github|vercel|netlify|slack|zoom|ms365|office 365/i.test(
 desc + ' ' + vendor
 ),
 slug: 'software-subscriptions',
 name: 'Software & Subscriptions',
 group: 'software',
 gstRate: 18,
 reason: 'Matched software/SaaS keywords',
 },
 // Rent
 {
 test: () => /rent|lease|office rent|shop rent|godown/i.test(desc + ' ' + vendor),
 slug: 'rent-office',
 name: 'Rent & Office Space',
 group: 'office',
 gstRate: null,
 reason: 'Matched rent keywords',
 },
 // Fuel
 {
 test: () => /petrol|diesel|fuel station|iocl|bpcl|hpcl/i.test(desc + ' ' + vendor),
 slug: 'fuel',
 name: 'Fuel',
 group: 'travel',
 gstRate: 5,
 reason: 'Matched fuel keywords',
 },
 // Insurance
 {
 test: () => /insurance|premium|policy/i.test(desc + ' ' + vendor),
 slug: 'insurance',
 name: 'Insurance',
 group: 'professional',
 gstRate: 18,
 reason: 'Matched insurance keywords',
 },
 // Salary
 {
 test: () => /salary|wage|payroll|staff payment/i.test(desc + ' ' + vendor),
 slug: 'salary-wages',
 name: 'Salary & Wages',
 group: 'salary',
 gstRate: null,
 reason: 'Matched salary keywords',
 },
 // Marketing
 {
 test: () => /ads?|marketing|promotion|facebook|google ads|instagram ad|campaign/i.test(desc + ' ' + vendor),
 slug: 'marketing-advertising',
 name: 'Marketing & Advertising',
 group: 'marketing',
 gstRate: 18,
 reason: 'Matched marketing keywords',
 },
 // Equipment
 {
 test: () => /laptop|computer|monitor|keyboard|mouse|printer|hardware|equipment|desk|chair/i.test(desc + ' ' + vendor),
 slug: 'equipment-hardware',
 name: 'Equipment & Hardware',
 group: 'equipment',
 gstRate: 18,
 reason: 'Matched equipment keywords',
 },
 // Professional services
 {
 test: () => /ca |accountant|lawyer|auditor|consultant|consulting|legal|filing/i.test(desc + ' ' + vendor),
 slug: 'professional-services',
 name: 'Professional Services',
 group: 'professional',
 gstRate: 18,
 reason: 'Matched professional services keywords',
 },
 // Raw materials
 {
 test: () => /raw material|inventory|wholesale|kirana|stock|goods purchased|material/i.test(
 desc + ' ' + vendor
 ),
 slug: 'raw-materials',
 name: 'Raw Materials & Inventory',
 group: 'other',
 gstRate: 18,
 reason: 'Matched raw material keywords',
 },
 // Training
 {
 test: () => /course|training|class|udemy|coursera|workshop|seminar|conference/i.test(
 desc + ' ' + vendor
 ),
 slug: 'training-courses',
 name: 'Training & Courses',
 group: 'professional',
 gstRate: 18,
 reason: 'Matched training keywords',
 },
 // Courier
 {
 test: () => /courier|shipping|delivery charge|postage|dtdc|bluedart|dhl|fedex|delhivery/i.test(
 desc + ' ' + vendor
 ),
 slug: 'courier-shipping',
 name: 'Courier & Shipping',
 group: 'other',
 gstRate: 18,
 reason: 'Matched courier keywords',
 },
 ];

 for (const rule of rules) {
 if (rule.test()) {
 return {
 categoryId: rule.slug,
 categoryName: rule.name,
 categorySlug: rule.slug,
 categoryGroup: rule.group,
 confidence: 0.72,
 gstRate: rule.gstRate,
 hsnCode: null,
 suggestedSubcategory: null,
 reasoning: rule.reason,
 };
 }
 }

 // Default: "other" fallback
 return {
 categoryId: 'other',
 categoryName: 'Other / Uncategorized',
 categorySlug: 'other',
 categoryGroup: 'other',
 confidence: 0.3,
 gstRate: 0,
 hsnCode: null,
 suggestedSubcategory: null,
 reasoning: 'No matching rule found — defaulted to uncategorized',
 };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface CategorizeOptions {
 request: CategorizeRequest;
 availableCategories: SystemCategory[];
 useHeuristicFallback?: boolean;
}

export async function categorizeExpense(options: CategorizeOptions): Promise<CategorizeResult> {
 const { request, availableCategories, useHeuristicFallback = true } = options;

 if (availableCategories.length === 0) {
 throw new Error('No categories available for classification');
 }

 const corrections = correctionStore.getAll();

 // Try OpenAI first using shared retry helper
 if (process.env.OPENAI_API_KEY) {
 try {
 const client = getOpenAIClient();

 const response = await withRetry(
 () =>
 client.chat.completions.create({
 model: CONFIG.openaiModel,
 temperature: 0,
 max_tokens: 300,
 messages: [
 {
 role: 'system',
 content: buildSystemPrompt(availableCategories, corrections),
 },
 {
 role: 'user',
 content: getUserPrompt(request),
 },
 ],
 }),
 CONFIG.maxRetries,
 CONFIG.retryBaseDelayMs
 );

 const content = response.choices[0]?.message?.content?.trim();
 if (!content) {
 throw new Error('Empty response from OpenAI');
 }

 const jsonMatch = content.match(/\{[\s\S]*\}/);
 if (!jsonMatch) {
 throw new Error(`Non-JSON response from OpenAI: ${content.slice(0, 200)}`);
 }

 const parsed = parseJSONSafely<Record<string, unknown>>(jsonMatch[0]);

 return {
 categoryId: typeof parsed.categoryId === 'string' ? parsed.categoryId : '',
 categoryName: typeof parsed.categoryName === 'string' ? parsed.categoryName : 'Uncategorized',
 categorySlug: typeof parsed.categorySlug === 'string' ? parsed.categorySlug : '',
 categoryGroup: typeof parsed.categoryGroup === 'string' ? parsed.categoryGroup : 'other',
 confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
 gstRate: typeof parsed.gstRate === 'number' ? parsed.gstRate : null,
 hsnCode: typeof parsed.hsnCode === 'string' ? parsed.hsnCode : null,
 suggestedSubcategory: typeof parsed.suggestedSubcategory === 'string' ? parsed.suggestedSubcategory : null,
 reasoning: typeof parsed.reasoning === 'string' ? parsed.reasoning : 'AI classification',
 };
 } catch (error: unknown) {
 console.error('OpenAI categorization failed, using fallback:', error);
 if (!useHeuristicFallback) {
 throw new Error(
 `AI categorization failed: ${(error as Error).message}. Heuristic fallback disabled.`
 );
 }
 }
 }

 // Fallback to heuristics
 if (useHeuristicFallback) {
 return heuristicCategorize(request, availableCategories);
 }

 throw new Error('No categorization engine available. Configure OPENAI_API_KEY or enable heuristic fallback.');
}

export function recordCorrection(
 request: Pick<CategorizeRequest, 'description' | 'amount' | 'vendorName'>,
 correctedCategoryId: string,
 correctedCategoryName: string
): void {
 correctionStore.add({
 description: request.description,
 amount: request.amount,
 vendorName: request.vendorName,
 correctedCategoryId,
 correctedCategoryName,
 correctedAt: new Date(),
 });
 console.debug(`Categorizer: recorded correction for "${request.description}" → "${correctedCategoryName}"`);
}

export { DEFAULT_SYSTEM_CATEGORIES };
