import { connectDB } from "@/lib/mongodb";
import Parcel from "@/models/Parcel";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

// =========================
// GET PARCELS
// =========================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parcels = await Parcel.find({ userId: user.userId });

    return NextResponse.json(parcels);

  } catch (error: any) {
    console.error("GET PARCEL ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch parcels" },
      { status: 500 }
    );
  }
}

// =========================
// CREATE PARCEL
// =========================
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { trackingNumber, parcelName } = body;

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "Tracking number is required" },
        { status: 400 }
      );
    }

    const parcel = await Parcel.create({
      trackingNumber,
      parcelName: parcelName || "Parcel",
      userId: user.userId,
      status: "PENDING",
      deliveryDate: null,
      retrievedDate: null
    });

    return NextResponse.json(parcel);

  } catch (error: any) {
    console.error("CREATE PARCEL ERROR:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create parcel" },
      { status: 500 }
    );
  }
}