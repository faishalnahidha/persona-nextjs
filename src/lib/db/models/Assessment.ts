import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Sub-document for individual questions
 * In Meteor, you might have stored this as a nested object
 * Mongoose lets us define schemas for nested documents too!
 */
interface IQuestion {
  question: string;
  options: string[];
  scores?: Map<string, number>; // For personality scoring (e.g., { "introvert": 2, "extrovert": 0 })
}

/**
 * Main Assessment interface
 */
export interface IAssessment extends Document {
  title: string;
  description: string;
  questions: IQuestion[];
  published: boolean;
  createdBy: mongoose.Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema for questions (sub-document)
 */
const QuestionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
    },
    options: {
      type: [String],
      required: [true, 'At least one option is required'],
      validate: {
        validator: function (options: string[]) {
          return options.length >= 2;
        },
        message: 'A question must have at least 2 options',
      },
    },
    scores: {
      type: Map,
      of: Number,
      // Optional: for personality tests where each answer has different trait scores
    },
  },
  { _id: false }
); // _id: false means questions won't get their own _id

/**
 * Main Assessment Schema
 */
const AssessmentSchema = new Schema<IAssessment>(
  {
    title: {
      type: String,
      required: [true, 'Assessment title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    questions: {
      type: [QuestionSchema],
      required: true,
      validate: {
        validator: function (questions: IQuestion[]) {
          return questions.length > 0;
        },
        message: 'Assessment must have at least one question',
      },
    },
    published: {
      type: Boolean,
      default: false, // Admins can create drafts
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // This creates a relationship to the User collection
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for better query performance
 *
 * Why index 'published'?
 * - We'll frequently query: "Show me all published assessments"
 * - Index makes this query much faster
 */
AssessmentSchema.index({ published: 1 });
AssessmentSchema.index({ createdBy: 1 });

const Assessment: Model<IAssessment> =
  mongoose.models.Assessment ||
  mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;
