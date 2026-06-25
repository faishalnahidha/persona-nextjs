import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In — Persona',
  description: 'Sign in to your Persona account',
};

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect('/');

  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
