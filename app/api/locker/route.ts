import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';
import Locker from '@/models/Locker';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = new mongoose.Types.ObjectId(user.id || user.userId);

    const lockers = await Locker.find({ userId }).populate('userId');

    // 🔥 ADD THIS
    if (lockers.length > 0) {
      console.log("LOCKER CODE:", lockers[0].code);
    }

    return NextResponse.json(lockers);

  } catch (error: any) {
    console.error('Error fetching lockers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch lockers' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = new mongoose.Types.ObjectId(user.id || user.userId);

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'code is required' }, 
        { status: 400 }
      );
    }

    const existingLocker = await Locker.findOne({ userId });
    if (existingLocker) {
      return NextResponse.json(
        { error: 'User already has a locker' }, 
        { status: 400 }
      );
    }

    const locker = new Locker({
      userId,
      code,
      pin: "0000"
    });

    await locker.save();
    console.log("LOCKER CODE:", locker.code);
    return NextResponse.json(locker, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create locker' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = new mongoose.Types.ObjectId(user.id || user.userId); 

    const body = await request.json();
    const { id, pin, pinChanged } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Locker ID is required for updates' }, 
        { status: 400 }
      );
    }

    const updateData: any = { updatedAt: new Date() };
    
    if (pin !== undefined && pin !== null) {
      updateData.pin = pin;
      updateData.pinChanged = pinChanged !== undefined ? pinChanged : true;
    }

    const locker = await Locker.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!locker) {
      return NextResponse.json(
        { error: 'Locker not found or access denied' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(locker);
  } catch (error: any) {
    console.error('Error updating locker:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update locker' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = new mongoose.Types.ObjectId(user.id || user.userId);

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Locker ID is required' }, 
        { status: 400 }
      );
    }

    const locker = await Locker.findOneAndDelete({ 
      _id: id, 
      userId 
    });

    if (!locker) {
      return NextResponse.json(
        { error: 'Locker not found or access denied' }, 
        { status: 404 }
      );
    }

    await User.findByIdAndUpdate(userId, { 
      lockerId: null 
    });

    return NextResponse.json({ message: 'Locker deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting locker:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete locker' }, 
      { status: 500 }
    );
  }
}