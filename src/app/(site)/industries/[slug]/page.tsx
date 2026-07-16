import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryIcon } from "@/components/industry-icon";
import { MarkdownBody } from "@/components/markdown-body";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  getIndustryBySlug,
  getSolutionsByIndustry,
  getSiteConfig,
} from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const industry = await getIndustryBySlug(params.slug);
  if (!industry) {
    return buildPageMetadata(await getSiteConfig(), { title: "Industri", path: `/industries/${params.slug}` });
  }
  return buildPageMetadata(await getSiteConfig(), {
    title: industry.seo_title || `Solusi Industri ${industry.name}`,
    description: industry.seo_description || industry.summary,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: Props) {
  const industry = await getIndustryBySlug(params.slug);
  if (!industry || !industry.published) notFound();
  const solutions = (await getSolutionsByIndustry(industry.id)).filter((s) => s.published);

  return (
    <>
      {/* Hero foto */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-mib-ink">
        {industry.hero_image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={industry.hero_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-mib-ink via-mib-ink/70 to-mib-ink/30" />
          </>
        ) : (
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-dark" />
        )}
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-neutral-300">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/industries" className="hover:text-white">Industri</Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white">{industry.name}</li>
            </ol>
          </nav>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur">
            <IndustryIcon industryKey={industry.icon_key} className="h-7 w-7 text-current" />
          </div>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {industry.name}
          </h1>
          {industry.summary ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-200">{industry.summary}</p>
          ) : null}
        </div>
      </section>

      {/* Intro / konteks masalah */}
      {industry.intro_md ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <ScrollReveal from="up">
              <MarkdownBody content={industry.intro_md} />
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* Ilustrasi proses */}
      {industry.process_image_url ? (
        <section className="border-t border-neutral-200 bg-neutral-50 py-14 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <ScrollReveal from="up">
              <h2 className="font-display text-2xl font-bold tracking-tight text-mib-ink">Ilustrasi proses industri</h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={industry.process_image_url} alt={`Proses industri ${industry.name}`} className="w-full" loading="lazy" />
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* Tabel Masalah–Solusi */}
      <section className="border-t border-neutral-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal from="up">
            <p className="text-sm font-semibold uppercase tracking-wider text-mib">Masalah &amp; Solusi</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl">
              Tabel masalah dan solusi di industri {industry.name}
            </h2>
          </ScrollReveal>

          {solutions.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-neutral-600">
              Belum ada solusi terhubung untuk industri ini.
            </p>
          ) : (
            <ScrollReveal from="up" className="mt-8">
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-card">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-mib-ink text-white">
                      <th className="px-4 py-3 font-semibold">No</th>
                      <th className="px-4 py-3 font-semibold">Equipment</th>
                      <th className="px-4 py-3 font-semibold">Masalah</th>
                      <th className="px-4 py-3 font-semibold">Solusi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {solutions.map((s, i) => (
                      <tr key={s.id} className="bg-white transition hover:bg-mib/[0.04]">
                        <td className="px-4 py-3 text-neutral-500">{i + 1}</td>
                        <td className="px-4 py-3">
                          <Link href={`/solutions/${s.slug}`} className="font-semibold text-mib hover:text-mib-dark">
                            {s.equipment || s.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-neutral-700">{s.problem || "—"}</td>
                        <td className="px-4 py-3 text-neutral-700">{s.solution_label || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal from="up" className="mt-12 text-center">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8">
              <h3 className="font-display text-xl font-bold text-mib-ink">
                Konsultasikan tantangan di industri {industry.name}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-neutral-600">
                Tim teknis kami siap membantu dari assessment hingga implementasi di lapangan.
              </p>
              <Link
                href="/contact"
                className="shine-hover group mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-6 py-3 font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                Hubungi tim kami
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
