import Link from "next/link";
import type { SiteConfig } from "@/types/database";

const nav = [
  { href: "/services", label: "Layanan" },
  { href: "/products", label: "Produk" },
  { href: "/articles", label: "Artikel" },
  { href: "/about", label: "Tentang kami" },
  { href: "/contact", label: "Kontak" },
];

export function SiteHeader({ config }: { config: SiteConfig }) {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3 leading-tight">
          {config.nav_logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.nav_logo_url}
              alt={config.company_name}
              className="h-9 w-auto max-h-9 max-w-[200px] shrink-0 object-contain object-left sm:h-10 sm:max-h-10"
              width={200}
              height={40}
            />
          ) : null}
          <div className="flex min-w-0 flex-col">
            <span
              className={
                config.nav_logo_url
                  ? "truncate text-sm font-bold tracking-tight text-foreground sm:text-base"
                  : "text-lg font-bold tracking-tight text-foreground"
              }
            >
              {config.company_name}
            </span>
            <span className="hidden text-xs text-neutral-500 sm:block">
              Specialty Chemicals · Maklon Kimia Industri
            </span>
          </div>
        </Link>
        <nav aria-label="Utama" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-700 transition hover:text-mib"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="rounded border-2 border-mib bg-mib px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-mib-dark"
        >
          {config.hero_primary_cta_label}
        </Link>
      </div>
      <nav
        aria-label="Mobile"
        className="flex gap-4 overflow-x-auto border-t border-neutral-100 px-4 py-2 md:hidden"
      >
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-sm font-medium text-neutral-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
