import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * POST /api/comments
 */
export async function POST(request: NextRequest) {
  try {

    const userId = parseInt(request.headers.get('x-user-id')!);

    const body = await request.json();
    const { sadrzaj, aktivnostId } = body;

    if (!sadrzaj || !aktivnostId) {
      return NextResponse.json(
        { error: 'Sadržaj i ID aktivnosti su obavezni.' },
        { status: 400 }
      );
    }

    const aktivnost = await prisma.aktivnost.findUnique({
      where: { id: parseInt(aktivnostId) },
    });

    if (!aktivnost) {
      return NextResponse.json(
        { error: 'Aktivnost nije pronađena.' },
        { status: 404 }
      );
    }

    const noviKomentar = await prisma.komentar.create({
      data: {
        sadrzaj,
        korisnikId: userId,
        aktivnostId: parseInt(aktivnostId),
      },
      include: {
        korisnik: {
          select: {
            ime: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Komentar uspešno dodat.',
        data: noviKomentar,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Greška prilikom dodavanja komentara:', error);
    return NextResponse.json(
      { error: 'Greška prilikom dodavanja komentara.' },
      { status: 500 }
    );
  }
}