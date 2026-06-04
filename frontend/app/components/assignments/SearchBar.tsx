"use client";

import { Search, SlidersHorizontal } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onFilterClick,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 animate-fade-in">
      {/* Filter Button */}
      <button
        onClick={onFilterClick}
        className="
          flex items-center gap-2
          px-4 py-2.5
          text-sm text-text-muted font-medium
          hover:text-text-secondary hover:bg-bg-white
          rounded-xl
          transition-all duration-200
          shrink-0
        "
      >
        <SlidersHorizontal size={16} />
        <span className="hidden sm:inline">Filter By</span>
        <span className="sm:hidden">Filter</span>
      </button>

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
