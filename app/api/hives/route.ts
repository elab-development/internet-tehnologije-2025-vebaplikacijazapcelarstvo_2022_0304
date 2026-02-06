import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * GET /api/hives
 * Preuzmi sve košnice trenutnog korisnika
 */
export async function GET(request: NextRequest) {
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

    const kosnice = await prisma.kosnica.findMany({
      where: {
        korisnikId: decoded.userId,
      },
      include: {
        aktivnosti: true,
        proizvodnjaMeda: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      message: 'Košnice uspešno preuzete.',
      data: kosnice,
    });
  } catch (error) {
    console.error('Greška prilikom preuzimanja košnica:', error);
    return NextResponse.json(
      { error: 'Greška prilikom preuzimanja košnica.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/hives
 * Kreiranje nove košnice
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { naziv, brPcela, jacina, brRamova } = body;

    if (!naziv || !brPcela || !jacina || !brRamova) {
      return NextResponse.json(
        { error: 'Svi podaci moraju biti uneti.' },
        { status: 400 }
      );
    }

    const validneJacine = ['SLABA', 'SREDNJA', 'JAKA'];
    if (!validneJacine.includes(jacina)) {
      return NextResponse.json(
        { error: 'Jačina mora biti: SLABA, SREDNJA ili JAKA.' },
        { status: 400 }
      );
    }

    const novaKosnica = await prisma.kosnica.create({
      data: {
        naziv,
        brPcela: parseInt(brPcela),
        jacina,
        brRamova: parseInt(brRamova),
        korisnikId: decoded.userId,
      },
    });

    return NextResponse.json(
      {
        message: 'Košnica uspešno kreirana.',
        data: novaKosnica,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Greška prilikom kreiranja košnice:', error);
    return NextResponse.json(
      { error: 'Greška prilikom kreiranja košnice.' },
      { status: 500 }
    );
  }
}