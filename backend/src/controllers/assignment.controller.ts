import { Request, Response, NextFunction } from "express";
import { Assignment } from "../models/Assignment";
import { GeneratedPaper } from "../models/GeneratedPaper";
import { getGenerationQueue } from "../config/bullmq";
import { AppError } from "../middleware/errorHandler";
import { listAssignmentsQuerySchema } from "../validators/assignment.validator";
import type { CreateAssignmentInput } from "../validators/assignment.validator";
import type { GenerationJobData } from "../types";
import { logger } from "../utils/logger";

/**
 * POST /api/assignments
 * Create a new assignment and enqueue AI generation job
 */
export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body as CreateAssignmentInput;

    // Calculate totals
    const totalQuestions = data.questionTypes.reduce(
      (sum, qt) => sum + qt.numberOfQuestions,
      0
    );
    const totalMarks = data.questionTypes.reduce(
      (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion,
      0
    );

    // Handle uploaded file info if present (from frontend JSON body)
    const uploadedFile = data.uploadedFile || undefined;

    // Create assignment in DB
    const assignment = await Assignment.create({
      ...data,
      dueDate: new Date(data.dueDate),
      totalQuestions,
      totalMarks,
      uploadedFile,
      status: "pending",
    });

    // Enqueue BullMQ job
    const jobData: GenerationJobData = {
      assignmentId: assignment._id.toString(),
      title: data.title,
      subject: data.subject,
      className: data.className,
      schoolName: data.schoolName || "",
      timeAllowed: data.timeAllowed,
      questionTypes: data.questionTypes,
      totalQuestions,
      totalMarks,
      additionalInstructions: data.additionalInstructions,
      uploadedFilePath: uploadedFile?.filePath,
    };

    const queue = getGenerationQueue();
    const job = await queue.add("generate-questions", jobData, {
      jobId: `gen-${assignment._id.toString()}`,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    });

    // Update assignment with job ID
    assignment.jobId = job.id;
    assignment.status = "processing";
    await assignment.save();

    logger.success(
      `Assignment created: ${assignment._id} | Job queued: ${job.id}`
    );

    res.status(201).json({
      success: true,
      data: assignment,
      jobId: job.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assignments
 * List all assignments with pagination and search
 */
export const listAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = listAssignmentsQuerySchema.parse(req.query);
    const { page, limit, search, status } = query;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (search) {
      const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); // Escape regex special chars
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { subject: { $regex: escapedSearch, $options: "i" } },
        { className: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [assignments, total] = await Promise.all([
      Assignment.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Assignment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        assignments,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assignments/:id
 * Get a single assignment with its generated paper
 */
export const getAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id).lean();
    if (!assignment) {
      throw new AppError("Assignment not found", 404);
    }

    // Fetch generated paper if available
    let generatedPaper = null;
    if (assignment.generatedPaper) {
      generatedPaper = await GeneratedPaper.findById(
        assignment.generatedPaper
      ).lean();
    }

    res.json({
      success: true,
      data: {
        assignment,
        generatedPaper,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/assignments/:id
 * Delete an assignment and its generated paper
 */
export const deleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      throw new AppError("Assignment not found", 404);
    }

    // Delete generated paper if exists
    if (assignment.generatedPaper) {
      await GeneratedPaper.findByIdAndDelete(assignment.generatedPaper);
    }

    await Assignment.findByIdAndDelete(id);

    logger.info(`Assignment deleted: ${id}`);

    res.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/assignments/:id/regenerate
 * Re-trigger AI generation for an existing assignment
 */
export const regenerateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      throw new AppError("Assignment not found", 404);
    }

    // Delete old generated paper
    if (assignment.generatedPaper) {
      await GeneratedPaper.findByIdAndDelete(assignment.generatedPaper);
      assignment.generatedPaper = undefined;
    }

    // Re-enqueue generation job
    const jobData: GenerationJobData = {
      assignmentId: assignment._id.toString(),
      title: assignment.title,
      subject: assignment.subject,
      className: assignment.className,
      schoolName: assignment.schoolName,
      timeAllowed: assignment.timeAllowed,
      questionTypes: assignment.questionTypes,
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks,
      additionalInstructions: assignment.additionalInstructions,
      uploadedFilePath: assignment.uploadedFile?.filePath,
    };

    const queue = getGenerationQueue();
    const job = await queue.add("generate-questions", jobData, {
      jobId: `regen-${assignment._id.toString()}-${Date.now()}`,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 3000,
      },
    });

    assignment.jobId = job.id;
    assignment.status = "processing";
    await assignment.save();

    logger.info(
      `Regeneration triggered for assignment: ${id} | Job: ${job.id}`
    );

    res.json({
      success: true,
      data: assignment,
      jobId: job.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/upload
 * Handle file upload (returns file metadata)
 */
export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }

    const fileInfo = {
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    };

    logger.info(`File uploaded: ${fileInfo.fileName} (${fileInfo.fileSize} bytes)`);

    res.json({
      success: true,
      data: fileInfo,
    });
  } catch (error) {
    next(error);
  }
};
