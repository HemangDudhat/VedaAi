"use client";

import { useCreateFormStore } from "@/store/useCreateFormStore";
import QuestionTypeRow from "./QuestionTypeRow";
import { Plus } from "lucide-react";

export default function QuestionTypeList() {
  const { questionTypes, addQuestionType, removeQuestionType, updateQuestionType, moveQuestionTypeUp, moveQuestionTypeDown } = useCreateFormStore();

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.numberOfQuestions, 0);
  const totalMarks = questionTypes.reduce((sum, qt) => sum + (qt.numberOfQuestions * qt.marksPerQuestion), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-text-primary">
          Question Types
        </label>
        <div className="flex gap-4 text-xs font-medium text-text-secondary bg-gray-50 px-3 py-1.5 rounded-lg border border-border-light">
          <span>Total Qs: <strong className="text-text-primary">{totalQuestions}</strong></span>
          <span>Total Marks: <strong className="text-text-primary">{totalMarks}</strong></span>
        </div>
      </div>

      <div className="space-y-3">
        {questionTypes.map((qt, index) => (
          <QuestionTypeRow
            key={index}
            index={index}
            config={qt}
            onUpdate={updateQuestionType}
            onRemove={removeQuestionType}
            canRemove={questionTypes.length > 1}
            onMoveUp={() => moveQuestionTypeUp(index)}
            onMoveDown={() => moveQuestionTypeDown(index)}
            isFirst={index === 0}
            isLast={index === questionTypes.length - 1}
          />
        ))}
      </div>

      <button
        onClick={() => addQuestionType({
          type: "short",
          label: "Short Questions",
          numberOfQuestions: 1,
          marksPerQuestion: 2,
        })}
        className="
          flex items-center gap-2 px-4 py-2 mt-2
          text-sm font-medium text-accent-orange
          hover:bg-orange-50 rounded-lg
          transition-colors duration-200
        "
      >
        <Plus size={16} strokeWidth={2.5} />
        Add Question Type
      </button>
    </div>
  );
}
