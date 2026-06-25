import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      personalityType?: string;
    } & DefaultSession['user'];
  }
}
