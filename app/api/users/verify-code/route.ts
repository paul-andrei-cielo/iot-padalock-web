import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = user.id || user.userId;
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    const dbUser = await User.findById(userId).select('pinVerificationCode pinVerificationCodeExpires');
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!dbUser.pinVerificationCodeExpires || dbUser.pinVerificationCodeExpires < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    if (dbUser.pinVerificationCode !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    await User.findByIdAndUpdate(userId, {
      pinVerificationCode: null,
      pinVerificationCodeExpires: null,
    });

    return NextResponse.json({ message: 'Code verified successfully' });
  } catch (error: any) {
    console.error('Error verifying PIN code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify code' }, 
      { status: 500 }
    );
  }
}