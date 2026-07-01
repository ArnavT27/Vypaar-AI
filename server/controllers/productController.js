import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res, next) => {
    try {
        const { category, search, lowStock } = req.query;

        let query = { user: req.user.id, isActive: true };

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search by name
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter low stock items
        if (lowStock === 'true') {
            query.$expr = { $lt: ['$stock', '$minStock'] };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Make sure user owns product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this product',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Make sure user owns product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this product',
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Make sure user owns product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this product',
            });
        }

        // Soft delete
        product.isActive = false;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Private
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category', {
            user: req.user.id,
            isActive: true,
        });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private
export const updateStock = async (req, res, next) => {
    try {
        const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Make sure user owns product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this product',
            });
        }

        if (operation === 'add') {
            product.stock += quantity;
        } else if (operation === 'subtract') {
            product.stock = Math.max(0, product.stock - quantity);
        }

        await product.save();

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};
