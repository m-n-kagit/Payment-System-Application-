import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        default: "Direct Payment"
    },
    status: {
        type: String,
        default: "Completed"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const PaymentHistory = mongoose.model("PaymentHistory", paymentHistorySchema);
