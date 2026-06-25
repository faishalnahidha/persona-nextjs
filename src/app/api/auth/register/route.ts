import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Username may only contain lowercase letters, numbers, and underscores'),
});

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

    const { name, email, password, username } = parsed.data;

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

    const existingUsername = await User.findOne({ username }).lean();
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 },
      );
    }

    // Password is hashed by the pre-save hook on User model
    await User.create({
      userType: 'registered',
      name,
      email: email.toLowerCase(),
      password,
      username,
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
