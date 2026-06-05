import { create } from "zustand";
import type { QuestionTypeConfig } from "@/types";

interface CreateFormState {
  // Step 1: Upload
  files: File[];
  
  // Step 2: Details
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  timeAllowed: string;
  dueDate: string;
  additionalInstructions: string;
  questionTypes: QuestionTypeConfig[];
  
  // UI State
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setFiles: (files: File[]) => void;
  setTitle: (title: string) => void;
  setSubject: (subject: string) => void;
  setClassName: (className: string) => void;
  setSchoolName: (schoolName: string) => void;
  setTimeAllowed: (timeAllowed: string) => void;
  setDueDate: (dueDate: string) => void;
  setAdditionalInstructions: (instructions: string) => void;
  
  // Question Types Actions
  addQuestionType: (config: QuestionTypeConfig) => void;
  removeQuestionType: (index: number) => void;
  updateQuestionType: (index: number, config: Partial<QuestionTypeConfig>) => void;
  moveQuestionTypeUp: (index: number) => void;
  moveQuestionTypeDown: (index: number) => void;
  
  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  
  // Status
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

const initialState = {
  files: [] as File[],
  title: "",
  subject: "",
  className: "",
  schoolName: "",
  timeAllowed: "",
  dueDate: "",
  additionalInstructions: "",
  questionTypes: [
    {
      type: "mcq" as const,
      label: "Multiple Choice Questions",
      numberOfQuestions: 5,
      marksPerQuestion: 1,
    },
  ],
  currentStep: 1,
  isSubmitting: false,
  error: null,
};

export const useCreateFormStore = create<CreateFormState>((set) => ({
  ...initialState,

  setFiles: (files) => set({ files }),
  setTitle: (title) => set({ title }),
  setSubject: (subject) => set({ subject }),
  setClassName: (className) => set({ className }),
  setSchoolName: (schoolName) => set({ schoolName }),
  setTimeAllowed: (timeAllowed) => set({ timeAllowed }),
  setDueDate: (dueDate) => set({ dueDate }),
  setAdditionalInstructions: (additionalInstructions) => set({ additionalInstructions }),

  addQuestionType: (config) =>
    set((state) => ({
      questionTypes: [...state.questionTypes, config],
    })),
    
  removeQuestionType: (index) =>
    set((state) => ({
      questionTypes: state.questionTypes.filter((_, i) => i !== index),
    })),
    
  updateQuestionType: (index, config) =>
    set((state) => ({
      questionTypes: state.questionTypes.map((qt, i) =>
        i === index ? { ...qt, ...config } : qt
      ),
    })),

  moveQuestionTypeUp: (index) =>
    set((state) => {
      if (index === 0) return state; // Already at top
      const newQuestionTypes = [...state.questionTypes];
      [newQuestionTypes[index - 1], newQuestionTypes[index]] = [newQuestionTypes[index], newQuestionTypes[index - 1]];
      return { questionTypes: newQuestionTypes };
    }),

  moveQuestionTypeDown: (index) =>
    set((state) => {
      if (index === state.questionTypes.length - 1) return state; // Already at bottom
      const newQuestionTypes = [...state.questionTypes];
      [newQuestionTypes[index + 1], newQuestionTypes[index]] = [newQuestionTypes[index], newQuestionTypes[index + 1]];
      return { questionTypes: newQuestionTypes };
    }),

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 2) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setStep: (step) => set({ currentStep: step }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  
  resetForm: () => set({ ...initialState }),
}));
