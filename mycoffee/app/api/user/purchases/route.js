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

// GET /api/user/purchases
export async function GET(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const purchases = await prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ purchases });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

// POST /api/user/purchases  { items, storeName, storeAddress, total }
export async function POST(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items, storeName, storeAddress, total } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }
    if (typeof total !== 'number' || total < 0) {
      return NextResponse.json({ error: 'Invalid total' }, { status: 400 });
    }

    const purchase = await prisma.purchase.create({
      data: { userId, items, storeName: storeName || null, storeAddress: storeAddress || null, total },
    });

    return NextResponse.json({ purchase });
  } catch {
    return NextResponse.json({ error: 'Failed to save purchase' }, { status: 500 });
  }
}
