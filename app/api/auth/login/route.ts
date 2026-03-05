import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, createToken } from '@/lib/auth'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags: [Autentifikacija]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, sifra]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: korisnik@example.com
 *               sifra:
 *                 type: string
 *                 format: password
 *                 example: mojalozinka123
 *     responses:
 *       200:
 *         description: Uspešna prijava, JWT token postavljen u HttpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Uspešno ste se prijavili.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 korisnik:
 *                   $ref: '#/components/schemas/KorisnikJavni'
 *       400:
 *         description: Email ili lozinka nisu uneti
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Pogrešan email ili lozinka
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Preuzmi email i lozinku iz request body-ja
    const body = await request.json()
    const { email, sifra } = body

    // 2. Validacija proveri da li su podaci uneti
    if (!email || !sifra) {
      return NextResponse.json(
        { error: 'Email i lozinka su obavezni.' },
        { status: 400 }
      )
    }

    // 3. Pronađi korisnika po email-u
    const korisnik = await prisma.korisnik.findUnique({
      where: { email },
    })

    // 4. Proveri da li korisnik postoji
    if (!korisnik) {
      return NextResponse.json(
        { error: 'Pogrešan email ili lozinka.' },
        { status: 401 }
      )
    }

    // 5. Uporedi unesenu lozinku sa heširanom lozinkom iz baze
    const lozinkaValidna = await comparePassword(sifra, korisnik.sifra)

    if (!lozinkaValidna) {
      return NextResponse.json(
        { error: 'Pogrešan email ili lozinka.' },
        { status: 401 }
      )
    }

    // 6. Kreiraj JWT token
    const token = createToken({
      userId: korisnik.id,
      email: korisnik.email,
      uloga: korisnik.uloga,
    })

    // 7. Vrati token i podatke korisnika
    const response =  NextResponse.json(
      {
        message: 'Uspešno ste se prijavili.',
        token,
        korisnik: {
          id: korisnik.id,
          ime: korisnik.ime,
          email: korisnik.email,
          uloga: korisnik.uloga,
        },
      },
      { status: 200 }
    )
    // Postavi HttpOnly cookie sa tokenom
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 dana
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Greška prilikom prijave:', error)
    return NextResponse.json(
      { error: 'Greška prilikom prijave.' },
      { status: 500 }
    )
  }
}