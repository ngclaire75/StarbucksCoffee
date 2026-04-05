import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

function userShape(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    image: u.image || null,
  };
}

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('sb_auth')?.value;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        const dbUser = await prisma.user.findUnique({ where: { id: payload.id } });
        if (dbUser) return NextResponse.json({ user: userShape(dbUser) });
        return NextResponse.json({ user: payload });
      }
    }

    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'starbucks-secret-change-me',
    });

    if (nextAuthToken?.email) {
      const dbUser = await prisma.user.findUnique({ where: { email: nextAuthToken.email } });
      if (dbUser) return NextResponse.json({ user: userShape(dbUser) });
      return NextResponse.json({
        user: { id: nextAuthToken.sub, name: nextAuthToken.name, email: nextAuthToken.email, image: null },
      });
    }

    return NextResponse.json({ user: null }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
