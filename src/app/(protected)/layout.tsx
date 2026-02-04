import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { SessionTimeoutWarning } from '@/components/auth/SessionTimeoutWarning';

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
    <>
      <SessionTimeoutWarning />
      {children}
    </>
  );
}
