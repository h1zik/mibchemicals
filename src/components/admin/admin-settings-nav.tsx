"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

/** Navigasi lengket untuk melompat antar bagian pengaturan; menyorot bagian yang sedang terlihat. */
export function AdminSettingsNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Bagian pengaturan" className="sticky top-20 hidden lg:block">
      <ul className="space-y-0.5 border-l border-admin-line">
        {items.map((i) => {
          const isActive = active === i.id;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={isActive ? "location" : undefined}
                className={
                  "-ml-px block border-l-2 py-1.5 pl-4 pr-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib " +
                  (isActive
                    ? "border-mib font-medium text-admin-ink"
                    : "border-transparent text-admin-muted hover:border-admin-line hover:text-admin-ink")
                }
              >
                {i.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
