import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productId: String,
    name: {
        type: String,
        required: true,
    },
    emoji: String,
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    qty: {
        type: Number,
        required: true,
        min: 1,
    },
    total: {
        type: Number,
        required: true,
    },
});

const billSchema = new mongoose.Schema(
    {
        billNumber: {
            type: String,
            unique: true,
            sparse: true, // Allow null/undefined temporarily before pre-save hook runs
        },

        items: [billItemSchema],
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        gst: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        discount: {
            type: Number,
            min: 0,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
        },
        customerName: String,
        customerPhone: String,
        paymentMethod: {
            type: String,
            enum: ['cash', 'card', 'upi', 'online'],
            default: 'cash',
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'pending', 'partial'],
            default: 'paid',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

// Generate bill number before saving
billSchema.pre('save', async function (next) {
    if (!this.billNumber) {
        const year = new Date().getFullYear();
        const latestBill = await mongoose.model('Bill').findOne({ billNumber: new RegExp(`^BILL-${year}-`) }).sort({ billNumber: -1 });
        let nextCount = 1;
        if (latestBill && latestBill.billNumber) {
            const parts = latestBill.billNumber.split('-');
            if (parts.length === 3) {
                nextCount = parseInt(parts[2], 10) + 1;
            }
        }
        this.billNumber = `BILL-${year}-${String(nextCount).padStart(4, '0')}`;
    }
    next();
});

// Index for faster queries
billSchema.index({ user: 1, createdAt: -1 });

billSchema.index({ customer: 1 });

export default mongoose.model('Bill', billSchema);
