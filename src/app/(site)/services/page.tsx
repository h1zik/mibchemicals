import Link from "next/link";
import { IndustryIcon } from "@/components/industry-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PageHero } from "@/components/page-hero";
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
    <>
      <PageHero
        eyebrow="Kapabilitas"
        title="Layanan"
        subtitle="Solusi dan kapabilitas kimia industri — dari assessment, formulasi, hingga dukungan teknis di lapangan."
      />

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid gap-6 sm:grid-cols-2">
            {services.length === 0 ? (
              <li className="sm:col-span-2 rounded-2xl border border-dashed border-neutral-300 p-8 text-neutral-600">
                Tidak ada layanan publik. Periksa koneksi Supabase atau status published.
              </li>
            ) : (
              services.map((s, i) => (
                <li key={s.id}>
                  <ScrollReveal delay={i * 0.06} from="up" className="h-full">
                    <Link
                      href={`/services/${s.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-mib-gradient transition-transform duration-300 group-hover:scale-x-100"
                      />
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-mib/10 text-mib transition-colors duration-300 group-hover:bg-mib group-hover:text-white">
                        <IndustryIcon industryKey={s.icon_key} className="shrink-0 text-current" />
                      </div>
                      <h2 className="mt-5 text-xl font-bold text-mib-ink">{s.title}</h2>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">{s.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                        Detail layanan
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </ScrollReveal>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
