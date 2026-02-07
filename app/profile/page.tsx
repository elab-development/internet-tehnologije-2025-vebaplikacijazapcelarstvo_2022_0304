import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  // Verifikuj token
  const decoded = verifyToken(token);
  
  if (!decoded || !decoded.userId) {
    redirect('/login');
  }

  // Pronađi korisnika u bazi sa svim povezanim podacima
  const korisnik = await prisma.korisnik.findUnique({
    where: {
      id: decoded.userId,
    },
    include: {
      kosnice: true,
      aktivnosti: {
        orderBy: {
          datumPocetka: 'desc'
        }
      },
      notifikacije: {
        where: {
          seen: false
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5,
        include: {
          aktivnost: true
        }
      }
    },
  });

  if (!korisnik) {
    redirect("/login");
  }

  // Prebrojavanje
  const brojKosnica = korisnik.kosnice.length;
  const brojAktivnosti = korisnik.aktivnosti.length;
  const brojNotifikacija = korisnik.notifikacije.length;

  // Formatiraj datum pridruživanja
  const joinedDate = new Intl.DateTimeFormat('sr-RS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(korisnik.createdAt);

  // Pretvori ulogu na srpski
  const ulogaMapping: Record<string, string> = {
    ADMIN: 'Administrator',
    KORISNIK: 'Korisnik',
    MENADZER: 'Menadžer'
  };

  const userData = {
    id: korisnik.id,
    name: korisnik.ime,
    email: korisnik.email,
    role: ulogaMapping[korisnik.uloga] || korisnik.uloga,
    joinedDate: joinedDate
  };

  const stats = {
    hives: brojKosnica,
    activities: brojAktivnosti,
    notifications: brojNotifikacija
  };

  const notifications = korisnik.notifikacije.map(n => ({
    id: n.id,
    message: n.poruka,
    activityTitle: n.aktivnost.naslov,
    createdAt: n.createdAt
  }));

  return (
    <ProfileClient 
      user={userData} 
      stats={stats} 
      notifications={notifications}
    />
  );
}