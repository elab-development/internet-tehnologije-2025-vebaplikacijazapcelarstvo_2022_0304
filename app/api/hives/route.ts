import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';


/**
 * @swagger
 * /api/hives:
 *   get:
 *     summary: Preuzmi sve košnice trenutnog korisnika
 *     tags: [Košnice]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista košnica
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Kosnica'
 *       401:
 *         description: Nije autorizovan
 */

export async function GET(request: NextRequest) {
  try {

    const userId = parseInt(request.headers.get('x-user-id')!);

    // Učitaj košnice BEZ proizvodnjaMeda jer taj model ne postoji
    const kosnice = await prisma.kosnica.findMany({
      where: {
        korisnikId: userId,
      },
      include: {
        aktivnosti: true,
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
 * @swagger
 * /api/hives:
 *   post:
 *     summary: Kreiraj novu košnicu
 *     tags: [Košnice]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [naziv, brPcela, jacina, brRamova]
 *             properties:
 *               naziv:
 *                 type: string
 *               brPcela:
 *                 type: integer
 *               jacina:
 *                 type: string
 *                 enum: [SLABA, SREDNJA, JAKA]
 *               brRamova:
 *                 type: integer
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Košnica kreirana
 *       400:
 *         description: Nevalidni podaci
 */

export async function POST(request: NextRequest) {
  try {
    const userId = parseInt(request.headers.get('x-user-id')!);

    const body = await request.json();
    const { naziv, brPcela, jacina, brRamova, latitude, longitude } = body;

    if (!naziv || !brPcela || !jacina || !brRamova) {
      return NextResponse.json(
        { error: 'Svi podaci moraju biti uneti.' },
        { status: 400 }
      );
    }

    const validneJacine = ['SLABA', 'SREDNJA', 'JAKA'];
    if (!validneJacine.includes(jacina.toUpperCase())) {
      return NextResponse.json(
        { error: 'Jačina mora biti: SLABA, SREDNJA ili JAKA.' },
        { status: 400 }
      );
    }

    const novaKosnica = await prisma.kosnica.create({
      data: {
        naziv,
        brPcela: parseInt(brPcela),
        jacina: jacina.toUpperCase(),
        brRamova: parseInt(brRamova),
        korisnikId: userId,
        latitude: latitude ?? null, 
        longitude: longitude ?? null,
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