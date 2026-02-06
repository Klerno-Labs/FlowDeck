import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { SessionTimeoutWarning } from '@/components/auth/SessionTimeoutWarning';
import RealTimeWrapper from '@/components/RealTimeWrapper';

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
    <RealTimeWrapper>
      <SessionTimeoutWarning />
      {children}
    </RealTimeWrapper>
  );
}
