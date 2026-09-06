/**
 * Khatabook AI — Receipt Scanner (Re-export)
 *
 * The canonical implementation lives in services/ai/receipt-scanner.ts.
 * This file preserves the existing import path for legacy callers.
 */

export {
 scanReceipt,
 preprocessImage,
 SCANNER_CONFIG,
 DEFAULT_CONFIG,
 type ScanReceiptOptions,
 type ScanReceiptResult,
 type PreprocessedImage,
} from './ai/receipt-scanner';
