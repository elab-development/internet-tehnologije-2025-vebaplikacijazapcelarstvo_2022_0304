import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/hives/:id/comments
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }

) {
  const params = await props.params;

  try {
    const userId = parseInt(request.headers.get('x-user-id')!);

    const kosnica = await prisma.kosnica.findFirst({
      where: {
        id: parseInt(params.id),
        korisnikId: userId,
      },
    });

    if (!kosnica) {
      return NextResponse.json(
        { error: 'Košnica nije pronađena.' },
        { status: 404 }
      );
    }

    const komentari = await prisma.komentar.findMany({
      where: {
        kosnicaId: parseInt(params.id),
      },
      include: {
        korisnik: {
          select: {
            ime: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      message: 'Komentari uspešno preuzeti.',
      data: komentari,
    });
  } catch (error) {
    console.error('Greška prilikom preuzimanja komentara:', error);
    return NextResponse.json(
      { error: 'Greška prilikom preuzimanja komentara.' },
      { status: 500 }
    );
  }
}