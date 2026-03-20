// app/api/delivery/verify-otp/route.js
// POST { phone: "+12125551234", code: "123456" }
// Returns saved addresses for that phone on success

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required.' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[\s\-().]/g, '');

    const record = await prisma.verificationCode.findFirst({
      where: {
        phone: cleanPhone,
        code: String(code),
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 401 });
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Fetch saved addresses for this phone
    const addresses = await prisma.savedAddress.findMany({
      where: { phone: cleanPhone },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, addresses });
  } catch (err) {
    console.error('verify-otp error:', err);
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}