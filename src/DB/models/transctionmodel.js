import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AccountModel",
            required: false,
            index: true
        },

        type: {
            type: String,
            enum: ["deposit", "withdraw", "transfer"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 1
        },

        balanceBefore: {
            type: Number,
            required: false
        },

        balanceAfter: {
            type: Number,
            required: false
        },

        toAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AccountModel"
        },

        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed"
        }
    },
    { timestamps: true }
);

transactionSchema.index({ accountId: 1, createdAt: -1 });

const TransactionModel = mongoose.model("TransactionModel", transactionSchema);
export default TransactionModel;