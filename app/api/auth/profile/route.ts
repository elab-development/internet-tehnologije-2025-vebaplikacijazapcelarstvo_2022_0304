import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, hashPassword } from '@/lib/auth';

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