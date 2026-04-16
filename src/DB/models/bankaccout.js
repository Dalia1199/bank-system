import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },

        balance: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["active", "frozen"],
            default: "active",
        },
        currency: { type: String, default: "USD" },
        accountNumber: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

 const AccountModel = mongoose.model("AccountModel", accountSchema);
export default AccountModel;