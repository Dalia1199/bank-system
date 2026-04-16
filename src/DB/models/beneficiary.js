import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true,
            index: true
        },

        accountNumber: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        nickname: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

const BeneficiaryModel = mongoose.model("BeneficiaryModel", beneficiarySchema);
export default BeneficiaryModel;