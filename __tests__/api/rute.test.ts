/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as registerPOST } from '@/app/api/auth/register/route'
import { POST as loginPOST } from '@/app/api/auth/login/route'
import { POST as hivesPOST } from '@/app/api/hives/route'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  default: {
    korisnik: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    kosnica: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

import prisma from '@/lib/prisma'

const makeRequest = (body: object, headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost:3000', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...headers },
  })

describe('POST /api/auth/register', () => {

  it('vraća 400 ako ime nedostaje', async () => {
    const req = makeRequest({ ime: '', email: 'test@test.com', sifra: 'lozinka123' })
    const res = await registerPOST(req)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Svi podaci moraju biti uneti.')
  })

  it('vraća 400 za neispravan email format', async () => {
    const req = makeRequest({ ime: 'Ana', email: 'nijeEmail', sifra: 'lozinka123' })
    const res = await registerPOST(req)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Email adresa nije validna.')
  })

  it('vraća 409 ako korisnik već postoji', async () => {
    vi.mocked(prisma.korisnik.findUnique).mockResolvedValueOnce({
      id: 1, email: 'postoji@test.com', ime: 'Test', sifra: 'abc', uloga: 'KORISNIK',
      pol: null, createdAt: new Date(), updatedAt: new Date()
    })
    const req = makeRequest({ ime: 'Ana', email: 'postoji@test.com', sifra: 'lozinka123' })
    const res = await registerPOST(req)
    const data = await res.json()
    expect(res.status).toBe(409)
    expect(data.error).toBe('Postoji korisnik sa unetom email adresom.')
  })

})

describe('POST /api/auth/login', () => {

  it('vraća 400 ako email ili sifra nisu uneti', async () => {
    const req = makeRequest({ email: '', sifra: '' })
    const res = await loginPOST(req)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Email i lozinka su obavezni.')
  })

  it('vraća 401 ako korisnik ne postoji u bazi', async () => {
    vi.mocked(prisma.korisnik.findUnique).mockResolvedValueOnce(null)
    const req = makeRequest({ email: 'nepostoji@test.com', sifra: 'lozinka123' })
    const res = await loginPOST(req)
    const data = await res.json()
    expect(res.status).toBe(401)
    expect(data.error).toBe('Pogrešan email ili lozinka.')
  })

})

describe('POST /api/hives', () => {

  it('vraća 400 za nevalidnu jačinu košnice', async () => {
    const req = makeRequest(
      { naziv: 'Košnica A', brPcela: 5000, jacina: 'SUPER', brRamova: 10 },
      { 'x-user-id': '1' }
    )
    const res = await hivesPOST(req)
    const data = await res.json()
    expect(res.status).toBe(400)
    expect(data.error).toBe('Jačina mora biti: SLABA, SREDNJA ili JAKA.')
  })

})