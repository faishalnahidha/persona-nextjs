import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Result Model - Stores assessment results
 *
 * Current: Users take test once, result stored in User document
 * Future: Users can retake tests, multiple results per user
 *
 * This separate collection makes future expansion easier while
 * maintaining current "single test" behavior
 */
export interface IResult extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User (guest or registered)
  assessmentId: mongoose.Types.ObjectId; // Which assessment was taken

  // Raw Answers (e.g., ["I", "N", "N", "F", ...])
  answers: string[];

  // Calculated Scores
  scores: {
    extrovert: number;
    introvert: number;
    sensory: number;
    intuitive: number;
    thinking: number;
    feeling: number;
    judging: number;
    perceiving: number;
  };

  // Final Result
  personalityType: string; // e.g., "INFJ"
  alternativeType1?: string; // e.g., "INTJ"
  alternativeType2?: string; // e.g., "ISFJ"

  // Metadata
  completedAt: Date;
  timeTaken?: number; // In seconds (how long to complete test)

  // For future: Mark as "active" result vs historical
  isActive: boolean; // true = current result shown to user

  createdAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: [true, 'Assessment ID is required'],
    },
    answers: {
      type: [String],
      required: [true, 'Answers are required'],
      validate: {
        validator: function (answers: string[]) {
          return answers.length > 0;
        },
        message: 'At least one answer is required',
      },
    },
    scores: {
      extrovert: { type: Number, required: true, min: 0, max: 100 },
      introvert: { type: Number, required: true, min: 0, max: 100 },
      sensory: { type: Number, required: true, min: 0, max: 100 },
      intuitive: { type: Number, required: true, min: 0, max: 100 },
      thinking: { type: Number, required: true, min: 0, max: 100 },
      feeling: { type: Number, required: true, min: 0, max: 100 },
      judging: { type: Number, required: true, min: 0, max: 100 },
      perceiving: { type: Number, required: true, min: 0, max: 100 },
    },
    personalityType: {
      type: String,
      required: [true, 'Personality type is required'],
      uppercase: true,
      match: [/^[A-Z]{4}$/, 'Personality type must be 4 uppercase letters'],
    },
    alternativeType1: {
      type: String,
      uppercase: true,
    },
    alternativeType2: {
      type: String,
      uppercase: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    timeTaken: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt
  },
);

/**
 * Indexes for fast queries
 */
ResultSchema.index({ userId: 1, isActive: 1 }); // Get user's active result
ResultSchema.index({ userId: 1, createdAt: -1 }); // Get user's result history
ResultSchema.index({ assessmentId: 1 }); // Analytics: all results for an assessment
ResultSchema.index({ personalityType: 1 }); // Group by personality type

/**
 * Validation: Scores must add up correctly
 * E.g., extrovert + introvert should equal 100
 */
ResultSchema.pre('save', async function () {
  const { scores } = this;

  // Check if complementary scores add up to 100
  const pairs = [
    [scores.extrovert, scores.introvert],
    [scores.sensory, scores.intuitive],
    [scores.thinking, scores.feeling],
    [scores.judging, scores.perceiving],
  ];

  for (const [score1, score2] of pairs) {
    if (Math.abs(score1 + score2 - 100) > 0.01) {
      // Allow small floating point errors
      throw new Error('Complementary scores must add up to 100');
    }
  }
});

/**
 * Static method: Get user's active result
 * Usage: await Result.getActiveResult(userId)
 */
ResultSchema.statics.getActiveResult = async function (
  userId: mongoose.Types.ObjectId,
) {
  return await this.findOne({ userId, isActive: true });
};

/**
 * Static method: Create new result and mark previous as inactive
 * Usage: await Result.createNewResult(userId, assessmentId, data)
 *
 * This ensures only one result is "active" at a time
 */
ResultSchema.statics.createNewResult = async function (
  userId: mongoose.Types.ObjectId,
  assessmentId: mongoose.Types.ObjectId,
  resultData: {
    answers: string[];
    scores: IResult['scores'];
    personalityType: string;
    alternativeType1?: string;
    alternativeType2?: string;
    timeTaken?: number;
  },
) {
  // Mark all previous results as inactive
  await this.updateMany(
    { userId, isActive: true },
    { $set: { isActive: false } },
  );

  // Create new active result
  const result = await this.create({
    userId,
    assessmentId,
    ...resultData,
    isActive: true,
  });

  return result;
};

const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);

export default Result;
