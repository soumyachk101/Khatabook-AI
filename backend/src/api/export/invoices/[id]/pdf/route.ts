import { Router } from 'express';
import { handleGetInvoicePDF } from '../../../../services/invoice.service';

const router = Router();

router.get('/pdf', handleGetInvoicePDF);

export default router;
