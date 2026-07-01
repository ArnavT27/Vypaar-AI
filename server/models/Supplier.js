import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide supplier name'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['Wholesaler', 'Distributor', 'Manufacturer'],
            required: [true, 'Please provide supplier type'],
        },
        category: {
            type: String,
            required: [true, 'Please provide category'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'Please provide city'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Please provide address'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide phone number'],
            trim: true,
        },
        source: {
            type: String,
            required: [true, 'Please provide source'],
            trim: true,
        },
        pricingTerms: {
            type: String,
            default: 'Bulk pricing',
        },
        topProducts: {
            type: String,
            required: [true, 'Please provide top products'],
        },
        rating: {
            type: Number,
            default: 4.0,
            min: 0,
            max: 5,
        },
        verified: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
supplierSchema.index({ category: 1 });
supplierSchema.index({ city: 1 });
supplierSchema.index({ type: 1 });
supplierSchema.index({ name: 'text', topProducts: 'text' });

export default mongoose.model('Supplier', supplierSchema);
