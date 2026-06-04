import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { getImageKitAuthParams } from "../services/imagekit.service";
import { logger } from "../utils/logger";

/**
 * PATCH /api/users/profile
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, profileImageUrl, schoolName, schoolAddress, schoolProfile } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(profileImageUrl !== undefined && { profileImageUrl }),
        ...(schoolName !== undefined && { schoolName }),
        ...(schoolAddress !== undefined && { schoolAddress }),
        ...(schoolProfile !== undefined && { schoolProfile }),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) throw new AppError("User not found.", 404);

    logger.info(`Profile updated for user: ${updatedUser.email}`);

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl,
        schoolName: updatedUser.schoolName,
        schoolAddress: updatedUser.schoolAddress,
        schoolProfile: updatedUser.schoolProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/imagekit-auth
 */
export const getImageKitAuth = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authParams = getImageKitAuthParams();
    res.json({ success: true, ...authParams });
  } catch (error) {
    next(error);
  }
};
