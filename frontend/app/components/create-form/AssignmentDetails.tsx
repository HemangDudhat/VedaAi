"use client";

import { useCreateFormStore } from "@/store/useCreateFormStore";
import QuestionTypeList from "./QuestionTypeList";

export default function AssignmentDetails() {
  const {
    title,
    setTitle,
    subject,
    setSubject,
    className,
    setClassName,
    dueDate,
    setDueDate,
    additionalInstructions,
    setAdditionalInstructions,
    schoolName,
    setSchoolName,
    timeAllowed,
    setTimeAllowed,
    error,
  } = useCreateFormStore();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Title & Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Assignment Title <span className="text-accent-red">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Physics Chapter 5 Quiz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-11 px-4 bg-bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Subject <span className="text-accent-red">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Physics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-11 px-4 bg-bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>
      </div>

      {/* Class & Due Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Class / Grade <span className="text-accent-red">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 10th Grade"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full h-11 px-4 bg-bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Due Date <span className="text-accent-red">*</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full h-11 px-4 bg-bg-white border border-border rounded-xl text-sm text-text-primary focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>
      </div>

      {/* School Name & Time Allowed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            School / College Name
          </label>
          <input
            type="text"
            placeholder="e.g. Springfield High School"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="w-full h-11 px-4 bg-bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            Time Allowed <span className="text-accent-red">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 2 Hours 30 Minutes"
            value={timeAllowed}
            onChange={(e) => setTimeAllowed(e.target.value)}
            className="w-full h-11 px-4 bg-bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
          />
        </div>
      </div>

      {/* Question Types List */}
      <div className="pt-2">
        <QuestionTypeList />
      </div>

      {/* Additional Instructions */}
      <div className="pt-2">
        <label className="block text-sm font-semibold text-text-primary mb-1.5">
          Additional Instructions (Optional)
        </label>
        <textarea
          placeholder="Add any specific instructions for the AI or students..."
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          rows={3}
          className="w-full p-4 bg-bg-white border border-border rounded-xl text-sm resize-none focus:ring-2 focus:ring-accent-orange/20 focus:border-accent-orange outline-none transition-all"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-accent-red text-sm font-medium rounded-lg border border-red-100 animate-slide-up">
          {error}
        </div>
      )}
    </div>
  );
}
