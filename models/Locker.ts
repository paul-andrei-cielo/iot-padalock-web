import mongoose from "mongoose";

const LockerSchema = new mongoose.Schema({
    code: String
});

export default mongoose.models.Locker || mongoose.model("Locker", LockerSchema);