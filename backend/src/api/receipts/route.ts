import { Router } from 'express';
import { handleReceiptUpload } from '../../services/receipt-scanner.service';

const router = Router();

// POST /api/receipts/upload
router.post('/upload', handleReceiptUpload);

export default router;
