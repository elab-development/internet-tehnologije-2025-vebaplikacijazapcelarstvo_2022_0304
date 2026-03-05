// app/api/hives/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


/**
 * @swagger
 * /api/hives/{id}:
 *   get:
 *     summary: Preuzmi jednu košnicu po ID-u
 *     tags: [Košnice]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID košnice
 *     responses:
 *       200:
 *         description: Košnica uspešno preuzeta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Košnica uspešno preuzeta.
 *                 data:
 *                   $ref: '#/components/schemas/KosnicaDetalji'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 * @swagger
 * /api/hives/{id}:
 *   put:
 *     summary: Izmeni postojeću košnicu
 *     tags: [Košnice]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID košnice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naziv:
 *                 type: string
 *                 example: Košnica Beta
 *               brPcela:
 *                 type: integer
 *                 example: 6000
 *               jacina:
 *                 type: string
 *                 enum: [SLABA, SREDNJA, JAKA]
 *               brRamova:
 *                 type: integer
 *                 example: 12
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Košnica uspešno ažurirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Košnica uspešno ažurirana.
 *                 data:
 *                   $ref: '#/components/schemas/Kosnica'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    const userId = parseInt(request.headers.get('x-user-id')!);

    const body = await request.json();
    const { naziv, brPcela, jacina, brRamova, latitude, longitude } = body;

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
        ...(latitude !== undefined && { latitude }), 
        ...(longitude !== undefined && { longitude }),
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
 * @swagger
 * /api/hives/{id}:
 *   delete:
 *     summary: Obriši košnicu
 *     tags: [Košnice]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID košnice
 *     responses:
 *       200:
 *         description: Košnica uspešno obrisana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Košnica uspešno obrisana.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function DELETE(
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