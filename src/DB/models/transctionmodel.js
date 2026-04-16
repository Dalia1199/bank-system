import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Types.ObjectId,
            ref: "Account",
            required: true,
        },

        type: {
            type: String,
            enum: ["deposit", "withdraw", "transfer"],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        balanceBefore: Number,
        balanceAfter: Number,

        toAccount: {
            type: mongoose.Types.ObjectId,
            ref: "Account",
        },
        status: {
            type: String, enum: ["pending", "completed", "failed"],default: "pending"}
    },
    { timestamps: true }
);

 const TransactionModel = mongoose.model(
    "TransactionModel",
    transactionSchema
);
export default TransactionModel;