import Link from "next/link";
import type { SiteConfig } from "@/types/database";

const navLinks = [
  { href: "/industries", label: "Industri" },
  { href: "/solutions", label: "Solusi" },
  { href: "/services", label: "Layanan" },
  { href: "/articles", label: "Artikel & insight" },
  { href: "/products", label: "Produk" },
  { href: "/about", label: "Tentang kami" },
  { href: "/contact", label: "Kontak" },
];

export function SiteFooter({ config }: { config: SiteConfig }) {
  const industries = config.industries_json?.slice(0, 5) ?? [];

  return (
    <footer className="relative overflow-hidden border-t border-mib/20 bg-mib-ink text-neutral-300">
      {/* aksen + tekstur, konsisten dengan band gelap di homepage */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-mib-gradient" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-dark" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-mib/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-mib-lime/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            {config.nav_logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.nav_logo_url}
                alt={config.company_name}
                className="h-10 w-auto max-h-10 max-w-[200px] object-contain object-left"
                width={200}
                height={40}
              />
            ) : (
              <span className="font-display text-xl font-bold tracking-tight text-white">
                {config.company_name}
              </span>
            )}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
            {config.company_tagline}
          </p>
          <Link
            href={config.hero_primary_cta_url || "/contact"}
            className="shine-hover group mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
          >
            {config.hero_primary_cta_label}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Navigasi */}
        <nav aria-label="Footer" className="text-sm">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-mib-lime">
            Navigasi
          </p>
          <ul className="mt-4 space-y-3">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-neutral-400 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sektor */}
        <div className="text-sm">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-mib-lime">
            Sektor
          </p>
          <ul className="mt-4 space-y-3">
            {industries.length === 0 ? (
              <li className="text-neutral-500">—</li>
            ) : (
              industries.map((ind) => (
                <li key={ind.key} className="text-neutral-400">
                  {ind.name}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Kontak */}
        <div className="text-sm">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-mib-lime">
            Kontak
          </p>
          <address className="mt-4 space-y-3 not-italic text-neutral-400">
            <p className="leading-relaxed">{config.contact_address}</p>
            <p>
              <a className="transition-colors duration-200 hover:text-white" href={`mailto:${config.contact_email}`}>
                {config.contact_email}
              </a>
            </p>
            <p>
              <a
                className="transition-colors duration-200 hover:text-white"
                href={`tel:${config.contact_phone.replace(/\s/g, "")}`}
              >
                {config.contact_phone}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-neutral-500 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {config.company_name}. Specialty chemicals &amp; maklon kimia industri.
          </p>
          <Link href="/admin/login" className="transition-colors duration-200 hover:text-neutral-300">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
