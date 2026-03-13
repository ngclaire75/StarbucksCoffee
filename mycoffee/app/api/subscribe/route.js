import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSubscriptionEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      return NextResponse.json({
        error: 'This email is not associated with any Starbucks account. Please create an account first.',
      }, { status: 404 });
    }

    // Send subscription confirmation (non-blocking)
    sendSubscriptionEmail({
      to: user.email,
      firstName: user.firstName || user.name.split(' ')[0],
    }).catch(console.error);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
