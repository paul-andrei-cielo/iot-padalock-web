import mongoose from "mongoose";

const LockerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    code: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true,
        default: "0000"
    },
    pinChanged: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.models.Locker || mongoose.model("Locker", LockerSchema);