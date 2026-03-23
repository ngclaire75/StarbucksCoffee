import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  };

  // Clear custom email/password auth cookie
  response.cookies.set('sb_auth', '', cookieOptions);

  // Clear NextAuth session cookies (Google OAuth)
  response.cookies.set('next-auth.session-token', '', cookieOptions);
  response.cookies.set('__Secure-next-auth.session-token', '', cookieOptions);
  response.cookies.set('next-auth.callback-url', '', cookieOptions);
  response.cookies.set('next-auth.csrf-token', '', cookieOptions);

  return response;
}
