// app/api/hives/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/hives/:id
 */
export async function GET(
  request: NextRequest,
  props : { params: { id: string } }
) {
  const params = await props.params;

  try {
    const userId = parseInt(request.headers.get('x-user-id')!);

    const kosnica = await prisma.kosnica.findFirst({
      where: {
        id: parseInt(params.id),
        korisnikId: userId,
      },
      include: {
        aktivnosti: {
          orderBy: { datumPocetka: 'desc' },
        },
        // proizvodnjaMeda: {  // OBRISANO - ne postoji u šemi
        //   orderBy: { datum: 'desc' },
        // },
      },
    });

    if (!kosnica) {
      return NextResponse.json(
        { error: 'Košnica nije pronađena.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Košnica uspešno preuzeta.',
      data: kosnica,
    });
  } catch (error) {
    console.error('Greška prilikom preuzimanja košnice:', error);
    return NextResponse.json(
      { error: 'Greška prilikom preuzimanja košnice.' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/hives/:id
 */
export async function PUT(
  request: NextRequest,
  props: { params: { id: string } }
) {
  const params = await props.params;

  try {
    const userId = parseInt(request.headers.get('x-user-id')!);

    const body = await request.json();
    const { naziv, brPcela, jacina, brRamova } = body;

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

    const azuriranaKosnica = await prisma.kosnica.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(naziv && { naziv }),
        ...(brPcela && { brPcela: parseInt(brPcela) }),
        ...(jacina && { jacina: jacina.toUpperCase() }),
        ...(brRamova && { brRamova: parseInt(brRamova) }),
      },
    });

    return NextResponse.json({
      message: 'Košnica uspešno ažurirana.',
      data: azuriranaKosnica,
    });
  } catch (error) {
    console.error('Greška prilikom ažuriranja košnice:', error);
    return NextResponse.json(
      { error: 'Greška prilikom ažuriranja košnice.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/hives/:id
 */
export async function DELETE(
  request: NextRequest,
  props: { params: { id: string } }
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

    await prisma.kosnica.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({
      message: 'Košnica uspešno obrisana.',
    });
  } catch (error) {
    console.error('Greška prilikom brisanja košnice:', error);
    return NextResponse.json(
      { error: 'Greška prilikom brisanja košnice.' },
      { status: 500 }
    );
  }
}