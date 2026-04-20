import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const decoded: any = getUserFromRequest(req);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: user.toObject() });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const decoded: any = getUserFromRequest(req);

    const { firstName, lastName } = await req.json();

    if (!firstName || firstName.trim() === "" || !lastName || lastName.trim() === "") {
      return NextResponse.json(
        { error: "First name and last name are required" }, 
        { status: 400 }
      );
    }

    const updateData: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password: _, ...userResponse } = updatedUser.toObject();

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: userResponse 
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const decoded: any = getUserFromRequest(req);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isDeleted) {
      return NextResponse.json({ error: "Account already deleted" }, { status: 400 });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();

    await user.save();

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}