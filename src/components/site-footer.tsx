import Link from "next/link";
import type { SiteConfig } from "@/types/database";

export function SiteFooter({ config }: { config: SiteConfig }) {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-foreground">{config.company_name}</p>
          <p className="mt-2 text-sm text-neutral-600">{config.company_tagline}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Kontak
          </p>
          <address className="mt-2 not-italic text-sm text-neutral-700">
            <p>{config.contact_address}</p>
            <p>
              <a className="hover:text-mib" href={`mailto:${config.contact_email}`}>
                {config.contact_email}
              </a>
            </p>
            <p>
              <a className="hover:text-mib" href={`tel:${config.contact_phone.replace(/\s/g, "")}`}>
                {config.contact_phone}
              </a>
            </p>
          </address>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Legal
          </p>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link href="/articles" className="text-neutral-700 hover:text-mib">
                Artikel & studi kasus
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-neutral-700 hover:text-mib">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {config.company_name}. Specialty chemicals & maklon kimia industri.
      </div>
    </footer>
  );
}
