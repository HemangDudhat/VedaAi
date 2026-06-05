"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Bell, ChevronDown, Menu, LogOut, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { logoutApi } from "@/lib/auth";

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
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    logout();
    await logoutApi();
    router.push("/auth/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "?";

  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";

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
        {/* <button
          className="relative p-2.5 rounded-xl hover:bg-bg-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-text-secondary" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent-orange rounded-full border-2 border-bg-white" />
        </button> */}

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 pl-2 pr-1 py-1.5 rounded-xl hover:bg-bg-primary transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border-2 border-white">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
            </div>
            <span className="text-sm font-medium text-text-primary hidden sm:block">
              {displayName}
            </span>
            <ChevronDown
              size={16}
              className={`text-text-muted hidden sm:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-bg-white rounded-2xl shadow-[var(--shadow-dropdown)] border border-border-light py-2 animate-scale-in z-50">
              {/* User Info Header */}
              <div className="px-4 py-2.5 border-b border-border-light mb-1">
                <p className="text-sm font-semibold text-text-primary truncate">{displayName}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-primary hover:text-text-primary transition-colors rounded-xl mx-1"
              >
                <UserCog size={16} />
                Edit Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-accent-red hover:bg-red-50 transition-colors rounded-xl mx-1 mt-1"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
