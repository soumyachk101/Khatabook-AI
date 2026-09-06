import { Router } from 'express';
import { handleCreateOrder } from '../../services/payment.service';

const router = Router();

router.post('/', handleCreateOrder);

export default router;
