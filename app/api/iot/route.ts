import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Parcel from "@/models/Parcel";
import Locker from "@/models/Locker";
import Log from "@/models/Log";

export async function GET() {
  return NextResponse.json({ message: "iot route working" });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { code, lockerCode, status } = body;

    // =========================
    // LOG FROM ESP32
    // =========================
    if (status) {
  const locker = await Locker.findOne({ code: lockerCode });

  await Log.create({
    actor: "iot",
    action: status,
    success: true,
    userId: locker?.userId || null,
    lockerCode: lockerCode || null,
    timestamp: new Date(),
  });

      if (status === "PARCEL_REMOVED" && locker) {
        let result = await Parcel.updateMany(
          {
            userId: locker.userId,
            status: "DELIVERED",
          },
          {
            $set: {
              status: "RETRIEVED",
              retrievedDate: new Date(),
            },
          }
        );

        // fallback if not delivered yet
        if (result.modifiedCount === 0) {
          result = await Parcel.updateMany(
            {
              userId: locker.userId,
              status: "PENDING",
            },
            {
              $set: {
                status: "RETRIEVED",
                retrievedDate: new Date(),
              },
            }
          );
        }

        console.log("SENSOR UPDATED:", result.modifiedCount);
      }

      return NextResponse.json({ ok: true });
    }

    // =========================
    // VALIDATION
    // =========================
    if (!code || !lockerCode) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // =========================
    // DELIVERY
    // =========================
    const parcel = await Parcel.findOne({
      trackingNumber: code,
      status: "PENDING",
    });

    if (parcel) {
      parcel.status = "DELIVERED";
      parcel.deliveryDate = new Date();
      await parcel.save();

      return NextResponse.json({ mode: "DELIVERY" });
    }

    // =========================
    // OWNER
    // =========================
    const locker = await Locker.findOne({
      pin: code,
      code: lockerCode,
    });

    if (locker) {

      await Parcel.updateMany(
        {
          userId: locker.userId,
          status: "DELIVERED",
        },
        {
          $set: {
            status: "RETRIEVED",
            retrievedDate: new Date(),
          },
        }
      );

      console.log("ALL DELIVERED PARCELS MARKED AS RETRIEVED");

      return NextResponse.json({ mode: "OWNER" });
    }

    return NextResponse.json({ mode: "INVALID" });

  } catch (err: any) {
    console.error("IOT ERROR:", err);

    return NextResponse.json(
      { error: err.message || "server error" },
      { status: 500 }
    );
  }
}