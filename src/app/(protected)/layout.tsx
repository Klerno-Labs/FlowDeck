import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { HomeButton } from '@/components/layout/HomeButton';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white">
      <HomeButton />
      {children}
    </div>
  );
}
