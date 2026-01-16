import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Result Model - Stores assessment results for both guest and registered users
 *
 * Think about your Meteor newPlayers collection:
 * - It stored guest user data with answers and scores
 * - This model does the same, but also handles registered users!
 */
export interface IResult extends Document {
  assessmentId: mongoose.Types.ObjectId; // Which assessment was taken
  userId?: mongoose.Types.ObjectId; // If registered user (optional)
  guestId?: string; // If guest user (optional)
  answers: Map<string, unknown>; // Question index -> answer selected
  scores: Map<string, number>; // Trait -> score (e.g., "introvert": 85)
  createdAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: [true, 'Assessment ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // Optional - only set if user is registered
    },
    guestId: {
      type: String,
      // Optional - only set if user is guest
      // In your app, you might generate this from session/cookie
    },
    answers: {
      type: Map,
      of: Schema.Types.Mixed,
      required: [true, 'Answers are required'],
      // Example: { "0": "Option A", "1": "Option C", "2": "Option B" }
    },
    scores: {
      type: Map,
      of: Number,
      required: [true, 'Scores are required'],
      // Example: { "introvert": 75, "extrovert": 25, "thinking": 60, "feeling": 40 }
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt
  }
);

/**
 * Validation: Either userId OR guestId must be present (not both, not neither)
 */
ResultSchema.pre<IResult>('save', async function () {
  const hasUserId = !!this.userId;
  const hasGuestId = !!this.guestId;

  if (hasUserId && hasGuestId) {
    throw new Error('Result cannot have both userId and guestId');
  } else if (!hasUserId && !hasGuestId) {
    throw new Error('Result must have either userId or guestId');
  }
});

/**
 * Indexes for fast queries
 *
 * Common queries:
 * - "Get all results for this user" -> index userId
 * - "Get all results for this assessment" -> index assessmentId
 * - "Get this guest's results" -> index guestId
 */
ResultSchema.index({ userId: 1, createdAt: -1 }); // User's results, newest first
ResultSchema.index({ guestId: 1, createdAt: -1 }); // Guest's results, newest first
ResultSchema.index({ assessmentId: 1 }); // All results for an assessment

const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);

export default Result;
