import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import LibraryDocument from "../models/LibraryDocument";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new AppError("No files uploaded", 400);
    }

    const savedDocuments = [];

    for (const file of req.files) {
      const newDoc = await LibraryDocument.create({
        userId,
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size,
      });
      savedDocuments.push(newDoc);
    }

    logger.info(`User ${userId} uploaded ${savedDocuments.length} documents to library`);

    res.status(201).json({
      success: true,
      data: savedDocuments,
    });
  } catch (error) {
    next(error);
  }
};

export const listDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const documents = await LibraryDocument.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { id } = req.params;

    const document = await LibraryDocument.findOne({ _id: id, userId });
    if (!document) {
      throw new AppError("Document not found", 404);
    }

    // Try deleting physical file, but don't fail if it doesn't exist
    try {
      await fs.unlink(document.filePath);
    } catch (err) {
      logger.warn(`Could not delete file ${document.filePath}: `, err);
    }

    await LibraryDocument.deleteOne({ _id: id });

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
