import Link from "next/link";
import { notFound } from "next/navigation";
import { IndustryIcon } from "@/components/industry-icon";
import { MarkdownBody } from "@/components/markdown-body";
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
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/services" className="hover:text-mib">
              Layanan
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground">{service.title}</li>
        </ol>
      </nav>
      <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
        <IndustryIcon industryKey={service.icon_key} className="h-12 w-12 shrink-0" />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{service.title}</h1>
          <p className="mt-4 text-lg text-neutral-600">{service.summary}</p>
        </div>
      </header>
      <div className="mt-10 border-t border-neutral-200 pt-10">
        <MarkdownBody content={service.body_md} />
      </div>
      <p className="mt-12">
        <Link
          href="/contact"
          className="inline-flex rounded border-2 border-mib bg-mib px-5 py-2.5 font-semibold text-white hover:bg-mib-dark"
        >
          Diskusikan kebutuhan Anda
        </Link>
      </p>
    </article>
  );
}
