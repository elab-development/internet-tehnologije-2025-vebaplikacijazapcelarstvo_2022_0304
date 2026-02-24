import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const userId = parseInt(request.headers.get('x-user-id')!);
  const korisnik = await prisma.korisnik.findUnique({
    where: { id: userId },
    select: { id: true, ime: true, email: true },
  });
  return NextResponse.json({ data: korisnik });
}