'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function SignInButton() {
  return (
    <Button
      size="xl"
      variant="primary"
      onClick={() => signIn('azure-ad', { callbackUrl: '/home' })}
      className="w-full"
    >
      <svg className="w-6 h-6 mr-2" viewBox="0 0 21 21" fill="currentColor">
        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
      </svg>
      Sign in with Microsoft
    </Button>
  );
}
