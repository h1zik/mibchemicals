"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Building2,
  ChevronRight,
  Mail,
  Menu,
  Newspaper,
  Package,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type NavItem = { href: string; label: string };

const navIcons: Record<string, LucideIcon> = {
  "/services": Briefcase,
  "/products": Package,
  "/articles": Newspaper,
  "/about": Building2,
  "/contact": Mail,
};

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeaderMobileMenu({
  nav,
  ctaHref,
  ctaLabel,
  companyName,
}: {
  nav: NavItem[];
  ctaHref: string;
  ctaLabel: string;
  companyName: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeBtn = panelRef.current?.querySelector<HTMLButtonElement>(
      "[data-mobile-menu-close]",
    );
    closeBtn?.focus();
  }, [open]);

  const backdropTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const };
  const panelTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, damping: 32, stiffness: 380 };

  const menu = (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Tutup menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            className="fixed inset-0 z-[60] bg-neutral-900/50 backdrop-blur-[2px] md:hidden"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            ref={panelRef}
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[min(100%,20rem)] flex-col bg-white shadow-2xl shadow-neutral-900/20 md:hidden"
          >
            <div className="flex items-start justify-between gap-4 border-b border-neutral-100 px-5 pb-4 pt-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mib">
                  Menu
                </p>
                <p className="mt-1 truncate text-base font-bold tracking-tight text-foreground">
                  {companyName}
                </p>
              </div>
              <button
                type="button"
                data-mobile-menu-close
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200 hover:text-foreground"
              >
                <X className="h-5 w-5" aria-hidden />
                <span className="sr-only">Tutup menu</span>
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-1">
                {nav.map((item, index) => {
                  const active = isNavActive(pathname, item.href);
                  const Icon = navIcons[item.href] ?? ChevronRight;
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : 0.05 + index * 0.04,
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={
                          "group flex items-center gap-3 rounded-xl px-3 py-3.5 transition active:scale-[0.98] " +
                          (active
                            ? "bg-mib/10 text-mib ring-1 ring-mib/15"
                            : "text-neutral-800 hover:bg-neutral-50")
                        }
                      >
                        <span
                          className={
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition " +
                            (active
                              ? "bg-mib text-white shadow-sm"
                              : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200")
                          }
                          aria-hidden
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="flex-1 text-[15px] font-semibold leading-tight">
                          {item.label}
                        </span>
                        <ChevronRight
                          className={
                            "h-4 w-4 shrink-0 transition " +
                            (active
                              ? "text-mib"
                              : "text-neutral-300 group-hover:translate-x-0.5 group-hover:text-neutral-400")
                          }
                          aria-hidden
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-neutral-100 bg-neutral-50/80 px-5 py-5">
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-mib bg-mib px-5 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-mib/20 transition hover:bg-mib-dark active:scale-[0.98]"
              >
                {ctaLabel}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
              <p className="mt-3 text-center text-xs text-neutral-500">
                Specialty Chemicals · Maklon Kimia Industri
              </p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
        className={
          "relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition md:hidden " +
          (open
            ? "bg-mib/10 text-mib ring-1 ring-mib/20"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-foreground")
        }
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <Menu className="h-5 w-5" aria-hidden />
        )}
        <span className="sr-only">{open ? "Tutup menu" : "Buka menu"}</span>
      </button>
      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}
