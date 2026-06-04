"use client";

import { ArrowLeft, Bell, ChevronDown, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onMenuClick: () => void;
}

export default function TopBar({
  title = "Assignment",
  showBack = false,
  onMenuClick,
}: TopBarProps) {
  const router = useRouter();

  return (
    <header
      className="
        sticky top-0 z-30
        h-[var(--topbar-height)]
        bg-bg-white/80 backdrop-blur-md
        border-b border-border-light
        flex items-center justify-between
        px-4 md:px-6
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-bg-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-text-primary" />
        </button>

        {/* Back button */}
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl hover:bg-bg-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-text-primary" />
          </button>
        )}

        {/* Page Title */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-text-secondary hidden sm:block">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h1 className="text-sm font-medium text-text-muted">{title}</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button
          className="relative p-2.5 rounded-xl hover:bg-bg-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-text-secondary" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent-orange rounded-full border-2 border-bg-white" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-xl hover:bg-bg-primary transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center overflow-hidden shadow-sm">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          <span className="text-sm font-medium text-text-primary hidden sm:block">
            John Doe
          </span>
          <ChevronDown size={16} className="text-text-muted hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
