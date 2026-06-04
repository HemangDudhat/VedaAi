import mongoose, { Schema, Document } from "mongoose";
import type {
  IGeneratedPaper,
  PaperHeader,
  PaperSection,
  GeneratedQuestion,
  DifficultyLevel,
} from "../types";

// --- Sub-schemas ---
const generatedQuestionSchema = new Schema<GeneratedQuestion>(
  {
    questionNumber: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "moderate", "hard"] as DifficultyLevel[],
    },
    marks: { type: Number, required: true, min: 1 },
    options: { type: [String], default: undefined }, // For MCQs
    answer: { type: String, default: undefined },
  },
  { _id: false }
);

const paperSectionSchema = new Schema<PaperSection>(
  {
    title: { type: String, required: true }, // "Section A"
    sectionType: { type: String, required: true }, // "Short Answer Questions"
    instructions: { type: String, required: true },
    questions: {
      type: [generatedQuestionSchema],
      required: true,
    },
  },
  { _id: false }
);

const paperHeaderSchema = new Schema<PaperHeader>(
  {
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maximumMarks: { type: Number, required: true },
    generalInstructions: { type: String, required: true },
  },
  { _id: false }
);

// --- Main Generated Paper Schema ---
export interface GeneratedPaperDocument
  extends Omit<IGeneratedPaper, "_id">,
    Document {}

const generatedPaperSchema = new Schema<GeneratedPaperDocument>(
  {
    assignmentId: {
      type: String,
      ref: "Assignment",
      required: true,
      index: true,
    },
    header: {
      type: paperHeaderSchema,
      required: true,
    },
    sections: {
      type: [paperSectionSchema],
      required: true,
      validate: {
        validator: (v: PaperSection[]) => v.length > 0,
        message: "At least one section is required",
      },
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    rawAIResponse: {
      type: String,
      default: undefined,
      select: false, // Don't include in queries by default (for performance)
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const GeneratedPaper = mongoose.model<GeneratedPaperDocument>(
  "GeneratedPaper",
  generatedPaperSchema
);
