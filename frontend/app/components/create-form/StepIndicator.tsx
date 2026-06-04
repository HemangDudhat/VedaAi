"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { num: 1, label: "Upload Material" },
    { num: 2, label: "Assignment Details" },
  ];

  return (
    <div className="flex items-center justify-center mb-8 px-4">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.num;
        const isActive = currentStep === step.num;
        
        return (
          <div key={step.num} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-accent-green text-white"
                      : isActive
                      ? "bg-accent-orange text-white ring-4 ring-accent-orange/20"
                      : "bg-gray-100 text-text-muted border-2 border-gray-200"
                  }
                `}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : step.num}
              </div>
              <span
                className={`
                  absolute top-12 whitespace-nowrap text-xs font-semibold
                  transition-colors duration-300
                  ${isActive || isCompleted ? "text-text-primary" : "text-text-muted"}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line (except after last step) */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-20 sm:w-32 h-1 mx-2 rounded-full transition-colors duration-300
                  ${isCompleted ? "bg-accent-green" : "bg-gray-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
