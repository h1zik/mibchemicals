import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PageHero } from "@/components/page-hero";
import { getIndustries, getSolutions, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return buildPageMetadata(await getSiteConfig(), {
    title: "Solusi",
    description:
      "Kumpulan solusi problem–solution MIB Chemicals: masalah nyata di lapangan dan solusi kimia, engineering, serta jasa yang menyelesaikannya.",
    path: "/solutions",
    keywords: ["problem solusi", "solusi kimia industri"],
  });
}

type Props = { searchParams: { industry?: string } };

export default async function SolutionsPage({ searchParams }: Props) {
  const [allSolutions, industries] = await Promise.all([getSolutions(), getIndustries()]);
  const published = allSolutions.filter((s) => s.published);
  const activeIndustry = searchParams.industry?.trim() || "";
  const solutions = activeIndustry
    ? published.filter((s) => s.industry?.slug === activeIndustry)
    : published;

  const usedIndustries = industries.filter(
    (ind) => ind.published && published.some((s) => s.industry?.slug === ind.slug)
  );

  return (
    <>
      <PageHero
        eyebrow="Problem & Solusi"
        title="Semua masalah industri ada solusinya"
        subtitle="Telusuri tantangan operasional nyata dan bagaimana kombinasi kimia, engineering, dan jasa kami menyelesaikannya."
      />

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {usedIndustries.length > 0 ? (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/solutions"
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  activeIndustry === ""
                    ? "border-mib bg-mib text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-mib/40"
                }`}
              >
                Semua
              </Link>
              {usedIndustries.map((ind) => (
                <Link
                  key={ind.id}
                  href={`/solutions?industry=${ind.slug}`}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    activeIndustry === ind.slug
                      ? "border-mib bg-mib text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-mib/40"
                  }`}
                >
                  {ind.name}
                </Link>
              ))}
            </div>
          ) : null}

          {solutions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-neutral-600">
              Belum ada solusi dipublikasikan{activeIndustry ? " untuk industri ini" : ""}.
            </p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {solutions.map((s, i) => (
                <li key={s.id}>
                  <ScrollReveal delay={i * 0.05} from="up" scale className="h-full">
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      {s.image_url ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.image_url}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6">
                        {s.industry ? (
                          <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                            Solusi Industri {s.industry.name}
                          </p>
                        ) : (
                          <p className="text-xs font-semibold uppercase tracking-wide text-mib">Solusi Industri</p>
                        )}
                        <h2 className="mt-2 text-lg font-bold leading-snug text-mib-ink">{s.title}</h2>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
                          {s.summary || s.problem}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                          Baca selengkapnya
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
