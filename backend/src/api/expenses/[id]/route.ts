import { Router } from 'express';
import { handleCreateExpense, handleListExpenses, handleGetExpense, handleUpdateExpense, handleDeleteExpense } from '../../services/expense.service';

const router = Router();

router.post('/', handleCreateExpense);
router.get('/', handleListExpenses);
router.get('/:id', handleGetExpense);
router.patch('/:id', handleUpdateExpense);
router.delete('/:id', handleDeleteExpense);

export default router;
