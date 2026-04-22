import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Log from "@/models/Log";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { status } = await req.json();

    await Log.create({
      actor: "iot",
      action: status,
      success: true,
      timestamp: new Date(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}