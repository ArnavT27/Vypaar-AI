import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        storeName: {
            type: String,
            required: [true, 'Please provide a store name'],
            trim: true,
            maxlength: [100, 'Store name cannot be more than 100 characters'],
        },
        storeAddress: {
            type: String,
            required: [true, 'Please provide a store address'],
            trim: true,
            maxlength: [500, 'Store address cannot be more than 500 characters'],
        },
        gstNumber: {
            type: String,
            required: [true, 'Please provide a GST number'],
            trim: true,
            uppercase: true,
            unique: true,
            match: [
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                'Please provide a valid GST number',
            ],
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        pincode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
            default: 'India',
        },
        logo: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        businessType: {
            type: String,
            enum: ['Retail', 'Wholesale', 'Both'],
            default: 'Retail',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        upiId: {
            type: String,
            trim: true,
            maxlength: [100, 'UPI ID cannot be more than 100 characters'],
        },
        settings: {
            currency: {
                type: String,
                default: 'INR',
            },
            timezone: {
                type: String,
                default: 'Asia/Kolkata',
            },
            taxRate: {
                type: Number,
                default: 18,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
storeSchema.index({ owner: 1 });
storeSchema.index({ gstNumber: 1 });

export default mongoose.model('Store', storeSchema);
