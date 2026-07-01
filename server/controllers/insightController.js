import Insight from '../models/Insight.js';
import Product from '../models/Product.js';
import Bill from '../models/Bill.js';

// @desc    Get all insights
// @route   GET /api/insights
// @access  Private
export const getInsights = async (req, res, next) => {
    try {
        const { category, priority, isRead } = req.query;

        let query = { user: req.user.id, isActive: true };

        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (isRead !== undefined) query.isRead = isRead === 'true';

        const insights = await Insight.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: insights.length,
            data: insights,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new insight
// @route   POST /api/insights
// @access  Private
export const createInsight = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const insight = await Insight.create(req.body);

        res.status(201).json({
            success: true,
            data: insight,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark insight as read
// @route   PATCH /api/insights/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const insight = await Insight.findById(req.params.id);

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: 'Insight not found',
            });
        }

        if (insight.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        insight.isRead = true;
        await insight.save();

        res.status(200).json({
            success: true,
            data: insight,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete insight
// @route   DELETE /api/insights/:id
// @access  Private
export const deleteInsight = async (req, res, next) => {
    try {
        const insight = await Insight.findById(req.params.id);

        if (!insight) {
            return res.status(404).json({
                success: false,
                message: 'Insight not found',
            });
        }

        if (insight.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized',
            });
        }

        insight.isActive = false;
        await insight.save();

        res.status(200).json({
            success: true,
            message: 'Insight deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate AI insights
// @route   POST /api/insights/generate
// @access  Private
export const generateInsights = async (req, res, next) => {
    try {
        const insights = [];

        // 1. Check for out of stock products
        const outOfStock = await Product.find({
            user: req.user.id,
            stock: 0,
            isActive: true,
        });

        for (const product of outOfStock) {
            insights.push({
                title: `${product.name} is out of stock`,
                detail: `${product.name} has zero stock. Restock immediately to avoid lost sales.`,
                priority: 'Urgent',
                icon: '⚠️',
                category: 'stock',
                user: req.user.id,
            });
        }

        // 2. Check for low stock products
        const lowStock = await Product.find({
            user: req.user.id,
            isActive: true,
            $expr: { $lt: ['$stock', '$minStock'] },
        }).limit(5);

        for (const product of lowStock) {
            insights.push({
                title: `Low stock alert: ${product.name}`,
                detail: `${product.name} has only ${product.stock} ${product.unit} left. Minimum required: ${product.minStock}. Consider reordering.`,
                priority: 'Important',
                icon: '📦',
                category: 'stock',
                user: req.user.id,
            });
        }

        // 3. Analyze top selling products
        const recentBills = await Bill.find({
            user: req.user.id,
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        });

        const productSales = {};
        recentBills.forEach((bill) => {
            bill.items.forEach((item) => {
                if (!productSales[item.name]) {
                    productSales[item.name] = { qty: 0, revenue: 0 };
                }
                productSales[item.name].qty += item.qty;
                productSales[item.name].revenue += item.total;
            });
        });

        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1].qty - a[1].qty)
            .slice(0, 3);

        if (topProducts.length > 0) {
            const [topProduct] = topProducts;
            insights.push({
                title: `${topProduct[0]} is trending`,
                detail: `${topProduct[0]} sold ${topProduct[1].qty} units in the last 30 days. Consider increasing stock buffer by 30%.`,
                priority: 'Opportunity',
                icon: '📈',
                category: 'trend',
                user: req.user.id,
            });
        }

        // 4. Sales trend analysis
        const todayBills = await Bill.find({
            user: req.user.id,
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        });

        const yesterdayBills = await Bill.find({
            user: req.user.id,
            createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
                $lt: new Date(new Date().setHours(0, 0, 0, 0)),
            },
        });

        const todaySales = todayBills.reduce((sum, bill) => sum + bill.total, 0);
        const yesterdaySales = yesterdayBills.reduce(
            (sum, bill) => sum + bill.total,
            0
        );

        if (yesterdaySales > 0) {
            const change = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
            if (change > 20) {
                insights.push({
                    title: 'Sales surge detected!',
                    detail: `Today's sales are ${change.toFixed(1)}% higher than yesterday. Great performance!`,
                    priority: 'Opportunity',
                    icon: '🎉',
                    category: 'sales',
                    user: req.user.id,
                });
            } else if (change < -20) {
                insights.push({
                    title: 'Sales decline noticed',
                    detail: `Today's sales are ${Math.abs(change).toFixed(1)}% lower than yesterday. Consider promotional activities.`,
                    priority: 'Important',
                    icon: '📉',
                    category: 'sales',
                    user: req.user.id,
                });
            }
        }

        // Save insights to database
        if (insights.length > 0) {
            await Insight.insertMany(insights);
        }

        res.status(200).json({
            success: true,
            count: insights.length,
            data: insights,
        });
    } catch (error) {
        next(error);
    }
};
