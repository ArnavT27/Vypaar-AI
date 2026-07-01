import express from 'express';
import {
    getMyStore,
    createStore,
    updateStore,
    deleteStore,
    getStoreById,
} from '../controllers/storeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:id', getStoreById);

// Protected routes
router.use(protect);

router.route('/').get(getMyStore).post(createStore).put(updateStore).delete(deleteStore);

export default router;
