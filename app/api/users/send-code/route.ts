import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';
import { transporter } from '@/lib/mailer';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    const userId = user.id || user.userId;

    const dbUser = await User.findById(userId).select('email');
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    
    await User.findByIdAndUpdate(userId, {
      pinVerificationCode: code,
      pinVerificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    await transporter.sendMail({
      from: `"Padalock" <${process.env.EMAIL_USER}>`,
      to: dbUser.email,
      subject: "PadaLock PIN Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #de517e;">PIN Change Verification</h2>
          <p>Your verification code to change your PadaLock PIN is:</p>
          <div style="background: linear-gradient(135deg, #de517e, #e99ab1); color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 20px; border-radius: 16px; margin: 24px 0;">
            ${code}
          </div>
          <p style="color: #666;">This code expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Code sent successfully' });
  } catch (error: any) {
    console.error('Error sending PIN code:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send verification code' }, 
      { status: 500 }
    );
  }
}