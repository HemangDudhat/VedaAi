// ========================
// Frontend TypeScript Types
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

export const QUESTION_TYPE_OPTIONS: {
  value: QuestionTypeEnum;
  label: string;
}[] = [
  { value: "mcq", label: "Multiple Choice Questions" },
  { value: "short", label: "Short Questions" },
  { value: "long", label: "Long Answer Questions" },
  { value: "true_false", label: "True/False" },
  { value: "fill_blanks", label: "Fill in the Blanks" },
  { value: "diagram", label: "Diagram/Graph-Based Questions" },
  { value: "numerical", label: "Numerical Problems" },
];

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

// --- Assignment ---
export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  uploadedFiles?: UploadedFileInfo[];
  status: AssignmentStatus;
  jobId?: string;
  generatedPaper?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Generated Paper ---
export interface GeneratedQuestion {
  questionNumber: number;
  text: string;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[];
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

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  header: PaperHeader;
  sections: PaperSection[];
  totalQuestions: number;
  totalMarks: number;
  createdAt: string;
}

// --- API Responses ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface AssignmentListData {
  assignments: Assignment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- WebSocket Events ---
export type WSEventType =
  | "connection:established"
  | "generation:started"
  | "generation:progress"
  | "generation:completed"
  | "generation:failed";

export interface WSMessage {
  event: WSEventType;
  data: {
    assignmentId?: string;
    jobId?: string;
    progress?: number;
    message?: string;
    paperId?: string;
    error?: string;
  };
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
