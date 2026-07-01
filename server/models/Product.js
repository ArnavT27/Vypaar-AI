import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide product name'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide product category'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Please provide product price'],
            min: [0, 'Price cannot be negative'],
        },
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        minStock: {
            type: Number,
            required: [true, 'Please provide minimum stock level'],
            min: [0, 'Minimum stock cannot be negative'],
            default: 10,
        },
        unit: {
            type: String,
            required: [true, 'Please provide unit'],
            default: 'pcs',
        },
        emoji: {
            type: String,
            default: '📦',
        },
        description: {
            type: String,
            trim: true,
        },
        barcode: {
            type: String,
            trim: true,
        },
        supplier: {
            type: String,
            trim: true,
        },
        costPrice: {
            type: Number,
            min: [0, 'Cost price cannot be negative'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster searches
productSchema.index({ name: 'text', category: 'text' });
productSchema.index({ user: 1, isActive: 1 });

export default mongoose.model('Product_retail', productSchema);
