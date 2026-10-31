"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { adminBreadcrumb } from "@/lib/admin-nav";

export function AdminBreadcrumb() {
  const crumbs = adminBreadcrumb(usePathname());
  return (
    <nav aria-label="Lokasi" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${c}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {i > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-admin-line" aria-hidden /> : null}
              <span
                className={last ? "truncate font-medium text-admin-ink" : "truncate text-admin-muted"}
                aria-current={last ? "page" : undefined}
              >
                {c}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
