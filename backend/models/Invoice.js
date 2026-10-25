import mongoose from 'mongoose';
const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    },
);
const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;