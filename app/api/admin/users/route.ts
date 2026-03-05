import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

function requireAdmin(request: NextRequest) {
  const uloga = request.headers.get('x-user-role');
  const userId = request.headers.get('x-user-id');
  if (!userId || uloga !== 'ADMIN') return null;
  return { userId: parseInt(userId), uloga };
}


/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Preuzmi listu svih korisnika (samo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista svih korisnika sa brojem košnica i aktivnosti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       ime:
 *                         type: string
 *                         example: Marko Marković
 *                       email:
 *                         type: string
 *                         example: marko@example.com
 *                       uloga:
 *                         type: string
 *                         enum: [KORISNIK, MENADZER, ADMIN]
 *                       pol:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       _count:
 *                         type: object
 *                         properties:
 *                           kosnice:
 *                             type: integer
 *                             example: 3
 *                           aktivnosti:
 *                             type: integer
 *                             example: 12
 *       403:
 *         description: Nemate dozvolu (nije ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Nemate dozvolu za ovu akciju.' }, { status: 403 });
    }

    const korisnici = await prisma.korisnik.findMany({
      select: {
        id: true,
        ime: true,
        email: true,
        uloga: true,
        pol: true,
        createdAt: true,
        _count: {
          select: {
            kosnice: true,
            aktivnosti: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: korisnici });
  } catch (error) {
    console.error('Greška pri dohvatanju korisnika:', error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/admin/users:
 *   patch:
 *     summary: Izmeni ulogu ili lozinku korisnika (samo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID korisnika kojeg menjamo
 *                 example: 2
 *               uloga:
 *                 type: string
 *                 enum: [KORISNIK, MENADZER]
 *                 description: Nova uloga korisnika (ADMIN ne može biti dodeljen)
 *                 example: MENADZER
 *               novaSifra:
 *                 type: string
 *                 minLength: 6
 *                 description: Nova lozinka korisnika
 *                 example: novaLozinka123
 *     responses:
 *       200:
 *         description: Korisnik uspešno ažuriran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Korisnik uspešno ažuriran.
 *                 data:
 *                   $ref: '#/components/schemas/KorisnikJavni'
 *       400:
 *         description: Nevalidni podaci ili pokušaj menjanja sopstvenog naloga
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Nemate dozvolu ili pokušaj menjanja drugog admina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function PATCH(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Nemate dozvolu za ovu akciju.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, uloga, novaSifra } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID korisnika je obavezan.' }, { status: 400 });
    }

    if (parseInt(id) === admin.userId) {
      return NextResponse.json({ error: 'Ne možete menjati sopstveni nalog.' }, { status: 400 });
    }

    const korisnik = await prisma.korisnik.findUnique({ where: { id: parseInt(id) } });
    if (!korisnik) {
      return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 });
    }

    if (korisnik.uloga === 'ADMIN') {
      return NextResponse.json({ error: 'Ne možete menjati nalog drugog administratora.' }, { status: 403 });
    }

    const updateData: { uloga?: 'KORISNIK' | 'MENADZER' | 'ADMIN'; sifra?: string } = {};

    if (uloga) {
      const validneUloge = ['KORISNIK', 'MENADZER'];
      if (!validneUloge.includes(uloga)) {
        return NextResponse.json({ error: 'Nevažeća uloga.' }, { status: 400 });
      }
      updateData.uloga = uloga;
    }

    if (novaSifra) {
      if (novaSifra.length < 6) {
        return NextResponse.json({ error: 'Lozinka mora imati minimum 6 karaktera.' }, { status: 400 });
      }
      updateData.sifra = await hashPassword(novaSifra);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nema podataka za ažuriranje.' }, { status: 400 });
    }

    const azuriran = await prisma.korisnik.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: { id: true, ime: true, email: true, uloga: true },
    });

    return NextResponse.json({ message: 'Korisnik uspešno ažuriran.', data: azuriran });
  } catch (error) {
    console.error('Greška pri ažuriranju korisnika:', error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}



/**
 * @swagger
 * /api/admin/users:
 *   delete:
 *     summary: Obriši korisnika (samo ADMIN)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID korisnika kojeg brišemo
 *                 example: 2
 *     responses:
 *       200:
 *         description: Korisnik uspešno obrisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Korisnik uspešno obrisan.
 *       400:
 *         description: Nedostaje ID ili pokušaj brisanja sopstvenog naloga
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Nemate dozvolu ili pokušaj brisanja drugog admina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function DELETE(request: NextRequest) {
  try {
    const admin = requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Nemate dozvolu za ovu akciju.' }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID korisnika je obavezan.' }, { status: 400 });
    }

    if (parseInt(id) === admin.userId) {
      return NextResponse.json({ error: 'Ne možete obrisati sopstveni nalog.' }, { status: 400 });
    }

    const korisnik = await prisma.korisnik.findUnique({ where: { id: parseInt(id) } });
    if (!korisnik) {
      return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 });
    }

    if (korisnik.uloga === 'ADMIN') {
      return NextResponse.json({ error: 'Ne možete obrisati nalog drugog administratora.' }, { status: 403 });
    }

    await prisma.korisnik.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: 'Korisnik uspešno obrisan.' });
  } catch (error) {
    console.error('Greška pri brisanju korisnika:', error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}