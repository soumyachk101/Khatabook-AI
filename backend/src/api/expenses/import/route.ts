import { Router } from 'express';
import { handleImportExpenses } from '../../services/expense.service';

const router = Router();

router.post('/import', handleImportExpenses);

export default router;
