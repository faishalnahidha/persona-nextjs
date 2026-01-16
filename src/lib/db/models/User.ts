import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * TypeScript Interface - Defines the shape of a User document
 * This is like a contract that tells TypeScript what fields exist
 */
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema - Defines the structure and validation rules
 * Think of this as the "shape" of documents in the 'users' collection
 *
 * Compare to your Meteor code:
 * - Meteor: You just inserted data, checked types manually with check()
 * - Mongoose: Schema enforces types automatically
 */
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Important Pattern: Check if model already exists before creating
 *
 * Why? In development with hot reload:
 * - Without this check: "Cannot overwrite 'User' model" error
 * - With this check: Reuse existing model, or create if first time
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
