import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },

        accountNumber: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        nickname: {
            type: String, 
        },
    },
    { timestamps: true }
);

export const BeneficiaryModel = mongoose.model(
    "BeneficiaryModel",
    beneficiarySchema
);