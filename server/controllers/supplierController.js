import Supplier from '../models/Supplier.js';

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
export const getSuppliers = async (req, res, next) => {
    try {
        const { category, city, type, search } = req.query;

        let query = {};

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by city
        if (city && city !== 'All') {
            query.city = city;
        }

        // Filter by type
        if (type && type !== 'All') {
            query.type = type;
        }

        // Search by name or products
        if (search) {
            query.$text = { $search: search };
        }

        const suppliers = await Supplier.find(query).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: suppliers.length,
            data: suppliers,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Public
export const getSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found',
            });
        }

        res.status(200).json({
            success: true,
            data: supplier,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get unique categories
// @route   GET /api/suppliers/categories/list
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const categories = await Supplier.distinct('category');

        res.status(200).json({
            success: true,
            data: categories.sort(),
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get unique cities
// @route   GET /api/suppliers/cities/list
// @access  Public
export const getCities = async (req, res, next) => {
    try {
        const cities = await Supplier.distinct('city');

        res.status(200).json({
            success: true,
            data: cities.sort(),
        });
    } catch (error) {
        next(error);
    }
};
