import Expense from '../models/Expense.js';

// @desc    Get all expenses for the current user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
    try {
        const { category, search, startDate, endDate } = req.query;
        let query = { user: req.user.id };

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search in title
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        const expenses = await Expense.find(query).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        const expense = await Expense.create(req.body);

        res.status(201).json({
            success: true,
            data: expense,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found or unauthorized',
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
