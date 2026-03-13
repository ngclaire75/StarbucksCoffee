// app/api/delivery/save-address/route.js
// POST { phone, country, street, apt, city, state, zip }

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { phone, country, street, apt, city, state, zip } = await req.json();

    if (!phone || !street || !city || !zip) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[\s\-().]/g, '');
    const fullAddress = [street, apt, city, state, zip, country].filter(Boolean).join(', ');

    const saved = await prisma.savedAddress.create({
      data: { phone: cleanPhone, country, street, apt: apt || '', city, state, zip, fullAddress },
    });

    return NextResponse.json({ success: true, address: saved });
  } catch (err) {
    console.error('save-address error:', err);
    return NextResponse.json({ error: 'Failed to save address.' }, { status: 500 });
  }
}