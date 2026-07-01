import Customer from '../models/Customer.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res, next) => {
    try {
        const { search, type } = req.query;

        let query = { user: req.user.id, isActive: true };

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Search by name or contact
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { contact: { $regex: search, $options: 'i' } },
            ];
        }

        const customers = await Customer.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        // Make sure user owns customer
        if (customer.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this customer',
            });
        }

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const customer = await Customer.create(req.body);

        res.status(201).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res, next) => {
    try {
        let customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        // Make sure user owns customer
        if (customer.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this customer',
            });
        }

        customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        // Make sure user owns customer
        if (customer.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this customer',
            });
        }

        // Soft delete
        customer.isActive = false;
        await customer.save();

        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add order to customer
// @route   POST /api/customers/:id/orders
// @access  Private
export const addOrder = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        // Make sure user owns customer
        if (customer.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this customer',
            });
        }

        const { orderId, amount, status, items, bill } = req.body;

        customer.recentOrders.unshift({
            orderId,
            bill,
            amount,
            status: status || 'Processing',
            items,
            date: new Date(),
        });

        // Keep only last 10 orders
        if (customer.recentOrders.length > 10) {
            customer.recentOrders = customer.recentOrders.slice(0, 10);
        }

        customer.totalOrders += 1;
        customer.totalSpent += amount;
        customer.lastOrderDate = new Date();

        // Update customer type based on orders
        if (customer.totalOrders >= 50) {
            customer.type = 'Premium';
        } else if (customer.totalOrders >= 10) {
            customer.type = 'Regular';
        } else if (customer.totalOrders >= 3) {
            customer.type = 'Occasional';
        }

        await customer.save();

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PATCH /api/customers/:id/orders/:orderId
// @access  Private
export const updateOrderStatus = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        // Make sure user owns customer
        if (customer.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this customer',
            });
        }

        const order = customer.recentOrders.find(
            (o) => o.orderId === req.params.orderId
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = req.body.status;
        await customer.save();

        res.status(200).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};
