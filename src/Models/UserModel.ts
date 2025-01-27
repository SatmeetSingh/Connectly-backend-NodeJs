import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  userName: string;
  email: string;
  password: string;
  profilePicture: string;
  Bio: string;
  gender: string;
  followers: string[];
  following: string[];
  followersCount: number;
  followingCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: { type: String, default: null },
    Bio: { type: String, maxlength: 800 },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'other', 'prefer not to say'],
      default: 'prefer not to say',
    },
    followers: { type: [String], default: [] },
    following: { type: [String], default: [] },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1, isActive: 1 });

const User = mongoose.model('User', userSchema);

export default User;
