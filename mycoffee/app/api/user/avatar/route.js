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

// PUT /api/user/avatar  { image: "<base64 data url>" | null }
export async function PUT(request) {
  try {
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { image } = await request.json();

    // Validate: must be a base64 data URL or null
    if (image !== null && image !== undefined) {
      if (!image.startsWith('data:image/')) {
        return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
      }
      // Rough size check: base64 of a 200x200 JPEG should be < 100KB
      if (image.length > 200000) {
        return NextResponse.json({ error: 'Image too large. Please use a smaller image.' }, { status: 400 });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { image: image || null },
      select: { id: true, image: true },
    });

    return NextResponse.json({ image: user.image });
  } catch {
    return NextResponse.json({ error: 'Failed to update avatar' }, { status: 500 });
  }
}
