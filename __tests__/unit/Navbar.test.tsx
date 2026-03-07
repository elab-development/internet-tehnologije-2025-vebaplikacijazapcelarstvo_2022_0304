import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Navbar from '@/components/Navbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/hives',
}))

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

vi.mock('@/components/NotifikacijePanel', () => ({
  default: () => null,
}))

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({}),
  })
})

describe('Navbar komponenta', () => {

  it('prikazuje naziv aplikacije Košnica PLUS', async () => {
    render(<Navbar />)
    const naziv = await screen.findByText('Košnica PLUS')
    expect(naziv).toBeInTheDocument()
  })

  it('prikazuje link za Košnice', async () => {
    render(<Navbar />)
    const link = await screen.findByText('Košnice')
    expect(link).toBeInTheDocument()
  })

  it('prikazuje link za Aktivnosti', async () => {
    render(<Navbar />)
    const link = await screen.findByText('Aktivnosti')
    expect(link).toBeInTheDocument()
  })

  it('ne prikazuje Admin link za obicnog korisnika', () => {
    render(<Navbar />)
    const adminLink = screen.queryByText('Admin')
    expect(adminLink).not.toBeInTheDocument()
  })

})