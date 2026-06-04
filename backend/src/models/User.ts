import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isVerified: boolean;
  profileImageUrl?: string;
  schoolName?: string;
  schoolAddress?: string;
  schoolProfile?: string;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends Omit<IUser, "_id">, Document {}

const userSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    profileImageUrl: { type: String, default: undefined },
    schoolName: { type: String, default: undefined, trim: true },
    schoolAddress: { type: String, default: undefined, trim: true },
    schoolProfile: { type: String, default: undefined, trim: true },
    otp: { type: String, default: undefined, select: false },
    otpExpiresAt: { type: Date, default: undefined, select: false },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

export const User = mongoose.model<UserDocument>("User", userSchema);
