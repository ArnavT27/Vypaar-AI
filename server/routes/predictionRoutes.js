import express from 'express';
import { generateStockPrediction } from '../controllers/predictionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stock', protect, generateStockPrediction);

export default router;
