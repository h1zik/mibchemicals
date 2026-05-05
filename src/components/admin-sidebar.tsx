"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  Tags,
  BookMarked,
  Newspaper,
  Inbox,
  Settings,
  ExternalLink,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/services", label: "Layanan", icon: Briefcase },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/product-categories", label: "Kategori produk", icon: Tags },
  { href: "/admin/posts", label: "Artikel", icon: Newspaper },
  { href: "/admin/post-categories", label: "Kategori artikel", icon: BookMarked },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="flex w-full shrink-0 flex-col border-b border-white/10 bg-zinc-950 md:w-64 md:border-b-0 md:border-r"
      aria-label="Navigasi admin"
    >
      <div className="hidden px-5 pb-2 pt-6 md:block">
        <Link href="/admin" className="group block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mib-light/90">
            MIB Chemicals
          </p>
          <p className="mt-1 text-lg font-bold tracking-tight text-white">Console</p>
          <p className="mt-0.5 text-xs text-zinc-500">Kelola konten situs</p>
        </Link>
      </div>
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <Link href="/admin" className="text-sm font-bold text-white">
          MIB <span className="text-mib-light">Admin</span>
        </Link>
      </div>
      <nav
        className="flex flex-1 flex-row gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-6"
        aria-label="Admin"
      >
        {links.map((l) => {
          const active =
            pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              title={l.label}
              className={
                "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition md:shrink " +
                (active
                  ? "bg-mib text-white shadow-lg shadow-black/20"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white")
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" aria-hidden />
              <span className="hidden sm:inline md:inline">{l.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden border-t border-white/10 px-4 py-4 md:block">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          Lihat situs publik
        </Link>
      </div>
    </aside>
  );
}
