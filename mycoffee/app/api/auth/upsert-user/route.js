// app/api/auth/upsert-user/route.js
// POST { googleId, email, name, image }
// Creates or updates the Google-authenticated user in the database.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { googleId, email, name, image } = await req.json();

    if (!googleId || !email || !name) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where:  { googleId },
      update: { email, name, image: image || null },
      create: { googleId, email, name, image: image || null },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('upsert-user error:', err);
    return NextResponse.json({ error: 'Failed to save user.' }, { status: 500 });
  }
}
