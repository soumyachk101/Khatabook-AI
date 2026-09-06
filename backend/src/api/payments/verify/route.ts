import { Router } from 'express';
import { handleVerifyPayment } from '../../services/payment.service';

const router = Router();

router.post('/', handleVerifyPayment);

export default router;
