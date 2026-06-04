"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import type { Assignment } from "@/types";

interface AssignmentCardProps {
  assignment: Assignment;
  index?: number;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AssignmentCard({
  assignment,
  index = 0,
  onView,
  onDelete,
}: AssignmentCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className={`
        group relative
        bg-bg-card rounded-2xl
        p-5 md:p-6
        shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-card-hover)]
        border border-border-light
        hover:border-border
        transition-all duration-300 ease-out
        cursor-pointer
        animate-fade-in opacity-0
        stagger-${Math.min(index + 1, 6)}
      `}
      onClick={() => onView(assignment._id)}
    >
      {/* Title */}
      <h3 className="text-base font-bold text-text-primary pr-8 mb-1 line-clamp-2">
        {assignment.title}
      </h3>

      {/* Status indicator for processing */}
      {assignment.status === "processing" && (
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-accent-orange animate-pulse-dot" />
          <span className="text-xs text-accent-orange font-medium">
            Generating...
          </span>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1 min-h-[32px]" />

      {/* Dates */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">
          <span className="font-semibold text-text-primary">Assigned on</span> :{" "}
          {formatDate(assignment.createdAt)}
        </span>
        {assignment.dueDate && (
          <span className="text-text-secondary">
            <span className="font-semibold text-text-primary">Due</span> :{" "}
            {formatDate(assignment.dueDate)}
          </span>
        )}
      </div>

      {/* 3-dot Menu */}
      <div className="absolute top-5 right-5" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="
            p-1.5 rounded-lg
            hover:bg-bg-primary
            transition-colors duration-200
            opacity-0 group-hover:opacity-100
            focus:opacity-100
          "
          aria-label="Assignment options"
        >
          <MoreVertical size={18} className="text-text-secondary" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className="
              absolute top-full right-0 mt-1
              w-44
              bg-bg-white rounded-xl
              shadow-[var(--shadow-dropdown)]
              border border-border-light
              py-1.5
              animate-scale-in
              z-20
            "
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onView(assignment._id);
              }}
              className="
                w-full flex items-center gap-2.5 px-4 py-2.5
                text-sm text-text-primary font-medium
                hover:bg-bg-primary
                transition-colors duration-150
              "
            >
              <Eye size={16} className="text-text-secondary" />
              View Assignment
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onDelete(assignment._id);
              }}
              className="
                w-full flex items-center gap-2.5 px-4 py-2.5
                text-sm text-accent-red font-medium
                hover:bg-red-50
                transition-colors duration-150
              "
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
