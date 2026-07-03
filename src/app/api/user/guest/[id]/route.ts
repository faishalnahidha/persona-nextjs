import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await connectDB();

    const user = await User.findById(id)
      .select('name dateOfBirth gender userType')
      .lean();

    if (!user || user.userType !== 'guest') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name,
      dateOfBirth: user.dateOfBirth
        ? (user.dateOfBirth as Date).toISOString()
        : null,
      gender: user.gender ?? null,
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
