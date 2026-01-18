import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import Assessment from '@/lib/db/models/Assessment';
import Result from '@/lib/db/models/Result';
import Content from '@/lib/db/models/Content';

/**
 * Test API Route - GET /api/test-db
 *
 * This endpoint tests:
 * 1. Database connection works
 * 2. All models are properly defined
 * 3. We can perform basic operations
 */
export async function GET() {
  try {
    // Step 1: Connect to database
    await connectDB();
    console.log('✅ Database connected successfully');

    // Step 2: Test model access (doesn't insert data, just checks models exist)
    const modelTests = {
      User: User.modelName,
      Assessment: Assessment.modelName,
      Result: Result.modelName,
      Content: Content.modelName,
    };

    // Step 3: Count documents in each collection
    const counts = {
      users: await User.countDocuments(),
      assessments: await Assessment.countDocuments(),
      results: await Result.countDocuments(),
      content: await Content.countDocuments(),
    };

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      models: modelTests,
      documentCounts: counts,
      timestamp: new Date().toISOString(),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // If anything fails, return error details
    console.error('❌ Database connection failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: 'Check your MONGODB_URI in .env.local',
      },
      { status: 500 },
    );
  }
}
