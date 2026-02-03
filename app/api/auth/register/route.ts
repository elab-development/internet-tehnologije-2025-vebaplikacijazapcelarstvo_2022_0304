import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

/**
 * POST /api/auth/register
 * Registracija novog korisnika
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Preuzmi podatke iz request body-ja
    const body = await request.json()
    const { ime, email, sifra, uloga } = body

    // 2. Validacija proveri da li su svi podaci uneti
    if (!ime || !email || !sifra) {
      return NextResponse.json(
        { error: 'Svi podaci moraju biti uneti.' },
        { status: 400 }
      )
    }

    // 3. Validacija email formata
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email adresa nije validna.' },
        { status: 400 }
      )
    }

    // 4. Validacija lozinke (min 6 karaktera)
    if (sifra.length < 6) {
      return NextResponse.json(
        { error: 'Lozinka mora imati minimum 6 karaktera.' },
        { status: 400 }
      )
    }

    // 5. Proveri da li korisnik sa ovim email-om već postoji
    const postojeciKorisnik = await prisma.korisnik.findUnique({
      where: { email },
    })

    if (postojeciKorisnik) {
      return NextResponse.json(
        { error: 'Postoji korisnik sa unetom email adresom.' },
        { status: 409 }
      )
    }

    // 6. Heširaj lozinku
    const hesiranaLozinka = await hashPassword(sifra)

    // 7. Kreiraj novog korisnika u bazi
    const noviKorisnik = await prisma.korisnik.create({
      data: {
        ime,
        email,
        sifra: hesiranaLozinka,
        uloga: uloga || 'KORISNIK', // Default uloga je KORISNIK
      },
      select: {
        id: true,
        ime: true,
        email: true,
        uloga: true,
        createdAt: true,
      },
    })

    // 8. Vrati uspešan odgovor
    return NextResponse.json(
      {
        message: 'Uspešno ste se registrovali.',
        korisnik: noviKorisnik,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Greška prilikom registracije:', error)
    return NextResponse.json(
      { error: 'Greška prilikom registracije.' },
      { status: 500 }
    )
  }
}