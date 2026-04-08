import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Locker from '@/models/Locker';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = user.id || user.userId;

    const locker = await Locker.findOne({ userId });
    return NextResponse.json(locker || null);
  } catch (error: any) {
    console.error('Error fetching locker:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch locker' }, { status: 500 });
  }
}