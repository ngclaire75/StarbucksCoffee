import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    // Check custom email/password auth cookie first
    const cookieStore = cookies();
    const token = cookieStore.get('sb_auth')?.value;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        // Refresh full user data from DB
        const dbUser = await prisma.user.findUnique({ where: { id: payload.id } });
        if (dbUser) {
          return NextResponse.json({
            user: {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              firstName: dbUser.firstName,
              lastName: dbUser.lastName,
              phone: dbUser.phone,
            },
          });
        }
        return NextResponse.json({ user: payload });
      }
    }

    // Fall back to NextAuth session (Google sign-in)
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'starbucks-secret-change-me',
    });

    if (nextAuthToken?.email) {
      // Look up the full DB user so we have a stable id and phone
      const dbUser = await prisma.user.findUnique({ where: { email: nextAuthToken.email } });
      if (dbUser) {
        return NextResponse.json({
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            phone: dbUser.phone,
          },
        });
      }
      // Google user not in DB yet (edge case) – return minimal data
      return NextResponse.json({
        user: { id: nextAuthToken.sub, name: nextAuthToken.name, email: nextAuthToken.email },
      });
    }

    return NextResponse.json({ user: null }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
