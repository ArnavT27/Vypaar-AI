import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    updateStock,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getProducts).post(createProduct);

router.get('/categories', getCategories);

router
    .route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

router.patch('/:id/stock', updateStock);

export default router;
