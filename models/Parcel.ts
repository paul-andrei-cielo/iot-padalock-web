import mongoose from "mongoose";

const ParcelSchema = new mongoose.Schema({
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },
    ownerPin: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    parcelName: {
        type: String,
        default: "Parcel"
    },
    lockerCode: {
        type: String,
        required: false,
        index: true
    },

    status: {
        type: String,
        enum: ["PENDING", "DELIVERED", "RETRIEVED"],
        default: "PENDING"
    },
    deliveryDate: {
        type: Date,
        default: null
    },
    retrievedDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.models.Parcel || mongoose.model("Parcel", ParcelSchema);