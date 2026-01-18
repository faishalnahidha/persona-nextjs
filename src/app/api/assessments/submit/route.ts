import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Assessment from '@/lib/db/models/Assessment';
import Result from '@/lib/db/models/Result';
import User from '@/lib/db/models/User';
import { POINTS } from '@/lib/constants/points';

/**
 * POST /api/assessment/submit
 *
 * Handles assessment submission for both guest and registered users
 * - Creates/updates user
 * - Calculates scores
 * - Saves result
 * - Awards points
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { assessmentId, answers, questionCounts, userName } = body;

    // Validate input
    if (!assessmentId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 },
      );
    }

    // Verify assessment exists
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 },
      );
    }

    // Calculate scores using Assessment model method
    const calculatedResult = Assessment.calculateResult(
      answers,
      questionCounts,
    );

    // Check if user is authenticated (you'll implement auth later)
    // For now, we'll create a guest user
    const guestName = userName || `Guest_${Date.now()}`;

    const guestUser = await User.create({
      userType: 'guest',
      name: guestName,
      personalityType: calculatedResult.personalityType,
    });

    // Award points for starting and completing test
    // await guestUser.awardPoints(
    //   POINTS.START_TEST + POINTS.COMPLETE_TEST,
    //   'complete_test',
    // );

    // Save result
    const result = await Result.createNewResult(guestUser._id, assessmentId, {
      answers,
      scores: calculatedResult.scores,
      personalityType: calculatedResult.personalityType,
      alternativeType1: calculatedResult.alternativeType1 || undefined,
      alternativeType2: calculatedResult.alternativeType2 || undefined,
    });

    // Return result ID for redirection
    return NextResponse.json({
      success: true,
      resultId: result._id.toString(),
      userId: guestUser._id.toString(),
      personalityType: calculatedResult.personalityType,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Assessment submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit assessment' },
      { status: 500 },
    );
  }
}
