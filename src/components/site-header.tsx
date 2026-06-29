import Link from "next/link";
import type { SiteConfig } from "@/types/database";
import { SiteHeaderMobileMenu } from "@/components/site-header-mobile-menu";

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
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
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
              className="group relative text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-mib"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-mib-gradient transition-transform duration-300 group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            className="shine-hover group hidden items-center justify-center gap-1.5 rounded-lg bg-mib-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg md:inline-flex"
          >
            {config.hero_primary_cta_label}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <SiteHeaderMobileMenu
            nav={nav}
            ctaHref="/contact"
            ctaLabel={config.hero_primary_cta_label}
            companyName={config.company_name}
          />
        </div>
      </div>
    </header>
  );
}
