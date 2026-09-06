import { Router } from 'express';
import { handleCreatePaymentLink, handleVerifyPayment, handleListPayments, handleRefundPayment } from '../../services/payment.service';

const router = Router();

router.post('/links', handleCreatePaymentLink);
router.post('/verify', handleVerifyPayment);
router.get('/', handleListPayments);
router.post('/:id/refund', handleRefundPayment);

export default router;
