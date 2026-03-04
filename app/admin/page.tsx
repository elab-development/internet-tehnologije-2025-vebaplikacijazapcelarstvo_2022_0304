import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) redirect('/');

  const decoded = verifyToken(token);
  if (!decoded || decoded.uloga !== 'ADMIN') redirect('/profile');

  return <AdminClient />;
}