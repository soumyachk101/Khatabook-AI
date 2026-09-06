import { Router } from 'express';
import { handleGetReceipt, handleListReceipts, handleUpdateReceipt, handleDeleteReceipt, handleRescanReceipt } from '../../services/receipt-scanner.service';

const router = Router();

router.get('/', handleListReceipts);
router.get('/:id', handleGetReceipt);
router.patch('/:id', handleUpdateReceipt);
router.delete('/:id', handleDeleteReceipt);
router.post('/:id/rescan', handleRescanReceipt);

export default router;
