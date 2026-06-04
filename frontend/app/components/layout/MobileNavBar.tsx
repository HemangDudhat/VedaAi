"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Library, Sparkles } from "lucide-react";

const mobileNavItems = [
  { label: "Home", href: "/", icon: LayoutGrid },
  { label: "Assignments", href: "/", icon: FileText },
  { label: "Library", href: "/library", icon: Library },
  { label: "AI Toolkit", href: "/toolkit", icon: Sparkles },
];

export default function MobileNavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-40
        h-[var(--mobile-nav-height)]
        bg-bg-dark
        flex items-center justify-around
        px-2 pb-safe m-3
        lg:hidden
        border-t border-white/5
      "
      style={{
        borderRadius: "20px 20px 20px 20px",
      }}
    >
      {mobileNavItems.map((item) => {
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
              flex flex-col items-center gap-1 px-3 py-2 rounded-xl
              transition-all duration-200 min-w-[64px]
              ${
                isActive
                  ? "text-text-white"
                  : "text-white/50 hover:text-white/80"
              }
            `}
          >
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.5} />
            <span
              className={`text-[10px] ${isActive ? "font-semibold" : "font-medium"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
