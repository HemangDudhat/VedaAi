"use client";

import { useCreateFormStore } from "@/store/useCreateFormStore";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface FormNavigationProps {
  onSubmit: () => void;
}

export default function FormNavigation({ onSubmit }: FormNavigationProps) {
  const { currentStep, nextStep, prevStep, isSubmitting } = useCreateFormStore();

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 pt-6 border-t border-border-light flex items-center justify-between animate-fade-in">
      {/* Back Button */}
      {currentStep > 1 ? (
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="
            flex items-center gap-2 px-6 py-2.5
            text-sm font-semibold text-text-secondary
            hover:text-text-primary hover:bg-gray-100 rounded-xl
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <ArrowLeft size={18} />
          Back
        </button>
      ) : (
        <div /> // Spacer
      )}

      {/* Next / Submit Button */}
      {currentStep === 1 ? (
        <button
          onClick={nextStep}
          className="
            flex items-center gap-2 px-8 py-3
            bg-bg-dark text-text-white
            text-sm font-semibold rounded-xl
            hover:bg-bg-dark-hover active:scale-[0.98]
            transition-all duration-200 shadow-md
          "
        >
          Next Step
          <ArrowRight size={18} />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="
            flex items-center gap-2 px-8 py-3
            bg-accent-orange text-white
            text-sm font-bold rounded-xl
            hover:bg-orange-600 active:scale-[0.98]
            transition-all duration-200 shadow-lg shadow-orange-500/20
            disabled:opacity-70 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {isSubmitting ? "Generating..." : "Generate Assignment"}
        </button>
      )}
    </div>
  );
}
