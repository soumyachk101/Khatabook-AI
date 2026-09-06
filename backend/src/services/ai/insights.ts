/**
 * AI Insights Service
 *
 * Generates spending insights, anomaly detection, and tax-saving suggestions
 * from the user's transaction history using OpenAI GPT-4o-mini.
 */

import { getOpenAIClient, withRetry } from './openai.service';
import type { SpendingInsight, TaxSavingSuggestion } from '@/types/ai';

const INSIGHT_MODEL = 'gpt-4o-mini';
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildInsightPrompt(data: {
 userId: string;
 period: { from: string; to: string };
 expenses: Array<{ date: string; category: string; amount: number; description: string }>;
 invoices: Array<{ date: string; clientName: string; total: number; status: string }>;
 receipts: Array<{ date: string; vendor: string | null; amount: number; category: string }>;
 prevPeriodTotal?: number;
 prevPeriodExpenses?: number;
}): string {
 const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0);
 const totalRevenue = data.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);

 const topCategories = data.expenses
 .filter((e) => e.amount > 0)
 .sort((a, b) => b.amount - a.amount)
 .slice(0, 5)
 .map((e) => `- ${e.category}: ₹${e.amount.toFixed(2)}`)
 .join('\n');

 const spendingSummary = `
 Period: ${data.from} to ${data.to}
 Total Revenue: ₹${totalRevenue.toFixed(2)}
 Total Expenses: ₹${totalExpenses.toFixed(2)}
 Net Profit: ₹${(totalRevenue - totalExpenses).toFixed(2)}
 Number of Expenses: ${data.expenses.length}
 Number of Invoices: ${data.invoices.length}
 Number of Receipts: ${data.receipts.length}

 Top Expense Categories:
 ${topCategories || 'None'}
`;

 return `You are a financial advisor for Indian small businesses and freelancers.
Analyze the following financial data and return actionable insights.

${spendingSummary}

Return a JSON object with:
{
 "summary": "One-line summary of financial health for this period",
 "insights": [
 {
 "id": "insight_1",
 "type": "trend" | "anomaly" | "suggestion" | "alert",
 "title": "Short title",
 "description": "Detailed explanation (1-2 sentences)",
 "category": "expense category name or general",
 "amount": number (the relevant monetary amount),
 "period": "monthly" | "quarterly" | "yearly",
 "priority": "low" | "medium" | "high",
 "actionable": true | false,
 "actionLabel": "optional action button text",
 "actionRoute": "optional route"
 }
 ],
 "topExpenseCategory": "category name with highest spend",
 "totalSavingsOpportunity": number (estimated monthly savings)
}

Guidelines:
- "trend" for spending patterns over time
- "anomaly" for unusual spikes or drops
- "suggestion" for recommended optimizations
- "alert" for immediate attention items (overspending, low cash flow)
- Provide 3-6 insights total.
- Keep descriptions concise and actionable.
- Use INR amounts without currency symbols.
- Respond ONLY with valid JSON.`;
}

