import { MarkdownBody } from "@/components/markdown-body";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const cfg = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;
  const title = cfg.about_page_seo_title?.trim() || cfg.about_page_title;
  const description =
    cfg.about_page_seo_description?.trim() ||
    cfg.about_page_subtitle.trim() ||
    `Profil ${cfg.company_name} — specialty chemicals & maklon kimia industri.`;
  return buildPageMetadata(await getSiteConfig(), {
    title,
    description,
    path: "/about",
  });
}

export default async function AboutPage() {
  const cfg = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;

  return (
    <>
      <PageHero
        eyebrow="Profil"
        title={cfg.about_page_title}
        subtitle={cfg.about_page_subtitle.trim() ? cfg.about_page_subtitle : undefined}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal from="up">
            <div className="relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-card sm:p-10">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-mib-gradient" />
              <MarkdownBody content={cfg.about_page_body_md} />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
