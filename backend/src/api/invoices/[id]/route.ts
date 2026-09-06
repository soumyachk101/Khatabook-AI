import { Router } from 'express';
import { handleCreateInvoice, handleListInvoices, handleGetInvoice, handleUpdateInvoice, handleDeleteInvoice } from '../../services/invoice.service';

const router = Router();

router.post('/', handleCreateInvoice);
router.get('/', handleListInvoices);
router.get('/:id', handleGetInvoice);
router.patch('/:id', handleUpdateInvoice);
router.delete('/:id', handleDeleteInvoice);

export default router;
