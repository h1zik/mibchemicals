import {
  LayoutDashboard,
  Factory,
  Lightbulb,
  MessageSquareQuote,
  Briefcase,
  Package,
  Tags,
  BookMarked,
  Newspaper,
  Inbox,
  Settings,
  type LucideIcon,
} from "lucide-react";

/** Tabel yang punya kolom `published` — dipakai untuk badge jumlah draft di sidebar. */
export type AdminDraftKey =
  | "industries"
  | "solutions"
  | "services"
  | "testimonials"
  | "products"
  | "posts";

export type AdminDraftCounts = Partial<Record<AdminDraftKey, number>>;

export type AdminNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  draftKey?: AdminDraftKey;
};

export type AdminNavGroup = {
  label: string | null;
  links: AdminNavLink[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: null,
    links: [{ href: "/admin", label: "Ringkasan", icon: LayoutDashboard }],
  },
  {
    label: "Konten jasa",
    links: [
      { href: "/admin/industries", label: "Industri", icon: Factory, draftKey: "industries" },
      { href: "/admin/solutions", label: "Solusi", icon: Lightbulb, draftKey: "solutions" },
      { href: "/admin/services", label: "Layanan", icon: Briefcase, draftKey: "services" },
      {
        href: "/admin/testimonials",
        label: "Testimoni",
        icon: MessageSquareQuote,
        draftKey: "testimonials",
      },
    ],
  },
  {
    label: "Katalog",
    links: [
      { href: "/admin/products", label: "Produk", icon: Package, draftKey: "products" },
      { href: "/admin/product-categories", label: "Kategori produk", icon: Tags },
    ],
  },
  {
    label: "Publikasi",
    links: [
      { href: "/admin/posts", label: "Artikel", icon: Newspaper, draftKey: "posts" },
      { href: "/admin/post-categories", label: "Kategori artikel", icon: BookMarked },
    ],
  },
  {
    label: "Masuk",
    links: [{ href: "/admin/leads", label: "Leads", icon: Inbox }],
  },
  {
    label: "Sistem",
    links: [{ href: "/admin/settings", label: "Pengaturan", icon: Settings }],
  },
];

export function isAdminLinkActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
}

/** Label breadcrumb: grup + halaman aktif + sub-halaman (baru / edit). */
export function adminBreadcrumb(pathname: string): string[] {
  for (const group of adminNavGroups) {
    for (const link of group.links) {
      if (!isAdminLinkActive(pathname, link.href)) continue;
      const crumbs = group.label ? [group.label, link.label] : [link.label];
      if (pathname.endsWith("/new")) crumbs.push("Baru");
      else if (pathname.endsWith("/edit")) crumbs.push("Edit");
      return crumbs;
    }
  }
  return ["Console"];
}
