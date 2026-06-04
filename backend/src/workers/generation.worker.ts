import { Worker, Job } from "bullmq";
import { redisConnectionOptions } from "../config/redis";
import { QUEUE_NAME } from "../config/bullmq";
import { Assignment } from "../models/Assignment";
import { GeneratedPaper } from "../models/GeneratedPaper";
import { broadcast } from "../websocket/handler";
import { logger } from "../utils/logger";
import type { GenerationJobData } from "../types";
import { buildGenerationPrompt } from "../services/prompt.service";
import { generateQuestionPaper } from "../services/ai.service";
import fs from "fs/promises";
import path from "path";

/**
 * Initialize the BullMQ worker for processing AI question generation jobs.
 */
export const initGenerationWorker = (): Worker => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<GenerationJobData>) => {
      const { assignmentId } = job.data;

      logger.info(`Processing job ${job.id} for assignment ${assignmentId}`);

      // Notify: generation started
      broadcast({
        event: "generation:started",
        data: { assignmentId, jobId: job.id || "" },
      });

      try {
        // Fetch Assignment
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
          throw new Error(`Assignment not found: ${assignmentId}`);
        }

        // Update status
        assignment.status = "processing";
        assignment.jobId = job.id;
        await assignment.save();

        await job.updateProgress(20);
        broadcast({
          event: "generation:progress",
          data: {
            assignmentId,
            progress: 20,
            message: "Analyzing assignment requirements...",
          },
        });

        // Handle uploaded file if present
        let fileText: string | undefined = undefined;
        let fileData: { mimeType: string; data: string } | undefined = undefined;

        if (assignment.uploadedFile) {
          await job.updateProgress(30);
          broadcast({
            event: "generation:progress",
            data: {
              assignmentId,
              progress: 30,
              message: "Processing reference material...",
            },
          });

          // Uploaded files are typically stored in the 'uploads' directory
          const filePath = assignment.uploadedFile.filePath;

          try {
            if (assignment.uploadedFile.fileType === "text/plain") {
              // Read text file directly into prompt
              fileText = await fs.readFile(filePath, "utf-8");
            } else {
              // Read image/pdf as base64 for inlineData
              const base64Data = await fs.readFile(filePath, "base64");
              fileData = {
                mimeType: assignment.uploadedFile.fileType,
                data: base64Data,
              };
            }
          } catch (err: any) {
            logger.error(`Failed to read uploaded file: ${err.message}`);
            // We can choose to fail the job or proceed without the file. We'll fail it.
            throw new Error(`Failed to read uploaded reference material: ${err.message}`);
          }
        }

        // Construct Prompt
        await job.updateProgress(50);
        broadcast({
          event: "generation:progress",
          data: {
            assignmentId,
            progress: 50,
            message: "Constructing AI prompt...",
          },
        });

        const prompt = buildGenerationPrompt(assignment, fileText);

        // Call Gemini
        await job.updateProgress(60);
        broadcast({
          event: "generation:progress",
          data: {
            assignmentId,
            progress: 60,
            message: "Generating questions with Gemini AI...",
          },
        });

        const generatedData = await generateQuestionPaper(prompt, fileData);

        // Structure generated paper
        await job.updateProgress(90);
        broadcast({
          event: "generation:progress",
          data: {
            assignmentId,
            progress: 90,
            message: "Structuring question paper...",
          },
        });

        const paper = await GeneratedPaper.create({
          assignmentId,
          header: {
            ...generatedData.header,
            // Override with actual db values to ensure accuracy
            subject: assignment.subject,
            className: assignment.className,
            maximumMarks: assignment.totalMarks,
          },
          sections: generatedData.sections,
          totalQuestions: assignment.totalQuestions,
          totalMarks: assignment.totalMarks,
          rawAIResponse: JSON.stringify(generatedData),
        });

        // Update assignment
        assignment.status = "completed";
        assignment.generatedPaper = paper._id as any;
        await assignment.save();

        // Notify completion
        await job.updateProgress(100);
        broadcast({
          event: "generation:completed",
          data: {
            assignmentId,
            paperId: paper._id.toString(),
          },
        });

        logger.success(
          `Generation completed for assignment ${assignmentId} | Paper: ${paper._id}`
        );

        return { paperId: paper._id.toString() };
      } catch (error) {
        const attemptsMade = job.attemptsMade;
        const maxAttempts = job.opts.attempts || 1;

        if (attemptsMade >= maxAttempts) {
          // Update assignment status to failed
          await Assignment.findByIdAndUpdate(assignmentId, {
            status: "failed",
          });

          // Notify failure
          broadcast({
            event: "generation:failed",
            data: {
              assignmentId,
              error: error instanceof Error ? error.message : "Unknown error occurred",
            },
          });
        } else {
          logger.warn(`Job ${job.id} failed attempt ${attemptsMade}/${maxAttempts}. Retrying...`);
          broadcast({
            event: "generation:progress",
            data: {
              assignmentId,
              progress: 40,
              message: `Attempt ${attemptsMade} failed. Retrying... (${error instanceof Error ? error.message : "AI generation issue"})`,
            },
          });
        }

        throw error;
      }
    },
    {
      connection: redisConnectionOptions,
      concurrency: 1, // Gemini rate limits might be an issue, keep concurrency low
    }
  );

  worker.on("completed", (job) => {
    logger.success(`Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
  });

  logger.success("Generation worker initialized");
  return worker;
};
