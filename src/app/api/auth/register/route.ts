import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(50),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30)
      .regex(
        /^[a-z0-9_]+$/,
        'Username may only contain lowercase letters, numbers, and underscores',
      )
      .optional()
      .or(z.literal('')),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
    guestUserId: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

async function generateUsername(baseName: string): Promise<string> {
  const base = baseName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20) || 'user';

  let username = base;
  let suffix = 1;
  while (await User.findOne({ username }).lean()) {
    username = `${base}_${suffix++}`;
  }
  return username;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password, username, dateOfBirth, gender, guestUserId } =
      parsed.data;

    await connectDB();

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
      userType: 'registered',
    }).lean();

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    const resolvedUsername =
      username && username.trim()
        ? username
        : await generateUsername(name);

    const existingUsername = await User.findOne({ username: resolvedUsername }).lean();
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 },
      );
    }

    if (guestUserId) {
      const guestUser = await User.findById(guestUserId);

      if (guestUser && guestUser.userType === 'guest') {
        await guestUser.convertToRegistered(
          email.toLowerCase(),
          password,
          resolvedUsername,
          0,
        );

        guestUser.name = name;
        if (dateOfBirth) guestUser.dateOfBirth = new Date(dateOfBirth);
        if (gender) guestUser.gender = gender;
        await guestUser.save();

        return NextResponse.json({ success: true }, { status: 201 });
      }
    }

    await User.create({
      userType: 'registered',
      name,
      email: email.toLowerCase(),
      password,
      username: resolvedUsername,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      role: 'user',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('[register]', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
