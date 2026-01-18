import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Answer option for a question
 */
interface IOption {
  text: string;
  value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

/**
 * Individual question in the assessment
 */
interface IQuestion {
  _id: string; // Question ID (e.g., "1", "2", "3")
  group: 'EI' | 'SN' | 'TF' | 'JP'; // Which personality dimension this tests
  text: string; // Question text
  options: [IOption, IOption]; // Always exactly 2 options
}

/**
 * MBTI Assessment Model
 *
 * For now, only one assessment exists in the system.
 * The assessment contains all 70 questions for MBTI personality test.
 */
export interface IAssessment extends Document {
  title: string;
  description: string;
  instructions?: string; // How to take the assessment
  questions: IQuestion[];
  published: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Static methods on Assessment model
 */
interface IAssessmentStatics {
  calculateResult(
    answers: string[],
    questionCounts: { EI: number; SN: number; TF: number; JP: number },
  ): {
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
    personalityType: string;
    alternativeType1: string | null;
    alternativeType2: string | null;
  };
}

/**
 * Schema for answer options
 */
const OptionSchema = new Schema<IOption>(
  {
    text: {
      type: String,
      required: [true, 'Option text is required'],
      trim: true,
    },
    value: {
      type: String,
      required: [true, 'Option value is required'],
      enum: {
        values: ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'],
        message: '{VALUE} is not a valid option value',
      },
    },
  },
  { _id: false },
);

/**
 * Schema for questions
 */
const QuestionSchema = new Schema<IQuestion>(
  {
    _id: {
      type: String,
      required: [true, 'Question ID is required'],
    },
    group: {
      type: String,
      required: [true, 'Question group is required'],
      enum: {
        values: ['EI', 'SN', 'TF', 'JP'],
        message: '{VALUE} is not a valid question group',
      },
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [OptionSchema],
      required: [true, 'Options are required'],
      validate: {
        validator: function (options: IOption[]) {
          return options.length === 2;
        },
        message: 'Each question must have exactly 2 options',
      },
    },
  },
  { _id: false },
);

/**
 * Custom validation: Ensure options values match question type
 * E.g., if type is "EI", options must be "E" and "I"
 */
QuestionSchema.pre('validate', async function () {
  const groupToValues: Record<string, string[]> = {
    EI: ['E', 'I'],
    SN: ['S', 'N'],
    TF: ['T', 'F'],
    JP: ['J', 'P'],
  };

  const expectedValues = groupToValues[this.group];
  const actualValues = this.options.map(a => a.value).sort();
  const expected = (expectedValues || []).sort();

  if (JSON.stringify(actualValues) !== JSON.stringify(expected)) {
    throw new Error(
      `Question type "${this.group}" must have option values ${expected.join(' and ')}, got ${actualValues.join(' and ')}`,
    );
  }
});

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
    instructions: {
      type: String,
      maxlength: [1000, 'Instructions cannot exceed 1000 characters'],
    },
    questions: {
      type: [QuestionSchema],
      required: [true, 'Questions are required'],
      validate: {
        validator: function (questions: IQuestion[]) {
          return questions.length > 0;
        },
        message: 'Assessment must have at least one question',
      },
    },
    published: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Index for querying published assessments
 */
AssessmentSchema.index({ published: 1 });

/**
 * Static method: Get question count by group
 * Usage: const counts = await assessment.getQuestionCounts()
 * Returns: { EI: 20, SN: 18, TF: 16, JP: 16 }
 */
AssessmentSchema.methods.getQuestionCounts = function () {
  const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };

  this.questions.forEach((q: IQuestion) => {
    counts[q.group]++;
  });

  return counts;
};

/**
 * Static method: Calculate personality type from answers
 * Usage: const result = Assessment.calculateResult(["E", "I", "N", ...])
 *
 * @param answers - Array of answer values (e.g., ["E", "I", "N", "S", ...])
 * @param questionCounts - Number of questions per type { EI: 20, SN: 18, ... }
 * @returns Scores and personality type
 */
AssessmentSchema.statics.calculateResult = function (
  answers: string[],
  questionCounts: { EI: number; SN: number; TF: number; JP: number },
) {
  // Count occurrences of each letter
  const counts = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  answers.forEach(value => {
    if (value in counts) {
      counts[value as keyof typeof counts]++;
    }
  });

  // Calculate percentages

  const scores = {
    extrovert: Math.round((counts.E / questionCounts.EI) * 100),
    introvert: Math.round((counts.I / questionCounts.EI) * 100),
    sensory: Math.round((counts.S / questionCounts.SN) * 100),
    intuitive: Math.round((counts.N / questionCounts.SN) * 100),
    thinking: Math.round((counts.T / questionCounts.TF) * 100),
    feeling: Math.round((counts.F / questionCounts.TF) * 100),
    judging: Math.round((counts.J / questionCounts.JP) * 100),
    perceiving: Math.round((counts.P / questionCounts.JP) * 100),
  };

  // Determine personality type (take the higher percentage for each dimension)
  const type = [
    scores.extrovert >= scores.introvert ? 'E' : 'I',
    scores.sensory >= scores.intuitive ? 'S' : 'N',
    scores.thinking >= scores.feeling ? 'T' : 'F',
    scores.judging >= scores.perceiving ? 'J' : 'P',
  ].join('');

  // Calculate alternative types (flip close dimensions)
  const alternatives = getAlternativeTypes(scores, type);

  return {
    scores,
    personalityType: type,
    alternativeType1: alternatives[0] || null,
    alternativeType2: alternatives[1] || null,
  };
};

/**
 * Helper: Calculate alternative personality types
 * If a dimension is close (e.g., 48% vs 52%), suggest alternative type
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAlternativeTypes(scores: any, primaryType: string): string[] {
  const dimensions = [
    { pair: ['extrovert', 'introvert'], letters: ['E', 'I'], index: 0 },
    { pair: ['sensory', 'intuitive'], letters: ['S', 'N'], index: 1 },
    { pair: ['thinking', 'feeling'], letters: ['T', 'F'], index: 2 },
    { pair: ['judging', 'perceiving'], letters: ['J', 'P'], index: 3 },
  ];

  const alternatives: string[] = [];
  const closeThreshold = 20; // If difference < 20%, consider it "close"

  // Find dimensions with close scores
  const closeDimensions = dimensions.filter(dim => {
    const [trait1, trait2] = dim.pair;
    const diff = Math.abs(scores[trait1] - scores[trait2]);
    return diff < closeThreshold;
  });

  // Generate alternative types by flipping close dimensions
  closeDimensions.slice(0, 2).forEach(dim => {
    const typeArray = primaryType.split('');
    const currentLetter = typeArray[dim.index];
    const alternateLetter = dim.letters.find(l => l !== currentLetter);

    if (alternateLetter) {
      typeArray[dim.index] = alternateLetter;
      alternatives.push(typeArray.join(''));
    }
  });

  return alternatives;
}

const Assessment = (mongoose.models.Assessment ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mongoose.model<IAssessment, any>(
    'Assessment',
    AssessmentSchema,
  )) as Model<IAssessment> & IAssessmentStatics;

export default Assessment;
