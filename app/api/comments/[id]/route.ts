import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

/**
 * DELETE /api/comments/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Niste autentifikovani.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Nevažeći token.' },
        { status: 401 }
      );
    }

    const komentar = await prisma.komentar.findFirst({
      where: {
        id: parseInt(params.id),
        korisnikId: decoded.userId,
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

    return NextResponse.json({
      message: 'Komentar uspešno obrisan.',
    });
  } catch (error) {
    console.error('Greška prilikom brisanja komentara:', error);
    return NextResponse.json(
      { error: 'Greška prilikom brisanja komentara.' },
      { status: 500 }
    );
  }
}