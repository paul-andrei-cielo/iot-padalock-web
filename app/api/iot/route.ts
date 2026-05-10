import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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

    console.log("DB STATE:", mongoose.connection.readyState);

    const body = await req.json();
    console.log("REQUEST:", body);

    const { code, lockerCode, status } = body;

    const locker = await Locker.findOne({ code: lockerCode });

    if (!locker) {
      console.log("LOCKER NOT FOUND");

      await Log.create({
        actor: "SYSTEM",
        action: "LOCKER_NOT_FOUND",
        success: false,
        timestamp: new Date(),
      });

      return NextResponse.json({ error: "Locker not found" }, { status: 404 });
    }

    // =========================
    // SENSOR
    // =========================
    if (status) {
      if (status === "PARCEL_REMOVED") {
        const result = await Parcel.updateMany(
          { lockerCode },
          {
            $set: {
              status: "RETRIEVED",
              retrievedDate: new Date(),
            },
          }
        );

        await Log.create({
          lockerId: locker._id,
          actor: "SENSOR",
          action: "PARCEL_REMOVED",
          success: true,
          timestamp: new Date(),
        });

        console.log("SENSOR UPDATED:", result.modifiedCount);
      }

      if (status === "PARCEL_DETECTED" && locker) {

        await Parcel.updateMany(
          {
            userId: locker.userId,
            status: "PENDING",
          },
          {
            $set: {
              status: "DELIVERED",
              deliveryDate: new Date(),
            },
          }
        );

        console.log("PARCEL MARKED AS DELIVERED");
      }

      return NextResponse.json({ ok: true });
    }

    // =========================
    // VALIDATION
    // =========================
    if (!code) {
      await Log.create({
        lockerId: locker._id,
        actor: "UNKNOWN",
        action: "MISSING_CODE",
        success: false,
        timestamp: new Date(),
      });

      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // =========================
    // OWNER
    // =========================
    const parcel = await Parcel.findOne({
      trackingNumber: code,
      status: "PENDING",
    });

    if (parcel) {
      return NextResponse.json({ mode: "DELIVERY" });
    }

      if (locker.pin === String(code)) {
      return NextResponse.json({ mode: "OWNER" });
    }

    // =========================
    // INVALID
    // =========================
    await Log.create({
      lockerId: locker._id,
      actor: "UNKNOWN",
      action: "INVALID_CODE",
      success: false,
      timestamp: new Date(),
    });

    console.log("INVALID INPUT");

    return NextResponse.json({ mode: "INVALID" });

  } catch (err: any) {
    console.error("IOT ERROR:", err);

    try {
      await Log.create({
        actor: "SYSTEM",
        action: "SERVER_ERROR",
        success: false,
        timestamp: new Date(),
      });
    } catch {}

    return NextResponse.json(
      { error: err.message || "server error" },
      { status: 500 }
    );
  }
}