import { Router } from 'express';
import { handleExpenseSummary } from '../../services/expense.service';

const router = Router();

router.get('/summary', handleExpenseSummary);

export default router;
