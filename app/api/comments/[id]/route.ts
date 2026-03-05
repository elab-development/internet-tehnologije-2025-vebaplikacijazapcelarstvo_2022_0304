import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';



/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Obriši komentar
 *     tags: [Komentari]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID komentara
 *     responses:
 *       200:
 *         description: Komentar uspešno obrisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Komentar uspešno obrisan.
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Komentar nije pronađen ili nemate dozvolu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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

    const komentar = await prisma.komentar.findFirst({
      where: {
        id: parseInt(params.id),
        korisnikId: userId,
      },
    });

    if (!komentar) {
      return NextResponse.json(
        { error: 'Komentar nije pronađen ili nemate dozvolu.' },
        { status: 404 }
      );
    }

    await prisma.komentar.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: 'Komentar uspešno obrisan.' });
  } catch (error) {
    console.error('Greška prilikom brisanja komentara:', error);
    return NextResponse.json(
      { error: 'Greška prilikom brisanja komentara.' },
      { status: 500 }
    );
  }
}