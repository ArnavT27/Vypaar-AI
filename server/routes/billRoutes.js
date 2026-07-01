import express from 'express';
import {
    getBills,
    getBill,
    createBill,
    updateBill,
    deleteBill,
    getSalesStats,
} from '../controllers/billController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getBills).post(createBill);

router.get('/stats/sales', getSalesStats);

router.route('/:id').get(getBill).put(updateBill).delete(deleteBill);

export default router;
