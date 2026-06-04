"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      {/* Illustration */}
      <div className="relative w-64 h-64 mb-8">
        {/* Background circle */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-50" />

        {/* Document illustration */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28">
          <div className="bg-white rounded-lg shadow-lg p-4 space-y-2 transform -rotate-3">
            <div className="h-2 w-16 bg-bg-dark rounded-full" />
            <div className="h-1.5 w-full bg-gray-100 rounded-full" />
            <div className="h-1.5 w-3/4 bg-gray-100 rounded-full" />
            <div className="h-1.5 w-5/6 bg-gray-100 rounded-full" />
          </div>
        </div>

        {/* Toggle/checkbox element */}
        <div className="absolute top-6 right-8 bg-white rounded-lg shadow-md px-3 py-1.5 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <div className="w-8 h-3 rounded-full bg-gray-100" />
        </div>

        {/* Magnifying glass with X */}
        <div className="absolute bottom-8 right-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-purple-200 bg-white/60 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-accent-red text-lg font-bold">✕</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-purple-200 rounded-full transform rotate-45 origin-top-left" />
          </div>
        </div>

        {/* Decorative pen */}
        <div className="absolute top-12 left-6">
          <div className="w-1.5 h-12 bg-bg-dark rounded-full transform -rotate-45" />
        </div>

        {/* Sparkle */}
        <div className="absolute bottom-16 left-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-blue-400 animate-pulse-dot"
          >
            <path
              d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Dot */}
        <div className="absolute top-24 right-4 w-2.5 h-2.5 rounded-full bg-blue-300 animate-pulse-dot" />
      </div>

      {/* Text */}
      <h2 className="text-xl font-bold text-text-primary mb-3">
        No assignments yet
      </h2>
      <p className="text-sm text-text-secondary text-center max-w-md leading-relaxed mb-8">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      {/* CTA Button */}
      <Link
        href="/assignments/create"
        className="
          flex items-center gap-2
          px-7 py-3.5
          bg-bg-dark text-text-white
          rounded-xl
          text-sm font-semibold
          hover:bg-bg-dark-hover
          active:scale-[0.98]
          transition-all duration-200
          shadow-lg shadow-black/10
        "
      >
        <Plus size={18} strokeWidth={2.5} />
        Create Your First Assignment
      </Link>
    </div>
  );
}
