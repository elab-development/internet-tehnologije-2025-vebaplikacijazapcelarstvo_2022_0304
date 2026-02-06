import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/activities/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Niste autentifikovani.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Nevažeći token.' },
        { status: 401 }
      );
    }

    const aktivnost = await prisma.aktivnost.findFirst({
      where: {
        id: parseInt(params.id),
        korisnikId: decoded.userId,
      },
      include: {
        kosnica: true,
        komentari: {
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
        },
      },
    });

    if (!aktivnost) {
      return NextResponse.json(
        { error: 'Aktivnost nije pronađena.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Aktivnost uspešno preuzeta.',
      data: aktivnost,
    });
  } catch (error) {
    console.error('Greška prilikom preuzimanja aktivnosti:', error);
    return NextResponse.json(
      { error: 'Greška prilikom preuzimanja aktivnosti.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/activities/:id
 */
/**
 * PUT /api/activities/[id]
 * Ažurira aktivnost
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { naslov, tip, opis, datumPocetka, izvrsena } = body;

    if (!naslov || !tip || !opis || !datumPocetka) {
      return NextResponse.json(
        { error: 'Svi podaci su obavezni' },
        { status: 400 }
      );
    }

    const aktivnost = await prisma.aktivnost.update({
      where: { id: parseInt(params.id) },
      data: {
        naslov,
        tip,
        opis,
        datumPocetka: new Date(datumPocetka),
        izvrsena: izvrsena ?? false,
      },
    });

    return NextResponse.json({
      message: 'Aktivnost uspešno ažurirana',
      aktivnost,
    });
  } catch (error) {
    console.error('Greška:', error);
    return NextResponse.json(
      { error: 'Greška prilikom ažuriranja aktivnosti' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/activities/[id]
 * Briše aktivnost
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.aktivnost.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      message: 'Aktivnost uspešno obrisana',
    });
  } catch (error) {
    console.error('Greška:', error);
    return NextResponse.json(
      { error: 'Greška prilikom brisanja aktivnosti' },
      { status: 500 }
    );
  }
}