import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account — Persona',
  description: 'Create your Persona account',
};

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect('/');

  return <RegisterForm />;
}
