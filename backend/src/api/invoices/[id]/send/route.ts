import { Router } from 'express';
import { handleSendInvoice } from '../../services/invoice.service';

const router = Router();

router.post('/send', handleSendInvoice);

export default router;
