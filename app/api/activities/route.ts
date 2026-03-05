import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';


/**
 * @swagger
 * /api/activities:
 *   get:
 *     summary: Preuzmi sve aktivnosti prijavljenog korisnika
 *     tags: [Aktivnosti]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista aktivnosti uspešno preuzeta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aktivnosti uspešno učitane.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Aktivnost'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
/**
 * GET /api/activities
 * Vraća sve aktivnosti za prijavljenog korisnika
 * 
 * Radi sa oba scenarija:
 * 1. Ako middleware dodaje x-user-id (kada GET zahteva token)
 * 2. Ako middleware ne dodaje (kada GET prolazi bez tokena)
 */
export async function GET(request: NextRequest) {
  try {
    // SCENARIO 1: Pokušaj da uzmeš userId iz headers-a (ako middleware dodaje)
    let userId = request.headers.get('x-user-id');

    // SCENARIO 2: Ako nema u headers-u, ručno proveri token
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Token nije pronađen. Morate biti prijavljeni.' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { error: 'Nevažeći ili istekao token.' },
          { status: 401 }
        );
      }

      userId = decoded.userId.toString();
    }

    // Učitaj sve aktivnosti za ovog korisnika
    const aktivnosti = await prisma.aktivnost.findMany({
      where: {
        korisnikId: parseInt(userId),
      },
      include: {
        kosnica: {
          select: {
            naziv: true,
          },
        },
      },
      orderBy: {
        datumPocetka: 'desc',
      },
    });

    return NextResponse.json({
      message: 'Aktivnosti uspešno učitane.',
      data: aktivnosti,
    });
  } catch (error) {
    console.error('Greška prilikom učitavanja aktivnosti:', error);
    return NextResponse.json(
      { 
        error: 'Greška prilikom učitavanja aktivnosti.',
        data: [] 
      },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Kreiraj novu aktivnost
 *     tags: [Aktivnosti]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [naslov, tip, opis, datumPocetka, kosnicaId]
 *             properties:
 *               naslov:
 *                 type: string
 *                 example: Pregled proleće
 *               tip:
 *                 type: string
 *                 example: PREGLED
 *               opis:
 *                 type: string
 *                 example: Redovni prolećni pregled košnice
 *               datumPocetka:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-15T10:00:00Z
 *               kosnicaId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Aktivnost uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aktivnost uspešno kreirana.
 *                 data:
 *                   $ref: '#/components/schemas/Aktivnost'
 *       400:
 *         description: Nevalidni podaci
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: Košnica nije pronađena ili nemate pristup
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
/**
 * POST /api/activities
 * Kreira novu aktivnost
 * 
 * Middleware već zahteva token za POST, pa userId SIGURNO postoji u headers
 */
export async function POST(request: NextRequest) {
  try {
    // Za POST, middleware sigurno dodaje userId (POST/PUT/DELETE zahtevaju token)
    let userId = request.headers.get('x-user-id');

    // Backup: Ako nema u headers-u, ručno proveri
    if (!userId) {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Token nije pronađen. Morate biti prijavljeni.' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { error: 'Nevažeći ili istekao token.' },
          { status: 401 }
        );
      }

      userId = decoded.userId.toString();
    }

    const body = await request.json();
    const { naslov, tip, opis, datumPocetka, kosnicaId } = body;

    // Validacija
    if (!naslov || !tip || !opis || !datumPocetka || !kosnicaId) {
      return NextResponse.json(
        { error: 'Svi podaci su obavezni (naslov, tip, opis, datumPocetka, kosnicaId)' },
        { status: 400 }
      );
    }

    // Proveri da li košnica pripada ovom korisniku
    const kosnica = await prisma.kosnica.findFirst({
      where: {
        id: parseInt(kosnicaId),
        korisnikId: parseInt(userId),
      },
    });

    if (!kosnica) {
      return NextResponse.json(
        { error: 'Košnica nije pronađena ili nemate pristup.' },
        { status: 404 }
      );
    }

    // Kreiraj aktivnost
    const novaAktivnost = await prisma.aktivnost.create({
      data: {
        naslov,
        tip,
        opis,
        datumPocetka: new Date(datumPocetka),
        izvrsena: false,
        korisnikId: parseInt(userId),
        kosnicaId: parseInt(kosnicaId),
      },
      include: {
        kosnica: {
          select: {
            naziv: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Aktivnost uspešno kreirana.',
        data: novaAktivnost,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Greška prilikom kreiranja aktivnosti:', error);
    return NextResponse.json(
      { error: 'Greška prilikom kreiranja aktivnosti.' },
      { status: 500 }
    );
  }
}