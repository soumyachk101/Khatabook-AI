import { Router } from 'express';
import { handleRazorpayWebhook } from '../../services/payment.service';

const router = Router();

router.post('/', handleRazorpayWebhook);

export default router;
