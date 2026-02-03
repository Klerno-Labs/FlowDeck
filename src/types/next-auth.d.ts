import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: 'dev' | 'admin' | 'sales';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: 'dev' | 'admin' | 'sales';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    role: 'dev' | 'admin' | 'sales';
    createdAt?: number;
    accessToken?: string;
  }
}
