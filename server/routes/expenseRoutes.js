import express from 'express';
import {
    getExpenses,
    createExpense,
    deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
    .get(getExpenses)
    .post(createExpense);

router.route('/:id')
    .delete(deleteExpense);

export default router;
