"use client";

import { Trash2 } from "lucide-react";
import { QUESTION_TYPE_OPTIONS, type QuestionTypeConfig, type QuestionTypeEnum } from "@/types";

interface QuestionTypeRowProps {
  config: QuestionTypeConfig;
  index: number;
  onUpdate: (index: number, config: Partial<QuestionTypeConfig>) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function QuestionTypeRow({
  config,
  index,
  onUpdate,
  onRemove,
  canRemove,
}: QuestionTypeRowProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 bg-gray-50/50 rounded-xl border border-border-light relative group animate-slide-up">
      {/* Type Dropdown */}
      <div className="flex-1 w-full sm:w-auto">
        <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
          Question Type
        </label>
        <select
          value={config.type}
          onChange={(e) => {
            const selectedType = e.target.value as QuestionTypeEnum;
            const selectedOption = QUESTION_TYPE_OPTIONS.find(opt => opt.value === selectedType);
            onUpdate(index, { 
              type: selectedType,
              label: selectedOption?.label || selectedType
            });
          }}
          className="w-full h-11 px-3 bg-bg-white border border-border rounded-lg text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
        >
          {QUESTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end gap-4 w-full sm:w-auto">
        {/* Count Input */}
        <div className="w-24 shrink-0">
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
            Count
          </label>
          <input
            type="number"
            min="1"
            value={config.numberOfQuestions}
            onChange={(e) => onUpdate(index, { numberOfQuestions: parseInt(e.target.value) || 1 })}
            className="w-full h-11 px-3 bg-bg-white border border-border rounded-lg text-sm text-center focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>

        {/* Marks per Question */}
        <div className="w-24 shrink-0">
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
            Marks/Q
          </label>
          <input
            type="number"
            min="1"
            value={config.marksPerQuestion}
            onChange={(e) => onUpdate(index, { marksPerQuestion: parseInt(e.target.value) || 1 })}
            className="w-full h-11 px-3 bg-bg-white border border-border rounded-lg text-sm text-center focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className={`
            h-11 w-11 flex items-center justify-center rounded-lg shrink-0
            transition-colors duration-200
            ${canRemove 
              ? "text-text-muted hover:bg-red-50 hover:text-accent-red" 
              : "text-gray-300 cursor-not-allowed"
            }
          `}
          aria-label="Remove question type"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
