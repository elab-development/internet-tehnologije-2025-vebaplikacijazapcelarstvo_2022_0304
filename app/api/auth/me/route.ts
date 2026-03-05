import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Preuzmi podatke o trenutno prijavljenom korisniku
 *     tags: [Autentifikacija]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Podaci o prijavljenom korisniku
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/KorisnikJavni'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
export async function GET(request: NextRequest) {
  const userId = parseInt(request.headers.get('x-user-id')!);
  const korisnik = await prisma.korisnik.findUnique({
    where: { id: userId },
    select: { id: true, ime: true, email: true, uloga: true },
  });
  return NextResponse.json({ data: korisnik });
}