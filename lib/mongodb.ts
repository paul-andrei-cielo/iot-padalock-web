import mongoose, { mongo } from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;

    return mongoose.connect(MONGO_URI);
}