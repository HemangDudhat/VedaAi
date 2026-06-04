import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateOTP,
  sendOTPEmail,
} from "../services/auth.service";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * POST /api/auth/signup
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      isVerified: true,
    });

    const token = generateToken(user._id.toString());
    res.cookie("token", token, COOKIE_OPTIONS);

    logger.info(`New user signup: ${email}`);

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        schoolName: user.schoolName,
        schoolAddress: user.schoolAddress,
        schoolProfile: user.schoolProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 */
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+otp +otpExpiresAt"
    );
    if (!user) throw new AppError("No account found with this email.", 404);
    if (user.isVerified) throw new AppError("Email is already verified.", 400);
    if (!user.otp || !user.otpExpiresAt)
      throw new AppError("No OTP found. Please request a new one.", 400);
    if (user.otp !== otp) throw new AppError("Invalid OTP.", 400);
    if (user.otpExpiresAt < new Date())
      throw new AppError("OTP has expired. Please request a new one.", 400);

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = generateToken(user._id.toString());
    res.cookie("token", token, COOKIE_OPTIONS);

    logger.success(`User verified: ${email}`);

    res.json({
      success: true,
      message: "Email verified successfully!",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        schoolName: user.schoolName,
        schoolAddress: user.schoolAddress,
        schoolProfile: user.schoolProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-otp
 */
export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new AppError("No account found with this email.", 404);
    if (user.isVerified) throw new AppError("Email is already verified.", 400);

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({ success: true, message: "OTP resent to your email." });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    if (!user) throw new AppError("Invalid email or password.", 401);

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) throw new AppError("Invalid email or password.", 401);



    const token = generateToken(user._id.toString());
    res.cookie("token", token, COOKIE_OPTIONS);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        schoolName: user.schoolName,
        schoolAddress: user.schoolAddress,
        schoolProfile: user.schoolProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
    res.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).lean();
    if (!user) throw new AppError("User not found.", 404);

    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        schoolName: user.schoolName,
        schoolAddress: user.schoolAddress,
        schoolProfile: user.schoolProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};
