import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

async function getUserId(request) {
  const cookieStore = cookies();
  const token = cookieStore.get('sb_auth')?.value;
  if (token) {
    const payload = verifyToken(token);
    if (payload?.id) return payload.id;
  }
  const nextAuthToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'starbucks-secret-change-me',
  });
  if (nextAuthToken?.email) {
    const user = await prisma.user.findUnique({ where: { email: nextAuthToken.email } });
    return user?.id || null;
  }
  return null;
}

export async function GET(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, firstName: true, lastName: true, phone: true, image: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { firstName, lastName, phone, email } = await request.json();
    const data = {};
    if (firstName !== undefined) { data.firstName = firstName; data.name = `${firstName} ${lastName || ''}`.trim(); }
    if (lastName !== undefined) { data.lastName = lastName; data.name = `${firstName || ''} ${lastName}`.trim(); }
    if (phone !== undefined) data.phone = phone;
    if (email !== undefined) {
      const existing = await prisma.user.findFirst({ where: { email, NOT: { id: userId } } });
      if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      data.email = email;
    }

    // Recalculate name if both first+last provided
    if (firstName !== undefined && lastName !== undefined) {
      data.name = `${firstName} ${lastName}`.trim();
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, firstName: true, lastName: true, phone: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
