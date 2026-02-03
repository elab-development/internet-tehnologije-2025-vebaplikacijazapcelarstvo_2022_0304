import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, createToken } from '@/lib/auth'

/**
 * POST /api/auth/login
 * Prijava korisnika
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
    return NextResponse.json(
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
  } catch (error) {
    console.error('Greška prilikom prijave:', error)
    return NextResponse.json(
      { error: 'Greška prilikom prijave.' },
      { status: 500 }
    )
  }
}