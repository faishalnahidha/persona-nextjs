'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

import { IconBrandGoogle, IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(50),
    email: z.string().email('Enter a valid email address'),
    username: z
      .string()
      .min(3, 'At least 3 characters')
      .max(30)
      .regex(
        /^[a-z0-9_]+$/,
        'Only lowercase letters, numbers, and underscores',
      ),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: RegisterValues) {
    setServerError(null);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        username: values.username,
        password: values.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setServerError(data.error ?? 'Registration failed. Please try again.');
      return;
    }

    await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl: '/',
    });
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
  }

  return (
    <Card className='w-full max-w-md shadow-none'>
      <CardHeader className='space-y-1 pb-4'>
        <CardTitle className='heading-3 text-center'>Buat akun baru</CardTitle>
        <CardDescription className='para-sm text-center text-muted-foreground'>
          Simpan hasil tes dan lihat panduan khusus tipe kepribadianmu
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Google OAuth */}
        <Button
          type='button'
          variant='outline'
          className='w-full rounded-full'
          onClick={handleGoogleSignIn}
          disabled={googleLoading || isSubmitting}
        >
          {googleLoading ? (
            <IconLoader2 className='animate-spin' />
          ) : (
            <IconBrandGoogle />
          )}
          Daftar dengan Google
        </Button>

        <div className='flex items-center gap-3'>
          <Separator className='flex-1' />
          <span className='para-mini text-muted-foreground'>atau</span>
          <Separator className='flex-1' />
        </div>

        {/* Registration form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='contoh: Ani Budiman'
                      autoComplete='name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='contoh@email.com'
                      autoComplete='email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='contoh: anibudiman_123'
                      autoComplete='username'
                      {...field}
                      onChange={e =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      autoComplete='new-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>
                    Konfirmasi password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      autoComplete='new-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError && (
              <p className='para-sm text-destructive-foreground bg-destructive rounded-md px-3 py-2'>
                {serverError}
              </p>
            )}

            <Button
              type='submit'
              className='w-full rounded-full'
              disabled={isSubmitting || googleLoading}
            >
              {isSubmitting ? <IconLoader2 className='animate-spin' /> : null}
              Buat akun
            </Button>
          </form>
        </Form>

        <p className='para-sm text-center text-muted-foreground'>
          Sudah punya akun?{' '}
          <Link
            href='/login'
            className='text-foreground font-medium underline underline-offset-4'
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

