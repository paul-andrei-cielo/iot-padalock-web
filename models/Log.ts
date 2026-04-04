import mongoose, { mongo } from "mongoose";

const LogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    lockerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locker"
    },
    actor: String,
    action: String,
    success: Boolean,
    timestamp: Date
});

export default mongoose.models.Log || mongoose.model("Log", LogSchema);