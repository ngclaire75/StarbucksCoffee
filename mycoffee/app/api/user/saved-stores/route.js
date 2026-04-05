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
    if (!userId) return NextResponse.json({ stores: [] });

    const stores = await prisma.savedStore.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ stores });
  } catch {
    return NextResponse.json({ stores: [] });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { placeId, name, address, lat, lng, storeData } = await request.json();
    if (!placeId || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const store = await prisma.savedStore.upsert({
      where: { userId_placeId: { userId, placeId } },
      update: { name, address, lat, lng, storeData },
      create: { userId, placeId, name, address: address || '', lat, lng, storeData: storeData || {} },
    });
    return NextResponse.json({ store });
  } catch {
    return NextResponse.json({ error: 'Failed to save store' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { placeId } = await request.json();
    await prisma.savedStore.deleteMany({ where: { userId, placeId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to remove store' }, { status: 500 });
  }
}
