"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  Users,
  FileText,
  MonitorSmartphone,
  Library,
  Settings,
  Sparkles,
  X,
  School,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Home", href: "/dashboard", icon: LayoutGrid },
  // { label: "My Groups", href: "/groups", icon: Users },
  { label: "Assignments", href: "/dashboard", icon: FileText },
  { label: "Create Assignment", href: "/assignments/create", icon: MonitorSmartphone },
  { label: "My Library", href: "/library", icon: Library },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const hasSchoolData = user?.schoolName || user?.schoolAddress;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full bg-bg-white
          w-[var(--sidebar-width)] flex flex-col
          shadow-[var(--shadow-sidebar)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-bg-dark rounded-lg flex items-center justify-center">
              <span className="text-text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              VedaAI
            </span>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-bg-primary transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* AI Teacher's Toolkit CTA Button */}
        <div className="px-4 pb-4">
          <Link
            href="#"
            className="
              flex items-center justify-center gap-2
              w-full py-3 rounded-full
              border-4 border-accent-orange
              bg-[#2d2d2d]
              text-sm font-semibold text-text-white
              transition-all duration-200
              group
            "
          >
            <Sparkles
              size={16}
              className="text-white group-hover:scale-110 transition-transform"
            />
            AI Teacher&apos;s Toolkit
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.label === "Assignments"
                ? pathname === "/dashboard" || pathname.startsWith("/assignments")
                : item.label === "Home"
                ? pathname === "/dashboard"
                : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-bg-primary text-text-primary font-semibold"
                      : "text-text-secondary hover:bg-bg-primary hover:text-text-primary"
                  }
                `}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-3 space-y-2">
          {/* Settings */}
          <Link
            href="/profile"
            className="
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium text-text-secondary
              hover:bg-bg-primary hover:text-text-primary
              transition-all duration-200
            "
          >
            <Settings size={20} strokeWidth={1.8} />
            <span>Settings</span>
          </Link>

          {/* School Info — dynamic from user profile */}
          {hasSchoolData ? (
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg-primary hover:bg-gray-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-bg-white rounded-full flex items-center justify-center border border-border shadow-sm overflow-hidden shrink-0">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.schoolName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <School size={18} className="text-accent-orange" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {user?.schoolName}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.schoolAddress}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              href="/profile"
              className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg-primary hover:bg-gray-100 transition-colors border-2 border-dashed border-border"
            >
              <div className="w-10 h-10 bg-bg-white rounded-full flex items-center justify-center border border-border shadow-sm shrink-0">
                <School size={18} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-muted">No school/college data</p>
                <p className="text-xs text-accent-orange">Tap to add details →</p>
              </div>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
