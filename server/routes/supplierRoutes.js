import express from 'express';
import {
    getSuppliers,
    getSupplier,
    getCategories,
    getCities,
} from '../controllers/supplierController.js';

const router = express.Router();

router.get('/categories/list', getCategories);
router.get('/cities/list', getCities);
router.get('/', getSuppliers);
router.get('/:id', getSupplier);

export default router;
