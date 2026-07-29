import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        encryptedPayload: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: false
        },
        category: {
            type: String,
            required: false
        },
        notes: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Expense', expenseSchema);