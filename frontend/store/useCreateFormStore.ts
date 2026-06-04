import { create } from "zustand";
import type { QuestionTypeConfig } from "@/types";

interface CreateFormState {
  // Step 1: Upload
  file: File | null;
  
  // Step 2: Details
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  additionalInstructions: string;
  questionTypes: QuestionTypeConfig[];
  
  // UI State
  currentStep: number;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  setFile: (file: File | null) => void;
  setTitle: (title: string) => void;
  setSubject: (subject: string) => void;
  setClassName: (className: string) => void;
  setDueDate: (dueDate: string) => void;
  setAdditionalInstructions: (instructions: string) => void;
  
  // Question Types Actions
  addQuestionType: (config: QuestionTypeConfig) => void;
  removeQuestionType: (index: number) => void;
  updateQuestionType: (index: number, config: Partial<QuestionTypeConfig>) => void;
  
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
  file: null,
  title: "",
  subject: "",
  className: "",
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

  setFile: (file) => set({ file }),
  setTitle: (title) => set({ title }),
  setSubject: (subject) => set({ subject }),
  setClassName: (className) => set({ className }),
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

  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 2) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setStep: (step) => set({ currentStep: step }),

  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),
  
  resetForm: () => set({ ...initialState }),
}));
