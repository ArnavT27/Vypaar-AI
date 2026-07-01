import express from 'express';
import {
    getInsights,
    createInsight,
    markAsRead,
    deleteInsight,
    generateInsights,
} from '../controllers/insightController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getInsights).post(createInsight);

router.post('/generate', generateInsights);

router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteInsight);

export default router;
