import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    pin: String,
    lockerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locker"
    }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);