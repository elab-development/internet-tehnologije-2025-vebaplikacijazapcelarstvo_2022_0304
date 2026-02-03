import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractToken, JWTPayload } from './auth'

//Middleware koji proverava da li je korisnik autentifikovan

export async function authenticate(
  request: NextRequest
): Promise<{ payload: JWTPayload | null; error: NextResponse | null }> {
  const authHeader = request.headers.get('authorization')
  const token = extractToken(authHeader)

  if (!token) {
    return {
      payload: null,
      error: NextResponse.json(
        { error: 'Niste autentifikovani. Token nedostaje.' },
        { status: 401 }
      ),
    }
  }

  const payload = verifyToken(token)

  if (!payload) {
    return {
      payload: null,
      error: NextResponse.json(
        { error: 'Nevažeći ili istekao token.' },
        { status: 401 }
      ),
    }
  }

  return { payload, error: null }
}

//Middleware koji proverava da li korisnik ima određenu ulogu

export function authorize(
  payload: JWTPayload,
  allowedRoles: string[]
): NextResponse | null {
  if (!allowedRoles.includes(payload.uloga)) {
    return NextResponse.json(
      { error: 'Nemate dozvolu za pristup ovom resursu.' },
      { status: 403 }
    )
  }

  return null
}

//Helper funkcija koja kombinuje autentifikaciju i autorizaciju

export async function authenticateAndAuthorize(
  request: NextRequest,
  allowedRoles?: string[]
): Promise<{ payload: JWTPayload | null; error: NextResponse | null }> {
  // Prvo proveravamo autentifikaciju
  const { payload, error: authError } = await authenticate(request)

  if (authError) {
    return { payload: null, error: authError }
  }

  // Ako su navedene uloge, proveravamo autorizaciju
  if (allowedRoles && payload) {
    const authzError = authorize(payload, allowedRoles)
    if (authzError) {
      return { payload: null, error: authzError }
    }
  }

  return { payload, error: null }
}