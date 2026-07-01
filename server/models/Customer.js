import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
    },
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Processing',
    },
    items: [
        {
            productId: String,
            name: String,
            emoji: String,
            qty: Number,
            price: Number,
        },
    ],
});

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide customer name'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['New', 'Regular', 'Premium', 'Occasional'],
            default: 'New',
        },
        address: {
            type: String,
            trim: true,
        },
        contact: {
            type: String,
            required: [true, 'Please provide contact number'],
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        totalOrders: {
            type: Number,
            default: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
        },
        lastOrderDate: {
            type: Date,
        },
        recentOrders: [orderSchema],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

// Index for faster searches
customerSchema.index({ name: 'text', contact: 'text' });
customerSchema.index({ user: 1, isActive: 1 });

export default mongoose.model('Customer', customerSchema);
