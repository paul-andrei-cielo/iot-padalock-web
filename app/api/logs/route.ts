import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Log from '@/models/Log';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = user.id || user.userId;

    const logs = await Log.find({
      $or: [
        { userId },        // user logs
        { actor: "iot" }   // ESP logs
      ]
    })
    .sort({ timestamp: -1 })
    .limit(50);

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}