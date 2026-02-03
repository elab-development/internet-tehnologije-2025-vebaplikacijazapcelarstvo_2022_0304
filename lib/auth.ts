import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

// Tipovi
export interface JWTPayload {
  userId: number
  email: string
  uloga: string
}

//Hešira lozinku koristeći bcrypt

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

//Poredi lozinku sa heširanom lozinkom iz baze

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

//Kreira JWT token

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token ističe za 7 dana
  })
}

//Verifikuje JWT token

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

//Izvlači token iz Authorization header-a
 
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7) //Ukloni "Bearer " prefiks
}