import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * @swagger
 * /api/hives/{id}/comments:
 *   get:
 *     summary: Preuzmi sve komentare za košnicu
 *     tags: [Komentari]
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
 *         description: Lista komentara uspešno preuzeta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Komentari uspešno preuzeti.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Komentar'
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