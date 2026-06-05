// ========================
// Shared TypeScript Types
// ========================

// --- Question Type Enum ---
export type QuestionTypeEnum =
  | "mcq"
  | "short"
  | "long"
  | "true_false"
  | "fill_blanks"
  | "diagram"
  | "numerical";

export const QUESTION_TYPE_LABELS: Record<QuestionTypeEnum, string> = {
  mcq: "Multiple Choice Questions",
  short: "Short Questions",
  long: "Long Answer Questions",
  true_false: "True/False",
  fill_blanks: "Fill in the Blanks",
  diagram: "Diagram/Graph-Based Questions",
  numerical: "Numerical Problems",
};

// --- Difficulty ---
export type DifficultyLevel = "easy" | "moderate" | "hard";

// --- Assignment Status ---
export type AssignmentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

// --- Question Type Config (form input) ---
export interface QuestionTypeConfig {
  type: QuestionTypeEnum;
  label: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

// --- Uploaded File Info ---
export interface UploadedFileInfo {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}

// --- Assignment (document shape) ---
export interface IAssignment {
  _id?: string;
  userId: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  timeAllowed: string;
  dueDate: Date;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  uploadedFiles?: UploadedFileInfo[];
  status: AssignmentStatus;
  jobId?: string;
  generatedPaper?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Generated Paper Types ---
export interface GeneratedQuestion {
  questionNumber: number;
  text: string;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[]; // For MCQs
  answer?: string;
}

export interface PaperSection {
  title: string;
  sectionType: string;
  instructions: string;
  questions: GeneratedQuestion[];
}

export interface PaperHeader {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstructions: string;
}

export interface IGeneratedPaper {
  _id?: string;
  assignmentId: string;
  header: PaperHeader;
  sections: PaperSection[];
  totalQuestions: number;
  totalMarks: number;
  rawAIResponse?: string;
  createdAt: Date;
}

// --- API Request/Response Types ---
export interface CreateAssignmentRequest {
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  timeAllowed: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInstructions?: string;
}

export interface AssignmentListResponse {
  assignments: IAssignment[];
  total: number;
  page: number;
  limit: number;
}

// --- WebSocket Event Types ---
export type WSEventType =
  | "generation:started"
  | "generation:progress"
  | "generation:completed"
  | "generation:failed";

export interface WSMessage {
  event: WSEventType;
  data: {
    assignmentId: string;
    jobId?: string;
    progress?: number;
    message?: string;
    paperId?: string;
    error?: string;
  };
}

// --- Job Data (BullMQ) ---
export interface GenerationJobData {
  assignmentId: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  timeAllowed: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  uploadedFiles?: UploadedFileInfo[];
}
