import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/activities/:id
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const userId = parseInt(request.headers.get('x-user-id')!);

    const aktivnost = await prisma.aktivnost.findFirst({
      where: {
        id: parseInt(params.id),
        korisnikId: userId,
      },
      include: {
        kosnica: true,
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
 * PUT /api/activities/[id]
 */
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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
 */
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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