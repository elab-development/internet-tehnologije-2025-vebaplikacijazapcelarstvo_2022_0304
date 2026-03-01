import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

function getUserFromRequest(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const uloga = request.headers.get('x-user-role');

  if (userId) return { userId: parseInt(userId), uloga };

  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return { userId: decoded.userId, uloga: decoded.uloga };
}

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const notifikacije = await prisma.notifikacija.findMany({
      where: { korisnikId: user.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        aktivnost: {
          select: { naslov: true, tip: true, datumPocetka: true },
        },
      },
    });

    return NextResponse.json({ data: notifikacije });
  } catch (error) {
    console.error('Greška pri dohvatanju notifikacija:', error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    console.log('USER FROM REQUEST:', user);
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    if (user.uloga !== 'MENADZER') {
      return NextResponse.json({ error: 'Nemate dozvolu za ovu akciju.' }, { status: 403 });
    }

    const body = await request.json();
    const { poruka } = body;

    if (!poruka || poruka.trim().length === 0) {
      return NextResponse.json({ error: 'Poruka ne može biti prazna.' }, { status: 400 });
    }

    if (poruka.trim().length > 500) {
      return NextResponse.json({ error: 'Poruka ne može biti duža od 500 karaktera.' }, { status: 400 });
    }

    const korisnici = await prisma.korisnik.findMany({
      where: { uloga: 'KORISNIK' },
      select: { id: true },
    });

    if (korisnici.length === 0) {
      return NextResponse.json({ error: 'Nema korisnika kojima se može poslati notifikacija.' }, { status: 404 });
    }

    await prisma.notifikacija.createMany({
      data: korisnici.map((k) => ({
        poruka: poruka.trim(),
        korisnikId: k.id,
        aktivnostId: null,
      })),
    });

    return NextResponse.json(
      { message: `Notifikacija uspešno poslata ${korisnici.length} korisnika.` },
      { status: 201 }
    );
  } catch (error) {
    console.error('Greška pri slanju notifikacije:', error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Niste prijavljeni.' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    await prisma.notifikacija.updateMany({
      where: { id: parseInt(id), korisnikId: user.userId },
      data: { seen: true },
    });

    return NextResponse.json({ message: 'Notifikacija označena kao pročitana.' });
  } catch (error) {
    console.error('Greška pri ažuriranju notifikacije:', error);
    return NextResponse.json({ error: 'Greška na serveru.' }, { status: 500 });
  }
}