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
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Home", href: "/", icon: LayoutGrid },
  { label: "My Groups", href: "/groups", icon: Users },
  { label: "Assignments", href: "/", icon: FileText, /*badge: 32*/ },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: MonitorSmartphone },
  { label: "My Library", href: "/library", icon: Library },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

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
            href="/toolkit"
            className="
              flex items-center justify-center gap-2
              w-full py-3 rounded-xl
              border-2 border-accent-orange
              bg-bg-white
              text-sm font-semibold text-text-primary
              hover:bg-bg-orange-light
              transition-all duration-200
              group
            "
          >
            <Sparkles
              size={16}
              className="text-accent-orange group-hover:scale-110 transition-transform"
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
                ? pathname === "/" || pathname.startsWith("/assignments")
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
                {item.badge && (
                  <span className="bg-badge-count text-text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-3 space-y-2">
          {/* Settings */}
          <Link
            href="/settings"
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

          {/* School Info */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg-primary">
            <div className="w-10 h-10 bg-bg-white rounded-full flex items-center justify-center border border-border shadow-sm overflow-hidden">
              <span className="text-xs font-bold text-accent-green">🏫</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                Delhi Public School
              </p>
              <p className="text-xs text-text-muted truncate">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