function buildTaxSavingPrompt(data: {
 userId: string;
 financialYear: string;
 quarter: string;
 totalRevenue: number;
 totalExpenses: number;
 expensesByCategory: Record<string, number>;
 gstPaid: { cgst: number; sgst: number; igst: number };
 gstCollected: { cgst: number; sgst: number; igst: number };
 hasGSTIN: boolean;
 businessType: string;
}): string {
 const itcAvailable = data.gstPaid.cgst + data.gstPaid.sgst + data.gstPaid.igst;
 const gstPayable = Math.max(0, data.gstCollected.cgst + data.gstCollected.sgst + data.gstCollected.igst - itcAvailable);

 return `You are an Indian tax advisor specializing in GST and income tax for small businesses.
Analyze the following financial data and suggest legitimate tax-saving opportunities.

Financial Year: ${data.financialYear}
Quarter: ${data.quarter}
Business Type: ${data.businessType}
Has GSTIN: ${data.hasGSTIN}

Summary:
- Total Revenue: ₹${data.totalRevenue.toFixed(2)}
- Total Expenses: ₹${data.totalExpenses.toFixed(2)}
- Net Profit: ₹${(data.totalRevenue - data.totalExpenses).toFixed(2)}
- GST Collected (Output): ₹${(data.gstCollected.cgst + data.gstCollected.sgst + data.gstCollected.igst).toFixed(2)}
- GST Paid on Purchases (Input): ₹${itcAvailable.toFixed(2)}
- Estimated GST Payable: ₹${gstPayable.toFixed(2)}

Expenses by Category:
${Object.entries(data.expensesByCategory)
 .sort(([, a], [, b]) => b - a)
 .slice(0, 10)
 .map(([cat, amt]) => `- ${cat}: ₹${amt.toFixed(2)}`)
 .join('\n') || '- No expenses recorded'}

Return a JSON object with:
{
 "suggestions": [
 {
 "id": "tax_1",
 "title": "Specific action",
 "description": "Why this matters and how much it saves",
 "estimatedSaving": number,
 "section": "GST" | "Income Tax" | "Deduction" | "Compliance",
 "documents": ["doc1", "doc2"],
 "priority": "low" | "medium" | "high",
 "deadline": "optional ISO date or null"
 }
 ]
}

Rules:
- Only suggest LEGITIMATE, legal tax-saving measures under Indian tax law.
- Focus on: ITC optimization, Section 80 deductions (80C, 80D, 80G), presumptive taxation (44AD/ADA), TDS claims, GST composition scheme eligibility, expense documentation.
- Provide 3-5 suggestions.
- Estimated savings should be realistic (5-30% of taxable amount).
- Respond ONLY with valid JSON.`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateInsights(params: {
 userId: string;
 period: { from: string; to: string };
 expenses: Array<{ date: string; category: string; amount: number; description: string }>;
 invoices: Array<{ date: string; clientName: string; total: number; status: string }>;
 receipts: Array<{ date: string; vendor: string | null; amount: number; category: string }>;
 prevPeriodTotal?: number;
 prevPeriodExpenses?: number;
}): Promise<{ insights: SpendingInsight[]; summary: string; totalSavingsOpportunity: number }> {
 if (!process.env.OPENAI_API_KEY) {
 return fallbackInsights(params);
 }

 const client = getOpenAIClient();
 const prompt = buildInsightPrompt(params);

 try {
 const response = await withRetry(
 () =>
 client.chat.completions.create({
 model: INSIGHT_MODEL,
 temperature: 0.3,
 max_tokens: 1500,
 messages: [
 { role: 'system', content: 'You are a financial analytics assistant. Always return valid JSON.' },
 { role: 'user', content: prompt },
 ],
 }),
 MAX_RETRIES,
 RETRY_BASE_DELAY_MS
 );

 const content = response.choices[0]?.message?.content?.trim();
 if (!content) throw new Error('Empty response from AI');

 const jsonMatch = content.match(/\{[\s\S]*\}/);
 if (!jsonMatch) throw new Error('Non-JSON response from AI');

 const parsed = JSON.parse(jsonMatch[0]) as {
 summary: string;
 insights: Array<{
 id: string;
 type: SpendingInsight['type'];
 title: string;
 description: string;
 category: string;
 amount: number;
 period: string;
 priority: SpendingInsight['priority'];
 actionable: boolean;
 actionLabel?: string;
 actionRoute?: string;
 }>;
 topExpenseCategory: string;
 totalSavingsOpportunity: number;
 };

 return {
 insights: parsed.insights.map((i) => ({
 ...i,
 id: i.id || `insight_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
 })),
 summary: parsed.summary || 'No summary available',
 totalSavingsOpportunity: parsed.totalSavingsOpportunity || 0,
 };
 } catch (error: unknown) {
 console.error('AI insights generation failed:', error);
 return fallbackInsights(params);
 }
}

export async function generateTaxSuggestions(params: {
 userId: string;
 financialYear: string;
 quarter: string;
 totalRevenue: number;
 totalExpenses: number;
 expensesByCategory: Record<string, number>;
 gstPaid: { cgst: number; sgst: number; igst: number };
 gstCollected: { cgst: number; sgst: number; igst: number };
 hasGSTIN: boolean;
 businessType: string;
}): Promise<{ suggestions: TaxSavingSuggestion[] }> {
 if (!process.env.OPENAI_API_KEY) {
 return { suggestions: fallbackTaxSuggestions(params) };
 }

 const client = getOpenAIClient();
 const prompt = buildTaxSavingPrompt(params);

 try {
 const response = await withRetry(
 () =>
 client.chat.completions.create({
 model: INSIGHT_MODEL,
 temperature: 0.2,
 max_tokens: 1500,
 messages: [
 { role: 'system', content: 'You are a tax advisor. Always return valid JSON.' },
 { role: 'user', content: prompt },
 ],
 }),
 MAX_RETRIES,
 RETRY_BASE_DELAY_MS
 );

 const content = response.choices[0]?.message?.content?.trim();
 if (!content) throw new Error('Empty response from AI');

 const jsonMatch = content.match(/\{[\s\S]*\}/);
 if (!jsonMatch) throw new Error('Non-JSON response from AI');

 const parsed = JSON.parse(jsonMatch[0]) as {
 suggestions: Array<{
 id: string;
 title: string;
 description: string;
 estimatedSaving: number;
 section: string;
 documents?: string[];
 priority: 'low' | 'medium' | 'high';
 deadline?: string | null;
 }>;
 };

 return {
 suggestions: parsed.suggestions.map((s) => ({
 ...s,
 id: s.id || `tax_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
 })),
 };
 } catch (error: unknown) {
 console.error('AI tax suggestions failed:', error);
 return { suggestions: fallbackTaxSuggestions(params) };
 }
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

function fallbackInsights(_params: {
 userId: string;
 period: { from: string; to: string };
 expenses: Array<{ date: string; category: string; amount: number; description: string }>;
 invoices: Array<{ date: string; clientName: string; total: number; status: string }>;
 receipts: Array<{ date: string; vendor: string | null; amount: number; category: string }>;
 prevPeriodTotal?: number;
 prevPeriodExpenses?: number;
}): { insights: SpendingInsight[]; summary: string; totalSavingsOpportunity: number } {
 const totalExpenses = _params.expenses.reduce((s, e) => s + e.amount, 0);
 const totalRevenue = _params.invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);

 const insights: SpendingInsight[] = [];

 if (totalRevenue > 0 && totalExpenses > totalRevenue * 0.8) {
 insights.push({
 id: `insight_${Date.now()}_1`,
 type: 'alert',
 title: 'High expense ratio detected',
 description: `Expenses are ${Math.round((totalExpenses / totalRevenue) * 100)}% of revenue. Review recurring costs.`,
 category: 'general',
 amount: totalExpenses - totalRevenue * 0.6,
 period: _params.period.from.slice(0, 7),
 priority: 'high',
 actionable: true,
 actionLabel: 'Review expenses',
 actionRoute: '/dashboard/expenses',
 });
 }

 if (_params.prevPeriodExpenses && _params.prevPeriodExpenses > 0) {
 const change = ((totalExpenses - _params.prevPeriodExpenses) / _params.prevPeriodExpenses) * 100;
 if (Math.abs(change) > 20) {
 insights.push({
 id: `insight_${Date.now()}_2`,
 type: 'trend',
 title: change > 0 ? 'Spending increased' : 'Spending decreased',
 description: `Expenses ${change > 0 ? 'rose' : 'fell'} by ${Math.abs(change).toFixed(1)}% vs previous period.`,
 category: 'general',
 amount: Math.abs(change),
 period: _params.period.from.slice(0, 7),
 priority: change > 30 ? 'high' : 'medium',
 actionable: false,
 });
 }
 }

 if (insights.length === 0) {
 insights.push({
 id: `insight_${Date.now()}_3`,
 type: 'suggestion',
 title: 'Add more transactions for insights',
 description: 'Record more expenses and invoices to unlock AI-powered financial insights.',
 category: 'general',
 amount: 0,
 period: _params.period.from.slice(0, 7),
 priority: 'low',
 actionable: true,
 actionLabel: 'Add expense',
 actionRoute: '/expenses',
 });
 }
 const summary = `Revenue: ₹${totalRevenue.toFixed(0)} | Expenses: ₹${totalExpenses.toFixed(0)} | ${insights.length} insight(s)`;
 return { insights, summary, totalSavingsOpportunity: 0 };
}

function fallbackTaxSuggestions(params: {
 userId: string;
 financialYear: string;
 quarter: string;
 totalRevenue: number;
 totalExpenses: number;
 expensesByCategory: Record<string, number>;
 gstPaid: { cgst: number; sgst: number; igst: number };
 gstCollected: { cgst: number; sgst: number; igst: number };
 hasGSTIN: boolean;
 businessType: string;
}): TaxSavingSuggestion[] {
 const suggestions: TaxSavingSuggestion[] = [];

 if (!params.hasGSTIN && params.totalRevenue > 2000000) {
 suggestions.push({
 id: `tax_${Date.now()}_1`,
 title: 'Register for GST if turnover exceeds threshold',
 description: 'If annual turnover exceeds ₹20 lakh (₹40 lakh for goods), voluntary registration can help claim ITC on purchases.',
 estimatedSaving: params.totalExpenses * 0.18 * 0.5,
 section: 'GST',
 documents: ['PAN', 'Address proof', 'Business registration'],
 priority: 'high',
 });
 }

 const itcAvailable = params.gstPaid.cgst + params.gstPaid.sgst + params.gstPaid.igst;
 if (itcAvailable > 0) {
 suggestions.push({
 id: `tax_${Date.now()}_2`,
 title: 'Ensure full ITC claim on business purchases',
 description: `You have ₹${itcAvailable.toFixed(2)} in input GST paid. Ensure all vendor invoices have your GSTIN and are filed correctly.`,
 estimatedSaving: itcAvailable * 0.5,
 section: 'GST',
 documents: ['Vendor invoices with GSTIN', 'GSTR-2A/2B'],
 priority: 'high',
 });
 }

 if (params.totalRevenue > 0) {
 const profit = params.totalRevenue - params.totalExpenses;
 if (profit > 0) {
 suggestions.push({
 id: `tax_${Date.now()}_3`,
 title: 'Consider presumptive taxation under Section 44AD',
 description: 'If turnover is under ₹3 crore, presumptive taxation allows declaring 8-50% of turnover as income without maintaining full books.',
 estimatedSaving: profit * 0.15,
 section: 'Income Tax',
 documents: ['Audit report if required', 'Profit & Loss statement'],
 priority: 'medium',
 });
 }
 }

 return suggestions;
}
