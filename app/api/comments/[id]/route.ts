import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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