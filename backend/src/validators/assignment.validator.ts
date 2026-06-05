import { z } from "zod";

// --- Validation: Create Assignment ---
export const createAssignmentSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  subject: z.string().min(1, "Subject is required"),
  className: z.string().min(1, "Class is required"),
  schoolName: z.string().optional().default(""),
  timeAllowed: z.string().min(1, "Time allowed is required"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Invalid date format"
    ),
  questionTypes: z
    .array(
      z.object({
        type: z.enum([
          "mcq",
          "short",
          "long",
          "true_false",
          "fill_blanks",
          "diagram",
          "numerical",
        ]),
        label: z.string().min(1),
        numberOfQuestions: z.number().int().min(1, "Must have at least 1 question"),
        marksPerQuestion: z.number().int().min(1, "Marks must be at least 1"),
      })
    )
    .min(1, "At least one question type is required"),
  additionalInstructions: z
    .string()
    .max(2000, "Instructions cannot exceed 2000 characters")
    .optional()
    .default(""),
  uploadedFiles: z
    .array(
      z.object({
        fileName: z.string(),
        filePath: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
        pageRange: z
          .object({
            start: z.number().optional(),
            end: z.number().optional(),
          })
          .optional(),
      })
    )
    .max(5, "Maximum 5 files allowed")
    .optional()
    .default([]),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

// --- Validation: Query Params ---
export const listAssignmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z
    .enum(["pending", "processing", "completed", "failed"])
    .optional(),
});
