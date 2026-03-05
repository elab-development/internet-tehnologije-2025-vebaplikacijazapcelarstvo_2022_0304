import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * @swagger
 * /api/activities/{id}:
 *   get:
 *     summary: Preuzmi jednu aktivnost po ID-u
 *     tags: [Aktivnosti]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID aktivnosti
 *     responses:
 *       200:
 *         description: Aktivnost uspešno preuzeta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aktivnost uspešno preuzeta.
 *                 data:
 *                   $ref: '#/components/schemas/Aktivnost'
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
 * @swagger
 * /api/activities/{id}:
 *   put:
 *     summary: Izmeni postojeću aktivnost
 *     tags: [Aktivnosti]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID aktivnosti
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [naslov, tip, opis, datumPocetka]
 *             properties:
 *               naslov:
 *                 type: string
 *                 example: Pregled jesen
 *               tip:
 *                 type: string
 *                 example: PREGLED
 *               opis:
 *                 type: string
 *                 example: Jesenji pregled košnice
 *               datumPocetka:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-10T09:00:00Z
 *               izvrsena:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Aktivnost uspešno ažurirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aktivnost uspešno ažurirana
 *                 aktivnost:
 *                   $ref: '#/components/schemas/Aktivnost'
 *       400:
 *         description: Nevalidni podaci
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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
 * @swagger
 * /api/activities/{id}:
 *   delete:
 *     summary: Obriši aktivnost
 *     tags: [Aktivnosti]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID aktivnosti
 *     responses:
 *       200:
 *         description: Aktivnost uspešno obrisana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aktivnost uspešno obrisana
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
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