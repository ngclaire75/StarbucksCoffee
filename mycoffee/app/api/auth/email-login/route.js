import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { sendSignInConfirmationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return NextResponse.json({ error: 'No account found with that email address.' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({
        error: 'This account was created using a different sign-in method. Please use the Join Now page to set up a password, or try a different email.',
      }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    // Send sign-in confirmation email (non-blocking)
    sendSignInConfirmationEmail({
      to: user.email,
      firstName: user.firstName || user.name.split(' ')[0],
    }).catch(console.error);

    const token = signToken({ id: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, firstName: user.firstName },
    });

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : undefined;

    response.cookies.set('sb_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      ...(maxAge ? { maxAge } : {}),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
