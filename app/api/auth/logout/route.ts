import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Odjava korisnika
 *     tags: [Autentifikacija]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Korisnik uspešno odjavljen, JWT cookie obrisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Uspešno ste se odjavili.
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: 'Uspešno ste se odjavili.' },
       { status: 200 }
      )
      response.cookies.delete('token')
return response
  } catch (error) {
    console.error('Greška prilikom odjave:', error)
    return NextResponse.json(
      { error: 'Greška prilikom odjave.' },
      { status: 500 }
    )
  }
}