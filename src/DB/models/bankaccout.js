import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true,
            index: true
        },

        balance: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: ["active", "frozen"],
            default: "active"
        },

        currency: {
            type: String,
            default: "USD"
        },

        accountNumber: {
            type: String,
            required: true,
            unique: true,
            index: true
        }
    },
    { timestamps: true }
);

const AccountModel = mongoose.model("AccountModel", accountSchema);
export default AccountModel;