/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Unified User Model
 * Handles both guest users and registered users in one collection
 *
 * Guest users: Created when taking assessment without account
 * Registered users: Created during registration (can link to existing guest data)
 */
export interface IUser extends Document {
  // User Type
  userType: 'guest' | 'registered';

  // Basic Info (for registered users)
  email?: string;
  password?: string;
  username?: string;
  name: string;

  // Profile
  profilePicture?: string;
  personalityType?: string; // e.g., "INFJ" (from latest assessment)

  // Role & Status
  role: 'user' | 'admin';
  isActive: boolean;

  // Gamification
  totalPoints: number;
  pointsHistory: Array<{
    points: number;
    reason: string; // e.g., "daily_login", "read_content", "complete_assessment"
    contentId?: string; // If related to content
    timestamp: Date;
  }>;
  lastLoginDate?: Date;

  // Content Reading Progress
  contentProgress: Array<{
    contentId: string; // Reference to Content slug
    contentType: 'public' | 'locked';
    startedAt: Date;
    completedAt?: Date;
    timeSpent: number; // In seconds
    pointsAwarded: boolean; // Whether user got points for this content
  }>;

  // Guest-to-Registered Conversion
  convertedToRegisteredAt?: Date; // When guest became registered user

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userType: {
      type: String,
      enum: {
        values: ['guest', 'registered'],
        message: '{VALUE} is not a valid user type',
      },
      required: true,
      default: 'guest',
    },
    email: {
      type: String,
      sparse: true, // Allows multiple null values (for guest users)
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    username: {
      type: String,
      sparse: true, // Allows multiple null values (for guest users)
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    profilePicture: {
      type: String,
    },
    personalityType: {
      type: String,
      uppercase: true,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    pointsHistory: [
      {
        points: { type: Number, required: true },
        reason: { type: String, required: true },
        contentId: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lastLoginDate: {
      type: Date,
    },
    contentProgress: [
      {
        contentId: { type: String, required: true },
        contentType: {
          type: String,
          enum: ['public', 'locked'],
          required: true,
        },
        startedAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
        timeSpent: { type: Number, default: 0 }, // seconds
        pointsAwarded: { type: Boolean, default: false },
      },
    ],
    convertedToRegisteredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for fast queries
 */
UserSchema.index({ email: 1 }, { sparse: true }); // Find by email (registered users)
UserSchema.index({ username: 1 }, { sparse: true }); // Find by username
UserSchema.index({ userType: 1, isActive: 1 }); // Filter users by type
UserSchema.index({ personalityType: 1 }); // Group by personality type
UserSchema.index({ totalPoints: -1 }); // Leaderboard queries

/**
 * Validation: Registered users must have email, password, and username
 */
UserSchema.pre('save', async function () {
  if (this.userType === 'registered') {
    if (!this.email) {
      throw new Error('Registered users must have an email');
    }
    if (!this.password) {
      throw new Error('Registered users must have a password');
    }
    if (!this.username) {
      throw new Error('Registered users must have a username');
    }
  }
  // No next() needed; if it finishes without throwing, it proceeds
});

/**
 * Method: Award points to user
 * Usage: await user.awardPoints(100, 'read_content', 'infj/kelebihan-alami')
 */
UserSchema.methods.awardPoints = async function (
  points: number,
  reason: string,
  contentId?: string
) {
  this.totalPoints += points;
  this.pointsHistory.push({
    points,
    reason,
    contentId,
    timestamp: new Date(),
  });

  return await this.save();
};

/**
 * Method: Mark content as started
 */
UserSchema.methods.startContent = async function (
  contentId: string,
  contentType: 'public' | 'private'
) {
  const existingProgress = this.contentProgress.find(
    (cp: any) => cp.contentId === contentId
  );

  if (!existingProgress) {
    this.contentProgress.push({
      contentId,
      contentType,
      startedAt: new Date(),
      timeSpent: 0,
      pointsAwarded: false,
    });

    await this.save();
  }

  return (
    existingProgress || this.contentProgress[this.contentProgress.length - 1]
  );
};

/**
 * Method: Mark content as completed and award points
 */
UserSchema.methods.completeContent = async function (
  contentId: string,
  timeSpent: number,
  readPoints: number
) {
  const progress = this.contentProgress.find(
    (cp: any) => cp.contentId === contentId
  );

  if (!progress) {
    throw new Error('Content not started yet');
  }

  // Only award points if not already awarded
  if (!progress.pointsAwarded) {
    progress.completedAt = new Date();
    progress.timeSpent = timeSpent;
    progress.pointsAwarded = true;

    await this.awardPoints(readPoints, 'read_content', contentId);
  }

  return await this.save();
};

/**
 * Method: Check if user has read content
 */
UserSchema.methods.hasReadContent = function (contentId: string): boolean {
  const progress = this.contentProgress.find(
    (cp: any) => cp.contentId === contentId
  );

  return progress ? progress.pointsAwarded : false;
};

/**
 * Method: Convert guest to registered user
 */
UserSchema.methods.convertToRegistered = async function (
  email: string,
  password: string,
  username: string,
  registerPoints: number
) {
  if (this.userType === 'registered') {
    throw new Error('User is already registered');
  }

  this.userType = 'registered';
  this.email = email;
  this.password = password;
  this.username = username;
  this.convertedToRegisteredAt = new Date();

  // Award registration points
  await this.awardPoints(registerPoints, 'registration');

  return await this.save();
};

/**
 * Method: Award daily login points (only once per day)
 */
UserSchema.methods.awardDailyLogin = async function (dailyLoginPoints: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastLogin = this.lastLoginDate ? new Date(this.lastLoginDate) : null;
  if (lastLogin) {
    lastLogin.setHours(0, 0, 0, 0);
  }

  // Only award if last login was before today
  if (!lastLogin || lastLogin.getTime() < today.getTime()) {
    this.lastLoginDate = new Date();
    await this.awardPoints(dailyLoginPoints, 'daily_login');
    return true; // Points awarded
  }

  return false; // Already logged in today
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
