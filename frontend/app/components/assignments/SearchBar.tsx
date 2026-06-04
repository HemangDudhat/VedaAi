"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statuses = [
    { value: null, label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "processing", label: "Processing" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "completed": return "bg-accent-green";
      case "processing": return "bg-accent-orange animate-pulse-dot";
      case "pending": return "bg-gray-400";
      case "failed": return "bg-accent-red";
      default: return "bg-transparent";
    }
  };

  const activeStatusObj = statuses.find(s => s.value === statusFilter);

  return (
    <div className="flex items-center gap-3 animate-fade-in relative z-20">
      {/* Filter Button & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2
            px-4 py-2.5
            text-sm font-semibold
            border rounded-xl
            transition-all duration-200
            shrink-0
            ${statusFilter 
              ? 'bg-orange-50 text-accent-orange border-orange-200 shadow-sm' 
              : 'text-text-secondary bg-bg-white border-border hover:bg-gray-50 hover:text-text-primary'
            }
          `}
        >
          <SlidersHorizontal size={16} />
          <span>
            {statusFilter 
              ? `Status: ${activeStatusObj?.label}` 
              : "Filter By"
            }
          </span>
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-52 bg-white border border-border shadow-[var(--shadow-dropdown)] rounded-xl py-1.5 animate-scale-in">
            <div className="px-3 py-1.5 text-xs font-bold text-text-muted uppercase tracking-wider border-b border-border-light mb-1">
              Filter by Status
            </div>
            {statuses.map((status) => (
              <button
                key={status.value || "all"}
                onClick={() => {
                  onStatusFilterChange(status.value);
                  setIsOpen(false);
                }}
                className="
                  w-full flex items-center justify-between
                  px-4 py-2 text-sm text-text-primary hover:bg-gray-50
                  transition-colors text-left
                "
              >
                <div className="flex items-center gap-2">
                  {status.value && (
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(status.value)}`} />
                  )}
                  <span className={statusFilter === status.value ? "font-semibold text-accent-orange" : ""}>
                    {status.label}
                  </span>
                </div>
                {statusFilter === status.value && (
                  <Check size={14} className="text-accent-orange" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative flex-1 max-w-sm ml-auto">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search Assignment"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full
            pl-10 pr-4 py-2.5
            bg-bg-white
            border border-border
            rounded-xl
            text-sm text-text-primary
            placeholder:text-text-muted
            focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/10
            transition-all duration-200
          "
        />
      </div>
    </div>
  );
}
