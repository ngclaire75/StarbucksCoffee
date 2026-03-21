import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    // Check custom email/password auth cookie first
    const cookieStore = cookies();
    const token = cookieStore.get('sb_auth')?.value;

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        return NextResponse.json({ user: payload });
      }
    }

    // Fall back to NextAuth session (Google sign-in)
    const nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'starbucks-secret-change-me',
    });

    if (nextAuthToken?.name) {
      return NextResponse.json({
        user: { name: nextAuthToken.name, email: nextAuthToken.email },
      });
    }

    return NextResponse.json({ user: null }, { status: 200 });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
