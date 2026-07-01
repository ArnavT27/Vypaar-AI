import express from 'express';
import { generateInsights } from '../controllers/insightsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/generate', protect, generateInsights);

export default router;
