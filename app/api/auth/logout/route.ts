import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Odjava korisnika
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