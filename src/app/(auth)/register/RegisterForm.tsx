'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { toast } from 'sonner';

import { IconBrandGoogle, IconCalendar, IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
import { cn } from '@/lib/utils';

const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi').max(50),
    dateOfBirth: z.date().optional(),
    gender: z.enum(['male', 'female']).optional(),
    email: z.string().email('Masukkan alamat email yang valid'),
    username: z
      .string()
      .min(3, 'Minimal 3 karakter')
      .max(30)
      .regex(
        /^[a-z0-9_]+$/,
        'Hanya huruf kecil, angka, dan garis bawah',
      )
      .optional()
      .or(z.literal('')),
    password: z.string().min(6, 'Minimal 6 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [guestUserId, setGuestUserId] = useState<string | null>(null);
  const [callbackUrl, setCallbackUrl] = useState('/');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      dateOfBirth: undefined,
      gender: undefined,
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fromQuery = searchParams.get('callbackUrl');
    const fromStorage = sessionStorage.getItem('guest_result_url');
    setCallbackUrl(fromQuery ?? fromStorage ?? '/');

    const storedId = sessionStorage.getItem('guest_user_id');
    if (!storedId) return;

    setGuestUserId(storedId);

    fetch(`/api/user/guest/${storedId}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data) return;
        if (data.name) form.setValue('name', data.name);
        if (data.dateOfBirth)
          form.setValue('dateOfBirth', new Date(data.dateOfBirth));
        if (data.gender) form.setValue('gender', data.gender);
      })
      .catch(() => null);
  }, [form, searchParams]);

  async function onSubmit(values: RegisterValues) {
    setServerError(null);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        username: values.username || undefined,
        password: values.password,
        confirmPassword: values.confirmPassword,
        dateOfBirth: values.dateOfBirth?.toISOString(),
        gender: values.gender,
        guestUserId: guestUserId ?? undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setServerError(data.error ?? 'Pendaftaran gagal. Coba lagi.');
      return;
    }

    sessionStorage.removeItem('guest_user_id');
    sessionStorage.removeItem('guest_result_url');

    const signInResult = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setServerError('Akun berhasil dibuat, tapi gagal login otomatis. Silakan login.');
      return;
    }

    toast.success('Akun berhasil dibuat!');
    setTimeout(() => router.push(callbackUrl), 1000);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl });
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            {/* Name */}
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

            {/* Date of birth */}
            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>
                    Tanggal lahir
                  </FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type='button'
                          variant='outline'
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <IconCalendar className='mr-2 size-4' />
                          {field.value
                            ? format(field.value, 'd MMMM yyyy', {
                                locale: idLocale,
                              })
                            : 'Pilih tanggal lahir'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        captionLayout='dropdown'
                        selected={field.value}
                        onSelect={date => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        fromYear={1950}
                        toYear={new Date().getFullYear() - 5}
                        disabled={date => date > new Date()}
                        defaultMonth={field.value ?? new Date(2000, 0)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender */}
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='para-sm-medium'>
                    Jenis kelamin
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className='flex gap-6'
                    >
                      <div className='flex items-center gap-2'>
                        <RadioGroupItem value='male' id='gender-male' />
                        <Label
                          htmlFor='gender-male'
                          className='para-sm cursor-pointer'
                        >
                          Laki-laki
                        </Label>
                      </div>
                      <div className='flex items-center gap-2'>
                        <RadioGroupItem value='female' id='gender-female' />
                        <Label
                          htmlFor='gender-female'
                          className='para-sm cursor-pointer'
                        >
                          Perempuan
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
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

            {/* Username (optional) */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-baseline justify-between'>
                    <FormLabel className='para-sm-medium'>Username</FormLabel>
                    <span className='para-mini text-muted-foreground'>
                      opsional
                    </span>
                  </div>
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

            {/* Password */}
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

            {/* Confirm password */}
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
