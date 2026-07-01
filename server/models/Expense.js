import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide expense title'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Please provide expense amount'],
            min: [0, 'Expense amount cannot be negative'],
        },
        category: {
            type: String,
            required: [true, 'Please provide expense category'],
            enum: ['Rent', 'Utilities', 'Salary', 'Inventory Purchase', 'Marketing', 'Others'],
            default: 'Others',
        },
        paymentMethod: {
            type: String,
            required: [true, 'Please provide payment method'],
            enum: ['Cash', 'UPI', 'Card', 'Bank Transfer'],
            default: 'UPI',
        },
        date: {
            type: Date,
            default: Date.now,
        },
        description: {
            type: String,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

export default mongoose.model('Expense', expenseSchema);
