import { Router } from 'express';
import { handleRescanReceipt } from '../../services/receipt-scanner.service';

const router = Router();

router.post('/rescan', handleRescanReceipt);

export default router;
