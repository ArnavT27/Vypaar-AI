import express from 'express';
import { generateTrending } from '../controllers/trendingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/generate', protect, generateTrending);

export default router;
