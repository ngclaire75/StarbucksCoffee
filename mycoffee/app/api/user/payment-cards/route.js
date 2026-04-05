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
    if (!userId) return NextResponse.json({ cards: [] });

    const cards = await prisma.paymentCard.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ cards });
  } catch {
    return NextResponse.json({ cards: [] });
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { last4, brand, expMonth, expYear, nameOnCard } = await request.json();
    if (!last4 || !brand || !expMonth || !expYear || !nameOnCard) {
      return NextResponse.json({ error: 'All card fields are required' }, { status: 400 });
    }

    const card = await prisma.paymentCard.create({
      data: { userId, last4, brand, expMonth: Number(expMonth), expYear: Number(expYear), nameOnCard },
    });
    return NextResponse.json({ card });
  } catch {
    return NextResponse.json({ error: 'Failed to save card' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cardId } = await request.json();
    await prisma.paymentCard.deleteMany({ where: { id: cardId, userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to remove card' }, { status: 500 });
  }
}
