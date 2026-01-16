import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Unified Content Model
 *
 * Handles three types of content:
 * 1. "personality-main" - Main personality type article (e.g., "ESTJ - The Supervisor")
 * 2. "personality-sub" - Sub-articles for personality types (e.g., "Kelebihan Alami")
 * 3. "general" - Standalone articles (e.g., "What is MBTI?")
 */
export interface IContent extends Document {
  // Basic Info
  title: string;
  slug: string; // URL-friendly (e.g., "estj", "estj/kelebihan-alami")

  // Content Type
  contentType: 'personality-main' | 'personality-sub' | 'general';
  category: string; // grouping for top level content navigation

  // Content Body
  subtitle?: string; // Sentence before body
  overview?: string; // Some paragraphs before body
  body: string; // HTML from WYSIWYG, main long contents
  excerpt?: string; // Preview text for cards

  // Personality-Specific Fields
  personalityId?: string; // e.g., "ESTJ" (for both main and sub articles)
  personalityName?: string; // e.g., "The Supervisor"
  personalityGroup?: string; // e.g., "SJ"

  // Navigation (for personality-sub articles)
  parentId?: mongoose.Types.ObjectId; // Reference to main personality article
  order?: number; // For sequential reading (1, 2, 3...)

  // Access Control
  isLocked: boolean; // false = free (guest), true = registered users only

  // Media
  mainImage?: string; // Image filename or URL

  // Metadata
  author: string; // Author name or ID
  published: boolean;
  minimumReadTime?: number; // In seconds

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-/]+$/,
        'Slug can only contain lowercase letters, numbers, hyphens, and slashes',
      ],
    },
    contentType: {
      type: String,
      enum: {
        values: ['personality-main', 'personality-sub', 'general'],
        message: '{VALUE} is not a valid content type',
      },
      required: [true, 'Content type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Introduction', 'personality color', 'personality types'],
        message: '{VALUE} is not a valid category',
      },
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    overview: {
      type: String,
      maxlength: [2000, 'Overview cannot exceed 2000 characters'],
    },
    body: {
      type: String,
      required: [true, 'Content body is required'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    personalityId: {
      type: String,
      uppercase: true,
      trim: true,
    },
    personalityName: {
      type: String,
      trim: true,
    },
    personalityGroup: {
      type: String,
      uppercase: true,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
    },
    order: {
      type: Number,
      min: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    mainImage: {
      type: String,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    minimumReadTime: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for fast queries
 */
ContentSchema.index({ slug: 1 });
ContentSchema.index({ personalityId: 1, contentType: 1 });
ContentSchema.index({ contentType: 1, published: 1 });
ContentSchema.index({ category: 1, published: 1 });
ContentSchema.index({ parentId: 1, order: 1 });

/**
 * Validation: personality-sub articles must have parentId and order
 */
ContentSchema.pre<IContent>('save', async function () {
  if (this.contentType === 'personality-sub') {
    if (!this.parentId) {
      throw new Error('Sub-articles must have a parentId');
    }
    if (this.order === undefined || this.order === null) {
      throw new Error('Sub-articles must have an order');
    }
  }

  // personality-related content must have personalityId
  if (this.contentType !== 'general' && !this.personalityId) {
    throw new Error('Personality content must have personalityId');
  }
});

/**
 * Virtual: Calculate prev/next articles dynamically
 * Usage: await content.getNavigation()
 */
ContentSchema.methods.getNavigation = async function () {
  if (this.contentType !== 'personality-sub' || !this.parentId) {
    return { prev: null, next: null };
  }

  const siblings = await Content.find({
    parentId: this.parentId,
    published: true,
  })
    .sort({ order: 1 })
    .select('_id title slug order')
    .lean();

  const currentIndex = siblings.findIndex(
    s => s._id.toString() === this._id.toString()
  );

  return {
    prev: currentIndex > 0 ? siblings[currentIndex - 1] : null,
    next:
      currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null,
    allSiblings: siblings,
  };
};

/**
 * Virtual: Word count
 */
ContentSchema.virtual('wordCount').get(function () {
  const text = this.body.replace(/<[^>]*>/g, '');
  return text.split(/\s+/).filter(word => word.length > 0).length;
});

ContentSchema.set('toJSON', { virtuals: true });
ContentSchema.set('toObject', { virtuals: true });

const Content: Model<IContent> =
  mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
