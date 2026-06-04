import mongoose, { Schema, Document } from "mongoose";
import type {
  IAssignment,
  QuestionTypeConfig,
  UploadedFileInfo,
  AssignmentStatus,
} from "../types";

// --- Sub-schemas ---
const questionTypeConfigSchema = new Schema<QuestionTypeConfig>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "mcq",
        "short",
        "long",
        "true_false",
        "fill_blanks",
        "diagram",
        "numerical",
      ],
    },
    label: { type: String, required: true },
    numberOfQuestions: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const uploadedFileSchema = new Schema<UploadedFileInfo>(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
  },
  { _id: false }
);

// --- Main Assignment Schema ---
export interface AssignmentDocument extends Omit<IAssignment, "_id">, Document {}

const assignmentSchema = new Schema<AssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    schoolName: {
      type: String,
      default: "",
      trim: true,
    },
    timeAllowed: {
      type: String,
      required: [true, "Time allowed is required"],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    questionTypes: {
      type: [questionTypeConfigSchema],
      required: true,
      validate: {
        validator: (v: QuestionTypeConfig[]) => v.length > 0,
        message: "At least one question type is required",
      },
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: [1, "Total questions must be at least 1"],
    },
    totalMarks: {
      type: Number,
      required: true,
      min: [1, "Total marks must be at least 1"],
    },
    additionalInstructions: {
      type: String,
      default: "",
      maxlength: [2000, "Additional instructions cannot exceed 2000 characters"],
    },
    uploadedFile: {
      type: uploadedFileSchema,
      default: undefined,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"] as AssignmentStatus[],
      default: "pending",
    },
    jobId: {
      type: String,
      default: undefined,
    },
    generatedPaper: {
      type: Schema.Types.ObjectId,
      ref: "GeneratedPaper",
      default: undefined,
    },
  },
  {
    timestamps: true, // Auto createdAt & updatedAt
  }
);

// --- Indexes ---
assignmentSchema.index({ status: 1 });
assignmentSchema.index({ createdAt: -1 });
assignmentSchema.index({ title: "text" });

export const Assignment = mongoose.model<AssignmentDocument>(
  "Assignment",
  assignmentSchema
);
