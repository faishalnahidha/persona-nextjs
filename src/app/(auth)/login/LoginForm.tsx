'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: LoginValues) {
    setServerError(null);

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError('Invalid email or password. Please try again.');
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl });
  }

  return (
    <Card className='w-full max-w-md shadow-none'>
      <CardHeader className='space-y-1 pb-4'>
        <CardTitle className='heading-3 text-center'>
          Login ke akun kamu
        </CardTitle>
      </CardHeader>

      <CardContent className='space-y-5'>
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
          Login dengan Google
        </Button>

        <div className='flex items-center gap-3'>
          <Separator className='flex-1' />
          <span className='para-mini text-muted-foreground'>
            atau dengan email
          </span>
          <Separator className='flex-1' />
        </div>

        {/* Credentials form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='••••••••'
                      autoComplete='current-password'
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
              Login
            </Button>
          </form>
        </Form>

        <p className='para-sm text-center text-muted-foreground'>
          Belum punya akun?{' '}
          <Link
            href='/'
            className='text-foreground font-medium underline underline-offset-4'
          >
            Mulai dulu tesnya
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

