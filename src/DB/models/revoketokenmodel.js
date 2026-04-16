import mongoose from "mongoose";

const revokeTokenSchema = new mongoose.Schema(
    {
        tokenId: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true,
            index: true
        },

        expiredAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

revokeTokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

const RevokeTokenModel = mongoose.model("RevokeTokenModel", revokeTokenSchema);
export default RevokeTokenModel;