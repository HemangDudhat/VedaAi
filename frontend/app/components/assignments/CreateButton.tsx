"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

interface CreateButtonProps {
  /** If true, renders as a floating action button (mobile) */
  variant?: "default" | "fab";
}

export default function CreateButton({ variant = "default" }: CreateButtonProps) {
  if (variant === "fab") {
    return (
      <Link
        href="/assignments/create"
        className="
          fixed bottom-24 right-5
          lg:hidden
          w-14 h-14
          bg-bg-white
          rounded-full
          flex items-center justify-center
          shadow-lg shadow-black/15
          border border-border-light
          hover:shadow-xl
          active:scale-95
          transition-all duration-200
          z-30
        "
        aria-label="Create assignment"
      >
        <Plus size={24} className="text-accent-orange" strokeWidth={2.5} />
      </Link>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-8 lg:bottom-8 z-30">
      <Link
        href="/assignments/create"
        className="
          flex items-center gap-2
          px-6 py-3.5
          bg-bg-dark text-text-white
          rounded-xl
          text-sm font-semibold
          hover:bg-bg-dark-hover
          active:scale-[0.98]
          transition-all duration-200
          shadow-xl shadow-black/20
        "
      >
        <Plus size={18} strokeWidth={2.5} />
        Create Assignment
      </Link>
    </div>
  );
}
