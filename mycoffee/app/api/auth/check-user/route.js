// app/api/auth/check-user/route.js
// GET /api/auth/check-user?googleId=xxx
// Returns { exists: true/false } without creating the user.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const googleId = searchParams.get('googleId');

  if (!googleId) {
    return NextResponse.json({ error: 'googleId is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { googleId } });
    return NextResponse.json({ exists: !!user });
  } catch (err) {
    console.error('check-user error:', err);
    return NextResponse.json({ error: 'Failed to check user.' }, { status: 500 });
  }
}
