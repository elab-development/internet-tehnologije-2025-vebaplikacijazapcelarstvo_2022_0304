import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/comments
 */
export async function POST(request: NextRequest) {
  try {

    const userId = parseInt(request.headers.get('x-user-id')!);

    const body = await request.json();
    const { sadrzaj, kosnicaId  } = body;

    if (!sadrzaj || !kosnicaId ) {
      return NextResponse.json(
        { error: 'Sadržaj i ID košnica su obavezni.' },
        { status: 400 }
      );
    }

    const kosnica = await prisma.kosnica.findFirst({
      where: {
        id: parseInt(kosnicaId),
        korisnikId: userId,
      },
    });

    if (!kosnica) {
      return NextResponse.json(
        { error: 'Košnica nije pronađena.' },
        { status: 404 }
      );
    }

    const noviKomentar = await prisma.komentar.create({
      data: {
        sadrzaj,
        korisnikId: userId,
        kosnicaId: parseInt(kosnicaId),
        jacinaKosnice: kosnica.jacina,
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