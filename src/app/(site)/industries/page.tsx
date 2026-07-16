import Link from "next/link";
import { IndustryIcon } from "@/components/industry-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PageHero } from "@/components/page-hero";
import { getIndustries, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata(await getSiteConfig(), {
    title: "Industri",
    description:
      "Solusi specialty chemicals, engineering, dan jasa MIB Chemicals untuk setiap tantangan industri.",
    path: "/industries",
    keywords: ["solusi industri", "kimia industri"],
  });
}

export default async function IndustriesPage() {
  const industries = (await getIndustries()).filter((i) => i.published);

  return (
    <>
      <PageHero
        eyebrow="Sektor"
        title="Solusi di setiap tantangan industri"
        subtitle="Setiap industri punya permasalahan yang kompleks. Kami menyelesaikannya lewat kombinasi kimia, engineering, dan jasa teknis di lapangan."
      />

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {industries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-neutral-600">
              Belum ada industri dipublikasikan. Tambahkan lewat dashboard admin.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind, i) => (
                <li key={ind.id}>
                  <ScrollReveal delay={i * 0.05} from="up" scale className="h-full">
                    <Link
                      href={`/industries/${ind.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                        {ind.hero_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ind.hero_image_url}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-mib/5">
                            <IndustryIcon industryKey={ind.icon_key} className="h-12 w-12 text-mib/40" />
                          </div>
                        )}
                        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-mib-ink/50 to-transparent opacity-70" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-mib shadow-sm">
                            <IndustryIcon industryKey={ind.icon_key} className="h-5 w-5 text-current" />
                          </span>
                          <h2 className="font-display text-lg font-bold text-white drop-shadow">{ind.name}</h2>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">{ind.summary}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                          Lihat solusi
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
