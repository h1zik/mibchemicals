import Link from "next/link";
import { IndustryIcon } from "@/components/industry-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getServices, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata(await getSiteConfig(), {
    title: "Layanan",
    description: "Layanan specialty chemicals dan maklon kimia industri MIB Chemicals.",
    path: "/services",
    keywords: ["maklon kimia industri", "technical support"],
  });
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <ScrollReveal className="max-w-3xl">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Layanan</h1>
          <p className="mt-4 text-lg text-neutral-600">
            Modul layanan sepenuhnya dikelola dari Supabase: judul, ikon, deskripsi, dan SEO.
          </p>
        </header>
      </ScrollReveal>
      <ul className="mt-12 space-y-6">
        {services.length === 0 ? (
          <li className="rounded border border-dashed border-neutral-300 p-8 text-neutral-600">
            Tidak ada layanan publik. Periksa koneksi Supabase atau status published.
          </li>
        ) : (
          services.map((s, i) => (
            <li key={s.id}>
              <ScrollReveal delay={i * 0.06}>
                <article className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start">
                  <IndustryIcon industryKey={s.icon_key} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold text-foreground">
                      <Link href={`/services/${s.slug}`} className="hover:text-mib">
                        {s.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-neutral-600">{s.summary}</p>
                    <Link
                      href={`/services/${s.slug}`}
                      className="mt-4 inline-block text-sm font-semibold text-mib hover:underline"
                    >
                      Detail layanan →
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
