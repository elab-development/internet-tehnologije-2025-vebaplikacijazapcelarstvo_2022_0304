import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, hashPassword } from '@/lib/auth';



/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Ažuriraj profil prijavljenog korisnika
 *     tags: [Profil]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pol:
 *                 type: boolean
 *                 description: Pol korisnika
 *                 example: true
 *               trenutnaSifra:
 *                 type: string
 *                 description: Trenutna lozinka (obavezna ako se menja lozinka)
 *                 example: staraSifra123
 *               novaSifra:
 *                 type: string
 *                 minLength: 6
 *                 description: Nova lozinka
 *                 example: novaSifra456
 *     responses:
 *       200:
 *         description: Profil uspešno ažuriran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profil uspešno ažuriran.
 *                 data:
 *                   $ref: '#/components/schemas/KorisnikJavni'
 *       400:
 *         description: Nevalidni podaci (nema šta da se ažurira, pogrešna trenutna lozinka, kratka nova lozinka)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = parseInt(request.headers.get('x-user-id')!);
    const body = await request.json();
    const { pol, trenutnaSifra, novaSifra } = body;

    const korisnik = await prisma.korisnik.findUnique({
      where: { id: userId },
    });

    if (!korisnik) {
      return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 });
    }

    const updateData: { pol?: boolean; sifra?: string } = {};

    // Promena pola
    if (pol !== undefined) {
      updateData.pol = pol;
    }

    // Promena lozinke
    if (novaSifra) {
      if (!trenutnaSifra) {
        return NextResponse.json({ error: 'Trenutna lozinka je obavezna.' }, { status: 400 });
      }
      const validna = await comparePassword(trenutnaSifra, korisnik.sifra);
      if (!validna) {
        return NextResponse.json({ error: 'Trenutna lozinka nije ispravna.' }, { status: 400 });
      }
      if (novaSifra.length < 6) {
        return NextResponse.json({ error: 'Nova lozinka mora imati minimum 6 karaktera.' }, { status: 400 });
      }
      updateData.sifra = await hashPassword(novaSifra);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nema podataka za ažuriranje.' }, { status: 400 });
    }

    const azuriran = await prisma.korisnik.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, ime: true, email: true, pol: true, uloga: true },
    });

    return NextResponse.json({ message: 'Profil uspešno ažuriran.', data: azuriran });
  } catch (error) {
    console.error('Greška pri ažuriranju profila:', error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}