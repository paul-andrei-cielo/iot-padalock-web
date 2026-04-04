import { connectDB } from "@/lib/mongodb";
import Parcel from "@/models/Parcel";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const user = getUserFromRequest(req);


        const parcels = await Parcel.find({ userId: user.userId });

        return NextResponse.json(parcels);
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = getUserFromRequest(req);
        const { trackingNumber, parcelName } = await req.json();

        const parcel = await Parcel.create({
            trackingNumber,
            parcelName: parcelName || "Parcel",
            userId: user.userId,
            status: "PENDING",
            deliveryDate: null,
            retrievedDate: null
        });

        return NextResponse.json(parcel);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create parcel"}, { status: 500 });
    }
}