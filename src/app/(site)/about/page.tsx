import { MarkdownBody } from "@/components/markdown-body";
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
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <ScrollReveal>
        <header className="border-b border-neutral-200 pb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">{cfg.about_page_title}</h1>
          {cfg.about_page_subtitle.trim() ? (
            <p className="mt-4 text-lg text-neutral-600">{cfg.about_page_subtitle}</p>
          ) : null}
        </header>
        <div className="pt-10">
          <MarkdownBody content={cfg.about_page_body_md} />
        </div>
      </ScrollReveal>
    </div>
  );
}
