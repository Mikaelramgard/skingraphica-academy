"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GraduationCap,
  Library,
  UploadCloud,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "./actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/study", label: "Study", icon: GraduationCap },
  { href: "/browse", label: "Browse Topics", icon: Library },
  { href: "/import", label: "Import Knowledge", icon: UploadCloud },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-line bg-surface px-4 py-6">
      <div className="mb-8 px-2">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
          Skingraphica
        </p>
        <p className="font-display text-lg italic text-ink">Academy</p>
      </div>

      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                isActive
                  ? "bg-accent-soft text-accent-deep"
                  : "text-ink-soft hover:bg-surface-sunken hover:text-ink",
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-faint transition-colors hover:bg-surface-sunken hover:text-ink"
        >
          <LogOut size={17} strokeWidth={2} />
          Sign out
        </button>
      </form>
    </aside>
  );
}
