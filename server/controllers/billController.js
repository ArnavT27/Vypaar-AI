import Bill from '../models/Bill.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
export const getBills = async (req, res, next) => {
    try {
        const { startDate, endDate, customer, paymentStatus } = req.query;

        let query = { user: req.user.id };

        // Filter by date range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Filter by customer
        if (customer) {
            query.customer = customer;
        }

        // Filter by payment status
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        const bills = await Bill.find(query)
            .populate('customer', 'name contact')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bills.length,
            data: bills,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
export const getBill = async (req, res, next) => {
    try {
        const bill = await Bill.findById(req.params.id)
            .populate('customer', 'name contact address')
            .populate('items.product', 'name category');

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found',
            });
        }

        // Make sure user owns bill
        if (bill.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this bill',
            });
        }

        res.status(200).json({
            success: true,
            data: bill,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new bill
// @route   POST /api/bills
// @access  Private
export const createBill = async (req, res, next) => {
    try {
        const { items, discount, customer, customerName, customerPhone, paymentMethod, paymentStatus, notes } =
            req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please add at least one item',
            });
        }

        // Calculate totals and update stock
        let subtotal = 0;
        const billItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.product}`,
                });
            }

            // Check stock availability
            if (product.stock < item.qty) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
                });
            }

            const itemTotal = product.price * item.qty;
            subtotal += itemTotal;

            billItems.push({
                product: product._id,
                productId: product._id.toString(),
                name: product.name,
                emoji: product.emoji,
                price: product.price,
                qty: item.qty,
                total: itemTotal,
            });

            // Update product stock
            product.stock -= item.qty;
            await product.save();
        }

        const gst = subtotal * 0.05; // 5% GST
        const total = subtotal + gst - (discount || 0);

        // Always stamp the bill with the exact server time at the moment of creation.
        // Never rely on a date string from the client, which can only carry a calendar
        // date (YYYY-MM-DD) and gets parsed as UTC midnight by the JS Date constructor.
        const bill = await Bill.create({
            items: billItems,
            subtotal,
            gst,
            discount: discount || 0,
            total,
            customer,
            customerName,
            customerPhone,
            paymentMethod: paymentMethod || 'cash',
            paymentStatus: paymentStatus || 'paid',
            notes,
            user: req.user.id,
        });

        // Update customer if provided
        if (customer) {
            const customerDoc = await Customer.findById(customer);
            if (customerDoc) {
                customerDoc.totalOrders += 1;
                customerDoc.totalSpent += total;
                customerDoc.lastOrderDate = new Date();
                await customerDoc.save();
            }
        }

        res.status(201).json({
            success: true,
            data: bill,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private
export const updateBill = async (req, res, next) => {
    try {
        let bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found',
            });
        }

        // Make sure user owns bill
        if (bill.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,

                message: 'Not authorized to update this bill',
            });
        }

        // Strip immutable fields so a PUT request can never overwrite the
        // original creation timestamp or Mongoose's own createdAt.
        const { billDate: _bd, createdAt: _ca, ...updatePayload } = req.body;

        bill = await Bill.findByIdAndUpdate(req.params.id, updatePayload, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: bill,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private
export const deleteBill = async (req, res, next) => {
    try {
        const bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found',
            });
        }

        // Make sure user owns bill
        if (bill.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this bill',
            });
        }

        await bill.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Bill deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sales statistics
// @route   GET /api/bills/stats/sales
// @access  Private
export const getSalesStats = async (req, res, next) => {
    try {
        const { period = '7d' } = req.query;

        let startDate = new Date();
        if (period === '7d') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === '30d') {
            startDate.setDate(startDate.getDate() - 30);
        } else if (period === '1y') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        const bills = await Bill.find({
            user: req.user.id,
            createdAt: { $gte: startDate },
        });

        const totalSales = bills.reduce((sum, bill) => sum + bill.total, 0);
        const totalBills = bills.length;
        const averageOrderValue = totalBills > 0 ? totalSales / totalBills : 0;

        // Group by date
        const salesByDate = {};
        bills.forEach((bill) => {
            const date = bill.createdAt.toISOString().split('T')[0];
            if (!salesByDate[date]) {
                salesByDate[date] = { sales: 0, count: 0 };
            }
            salesByDate[date].sales += bill.total;
            salesByDate[date].count += 1;
        });

        res.status(200).json({
            success: true,
            data: {
                totalSales,
                totalBills,
                averageOrderValue,
                salesByDate,
            },
        });
    } catch (error) {
        next(error);
    }
};
