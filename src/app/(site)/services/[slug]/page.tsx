import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryIcon } from "@/components/industry-icon";
import { MarkdownBody } from "@/components/markdown-body";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { getServiceBySlug, getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const { slug } = params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return buildPageMetadata(await getSiteConfig(), {
      title: "Layanan",
      path: `/services/${slug}`,
    });
  }
  return buildPageMetadata(await getSiteConfig(), {
    title: service.seo_title || service.title,
    description: service.seo_description || service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        narrow
        title={service.title}
        subtitle={service.summary}
        top={
          <>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
              <ol className="flex flex-wrap gap-2">
                <li>
                  <Link href="/services" className="hover:text-mib">
                    Layanan
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="text-mib-ink">{service.title}</li>
              </ol>
            </nav>
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-mib/10 text-mib shadow-glow">
              <IndustryIcon industryKey={service.icon_key} className="text-current" />
            </div>
          </>
        }
      />

      <article className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal from="up">
            <MarkdownBody content={service.body_md} />
          </ScrollReveal>

          <ScrollReveal delay={0.08} from="up" className="mt-12">
            <Link
              href="/contact"
              className="shine-hover group inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-6 py-3 font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
            >
              Diskusikan kebutuhan Anda
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </ScrollReveal>
        </div>
      </article>
    </>
  );
}
