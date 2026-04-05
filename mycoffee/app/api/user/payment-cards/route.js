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

    const { cardNumber, brand, expMonth, expYear, nameOnCard, securityCode } = await request.json();

    if (!cardNumber || !brand || !expMonth || !expYear || !nameOnCard) {
      return NextResponse.json({ error: 'All card fields are required' }, { status: 400 });
    }

    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length !== 16 || !/^\d{16}$/.test(digits)) {
      return NextResponse.json({ error: 'Card number must be 16 digits' }, { status: 400 });
    }

    if (securityCode && (securityCode.length !== 8 || !/^\d{8}$/.test(securityCode))) {
      return NextResponse.json({ error: 'Security code must be 8 digits' }, { status: 400 });
    }

    const last4 = digits.slice(-4);

    const card = await prisma.paymentCard.create({
      data: {
        userId,
        last4,
        brand,
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        nameOnCard,
        securityCode: securityCode || null,
      },
    });
    return NextResponse.json({ card });
  } catch {
    return NextResponse.json({ error: 'Failed to save card' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cardId, cardNumber, brand, expMonth, expYear, nameOnCard, securityCode } = await request.json();

    if (!cardId) return NextResponse.json({ error: 'Card ID required' }, { status: 400 });

    const existing = await prisma.paymentCard.findFirst({ where: { id: cardId, userId } });
    if (!existing) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    const data = {};
    if (brand) data.brand = brand;
    if (expMonth) data.expMonth = Number(expMonth);
    if (expYear) data.expYear = Number(expYear);
    if (nameOnCard) data.nameOnCard = nameOnCard;
    if (securityCode !== undefined) data.securityCode = securityCode || null;

    if (cardNumber) {
      const digits = cardNumber.replace(/\s/g, '');
      if (digits.length !== 16 || !/^\d{16}$/.test(digits)) {
        return NextResponse.json({ error: 'Card number must be 16 digits' }, { status: 400 });
      }
      data.last4 = digits.slice(-4);
    }

    const card = await prisma.paymentCard.update({
      where: { id: cardId },
      data,
    });
    return NextResponse.json({ card });
  } catch {
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
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
