import Store from '../models/Store.js';

// @desc    Get current user's store
// @route   GET /api/store
// @access  Private
export const getMyStore = async (req, res, next) => {
    try {
        const store = await Store.findOne({ owner: req.user.id }).populate(
            'owner',
            'name email'
        );

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found',
            });
        }

        res.status(200).json({
            success: true,
            data: store,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create store
// @route   POST /api/store
// @access  Private
export const createStore = async (req, res, next) => {
    try {
        // Check if store already exists for this user
        const existingStore = await Store.findOne({ owner: req.user.id });
        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: 'Store already exists for this user',
            });
        }

        // Add owner to request body
        req.body.owner = req.user.id;

        const store = await Store.create(req.body);

        res.status(201).json({
            success: true,
            data: store,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update store
// @route   PUT /api/store
// @access  Private
export const updateStore = async (req, res, next) => {
    try {
        let store = await Store.findOne({ owner: req.user.id });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found',
            });
        }

        // Don't allow updating owner
        delete req.body.owner;

        store = await Store.findOneAndUpdate({ owner: req.user.id }, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: store,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete store
// @route   DELETE /api/store
// @access  Private
export const deleteStore = async (req, res, next) => {
    try {
        const store = await Store.findOne({ owner: req.user.id });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found',
            });
        }

        await store.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Store deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get store by ID (public)
// @route   GET /api/store/:id
// @access  Public
export const getStoreById = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.id).populate(
            'owner',
            'name email'
        );

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found',
            });
        }

        if (!store.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Store is not active',
            });
        }

        res.status(200).json({
            success: true,
            data: store,
        });
    } catch (error) {
        next(error);
    }
};
