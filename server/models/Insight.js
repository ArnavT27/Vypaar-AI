import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        detail: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['Urgent', 'Important', 'Opportunity'],
            required: true,
        },
        icon: {
            type: String,
            default: '💡',
        },
        category: {
            type: String,
            enum: ['stock', 'sales', 'customer', 'trend', 'prediction'],
            default: 'sales',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
insightSchema.index({ user: 1, isActive: 1, createdAt: -1 });

export default mongoose.model('Insight', insightSchema);
