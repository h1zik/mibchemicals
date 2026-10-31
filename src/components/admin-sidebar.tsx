"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Menu, X } from "lucide-react";
import {
  adminNavGroups,
  isAdminLinkActive,
  type AdminDraftCounts,
} from "@/lib/admin-nav";

type Props = {
  draftCounts?: AdminDraftCounts;
};

function Brand() {
  return (
    <Link
      href="/admin"
      className="group flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mib-lime"
    >
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-mib font-display text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
        aria-hidden
      >
        M
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-semibold text-white">MIB Chemicals</span>
        <span className="block text-xs text-white/50">Console konten</span>
      </span>
    </Link>
  );
}

function NavList({ draftCounts, onNavigate }: Props & { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi admin" className="space-y-5">
      {adminNavGroups.map((group, gi) => (
        <div key={group.label ?? gi}>
          {group.label ? (
            <p className="px-3 pb-1.5 text-xs font-medium text-white/40">{group.label}</p>
          ) : null}
          <ul className="space-y-0.5">
            {group.links.map((l) => {
              const active = isAdminLinkActive(pathname, l.href);
              const Icon = l.icon;
              const drafts = l.draftKey ? draftCounts?.[l.draftKey] ?? 0 : 0;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-mib-lime " +
                      (active
                        ? "bg-white/[0.09] font-semibold text-white before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-mib-lime"
                        : "text-white/65 hover:bg-white/[0.05] hover:text-white")
                    }
                  >
                    <Icon
                      className={"h-[18px] w-[18px] shrink-0 " + (active ? "text-mib-lime" : "opacity-80")}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate">{l.label}</span>
                    {drafts > 0 ? (
                      <span
                        className="rounded-md bg-amber-300/15 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-amber-200"
                        title={`${drafts} draft belum dipublikasikan`}
                      >
                        {drafts}
                        <span className="sr-only"> draft</span>
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function PublicSiteLink() {
  return (
    <Link
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/55 transition hover:bg-white/[0.05] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib-lime"
    >
      <ExternalLink className="h-4 w-4" aria-hidden />
      Buka situs publik
    </Link>
  );
}

export function AdminSidebar({ draftCounts }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Tutup drawer saat pindah halaman.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const trigger = triggerRef.current;
    const focusables = () =>
      Array.from(
        drawer?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
    focusables()[0]?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-mib-deep px-3 py-5 md:flex">
        <div className="px-2 pb-6">
          <Brand />
        </div>
        <NavList draftCounts={draftCounts} />
        <div className="mt-auto border-t border-white/10 pt-3">
          <PublicSiteLink />
        </div>
      </aside>

      {/* Mobile */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-mib-deep px-4 md:hidden">
        <Brand />
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="admin-mobile-drawer"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib-lime"
        >
          <Menu className="h-5 w-5" aria-hidden />
          <span className="sr-only">Buka menu</span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu admin">
          <div
            className="absolute inset-0 animate-fade-in bg-mib-ink/60 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            id="admin-mobile-drawer"
            ref={drawerRef}
            className="relative flex h-full w-[min(18rem,85vw)] animate-drawer-in flex-col overflow-y-auto bg-mib-deep px-3 py-4"
          >
            <div className="flex items-center justify-between px-2 pb-5">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib-lime"
              >
                <X className="h-5 w-5" aria-hidden />
                <span className="sr-only">Tutup menu</span>
              </button>
            </div>
            <NavList draftCounts={draftCounts} onNavigate={() => setOpen(false)} />
            <div className="mt-auto border-t border-white/10 pt-3">
              <PublicSiteLink />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
