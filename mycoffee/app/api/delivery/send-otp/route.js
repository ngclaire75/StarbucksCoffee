// app/api/delivery/send-otp/route.js
// POST { phone: "+12125551234" }
// Generates a 6-digit OTP, saves it to DB, sends via SMS (Twilio)

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s\-().]/g, ''))) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    }

    // Clean to E.164-ish
    const cleanPhone = phone.replace(/[\s\-().]/g, '');

    // Generate 6-digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Invalidate any existing unused codes for this phone
    await prisma.verificationCode.updateMany({
      where: { phone: cleanPhone, used: false },
      data: { used: true },
    });

    // Save new code
    await prisma.verificationCode.create({
      data: { phone: cleanPhone, code, expiresAt },
    });

    // Send SMS via Twilio (set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER in .env)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = (await import('twilio')).default;
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your Starbucks delivery verification code is: ${code}. Valid for 10 minutes.`,
        from: process.env.TWILIO_FROM_NUMBER,
        to: cleanPhone,
      });
    } else {
      // Dev fallback — log code to console only
      console.log(`[DEV] OTP for ${cleanPhone}: ${code}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return NextResponse.json({ error: 'Failed to send code.' }, { status: 500 });
  }
}