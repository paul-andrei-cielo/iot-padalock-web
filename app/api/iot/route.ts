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

    const inputCode = String(code);

    // =========================
    // OWNER
    // =========================
    if (locker.pin === inputCode) {
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
        actor: "OWNER",
        action: "RETRIEVE",
        success: true,
        timestamp: new Date(),
      });

      console.log("OWNER UPDATED:", result.modifiedCount);

      return NextResponse.json({ mode: "OWNER" });
    }

    // =========================
    // RETRIEVE
    // =========================
    const retrieveParcel = await Parcel.findOne({
      trackingNumber: inputCode,
      status: "DELIVERED",
    });

    if (retrieveParcel) {
      retrieveParcel.status = "RETRIEVED";
      retrieveParcel.retrievedDate = new Date();
      await retrieveParcel.save();

      await Log.create({
        lockerId: locker._id,
        actor: "USER",
        action: "RETRIEVE",
        success: true,
        timestamp: new Date(),
      });

      console.log("RETRIEVED:", retrieveParcel.trackingNumber);

      return NextResponse.json({ mode: "RETRIEVAL" });
    }

    // =========================
    // DELIVERY
    // =========================
    const parcel = await Parcel.findOne({
      trackingNumber: inputCode,
      status: "PENDING",
    });

    if (parcel) {
      parcel.status = "DELIVERED";
      parcel.deliveryDate = new Date();
      parcel.set("lockerCode", lockerCode);

      await parcel.save();

      await Log.create({
        lockerId: locker._id,
        actor: "COURIER",
        action: "DELIVER",
        success: true,
        timestamp: new Date(),
      });

      console.log("DELIVERED:", parcel.trackingNumber);

      return NextResponse.json({ mode: "DELIVERY" });
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