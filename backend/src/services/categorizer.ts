/**
 * Khatabook AI — Expense Categorizer (Re-export)
 *
 * The canonical implementation lives in services/ai/categorizer.ts.
 * This file preserves the existing import path for legacy callers.
 */

export {
 categorizeExpense,
 recordCorrection,
 correctionStore,
 DEFAULT_SYSTEM_CATEGORIES,
 type CategorizeOptions,
} from './ai/categorizer';
