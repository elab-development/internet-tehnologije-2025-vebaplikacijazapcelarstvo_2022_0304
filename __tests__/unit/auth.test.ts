import { describe, it, expect } from 'vitest'
import { createToken, verifyToken, extractToken } from '@/lib/auth'

describe('lib/auth.ts', () => {

  it('createToken kreira validan JWT (3 dela odvojena tačkom)', () => {
    const token = createToken({ userId: 1, email: 'test@test.com', uloga: 'KORISNIK' })
    expect(token.split('.')).toHaveLength(3)
  })

  it('verifyToken vraća null za nevažeći token', () => {
    expect(verifyToken('ovo.nije.token')).toBeNull()
  })

})