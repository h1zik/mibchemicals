import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownBody } from "@/components/markdown-body";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getSolutionBySlug, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const solution = await getSolutionBySlug(params.slug);
  if (!solution) {
    return buildPageMetadata(await getSiteConfig(), { title: "Solusi", path: `/solutions/${params.slug}` });
  }
  return buildPageMetadata(await getSiteConfig(), {
    title: solution.seo_title || solution.title,
    description: solution.seo_description || solution.summary || solution.problem,
    path: `/solutions/${solution.slug}`,
  });
}

export default async function SolutionDetailPage({ params }: Props) {
  const solution = await getSolutionBySlug(params.slug);
  if (!solution || !solution.published) notFound();

  return (
    <>
      <PageHero
        narrow
        title={solution.title}
        subtitle={solution.summary || undefined}
        top={
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/solutions" className="hover:text-mib">Solusi</Link>
              </li>
              {solution.industry ? (
                <>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href={`/industries/${solution.industry.slug}`} className="hover:text-mib">
                      {solution.industry.name}
                    </Link>
                  </li>
                </>
              ) : null}
              <li aria-hidden>/</li>
              <li className="text-mib-ink">{solution.title}</li>
            </ol>
          </nav>
        }
      />

      <article className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {solution.image_url ? (
            <ScrollReveal from="up" className="mb-8">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={solution.image_url} alt="" className="w-full" />
              </div>
            </ScrollReveal>
          ) : null}

          {/* Ringkasan Masalah & Solusi */}
          {(solution.problem || solution.solution_label || solution.equipment) ? (
            <ScrollReveal from="up" className="mb-10">
              <dl className="grid gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:grid-cols-3">
                {solution.equipment ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-mib">Equipment</dt>
                    <dd className="mt-1 text-sm font-medium text-mib-ink">{solution.equipment}</dd>
                  </div>
                ) : null}
                {solution.problem ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-mib">Masalah</dt>
                    <dd className="mt-1 text-sm font-medium text-mib-ink">{solution.problem}</dd>
                  </div>
                ) : null}
                {solution.solution_label ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-mib">Solusi</dt>
                    <dd className="mt-1 text-sm font-medium text-mib-ink">{solution.solution_label}</dd>
                  </div>
                ) : null}
              </dl>
            </ScrollReveal>
          ) : null}

          {solution.body_md ? (
            <ScrollReveal from="up">
              <MarkdownBody content={solution.body_md} />
            </ScrollReveal>
          ) : null}

          <ScrollReveal delay={0.08} from="up" className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="shine-hover group inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-6 py-3 font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
            >
              Diskusikan kebutuhan Anda
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            {solution.industry ? (
              <Link
                href={`/industries/${solution.industry.slug}`}
                className="inline-flex items-center justify-center rounded-lg border-2 border-mib/30 px-6 py-3 font-semibold text-mib-dark transition hover:border-mib hover:bg-mib/5"
              >
                Solusi lain di {solution.industry.name}
              </Link>
            ) : null}
          </ScrollReveal>
        </div>
      </article>
    </>
  );
}
