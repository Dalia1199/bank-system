import mongoose from "mongoose";

const revoketoken = new mongoose.Schema({
    tokenid: {
        type: String,
        required: true,
        trim: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },


    expiredat: {
        type: Date,
        required: true,

    },
}, {
    timestamps: true,
    strictQuery: true,

})
revoketokenschema.index({ expiredat: 1 }, { expireafterseconds: 0 })
const remodel = mongoose.models.revoketoken || mongoose.model("revoketoken", revoketokenschema);
export default remodel