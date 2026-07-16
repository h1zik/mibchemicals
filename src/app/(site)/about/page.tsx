import { MarkdownBody } from "@/components/markdown-body";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StatCounter } from "@/components/stat-counter";
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

      {/* Statistik perusahaan */}
      {cfg.company_stats_json.length > 0 ? (
        <section className="relative overflow-hidden bg-mib-ink py-14 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-dark" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 sm:px-6 lg:grid-cols-4">
            {cfg.company_stats_json.map((s, i) => (
              <ScrollReveal key={`${s.label}-${i}`} delay={i * 0.08} from="up" className="text-center">
                <p className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <span className="text-gradient-mib">
                    <StatCounter value={s.value} suffix={s.suffix} />
                  </span>
                </p>
                <p className="mx-auto mt-2 max-w-[12rem] text-sm text-neutral-400">{s.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Sertifikasi */}
      {cfg.certifications_json.length > 0 ? (
        <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Sertifikasi</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-mib-ink sm:text-3xl">
                Standar &amp; sertifikasi
              </h2>
            </ScrollReveal>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cfg.certifications_json.map((c, i) => (
                <li key={`${c.name}-${i}`}>
                  <ScrollReveal delay={i * 0.06} from="up" className="h-full">
                    <div className="flex h-full items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
                      {c.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image_url} alt="" className="h-12 w-12 shrink-0 rounded object-contain" />
                      ) : null}
                      <div>
                        <p className="font-bold text-mib-ink">{c.name}</p>
                        {c.description ? <p className="mt-1 text-sm leading-relaxed text-neutral-600">{c.description}</p> : null}
                      </div>
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Galeri foto */}
      {cfg.about_gallery_json.length > 0 ? (
        <section className="border-t border-neutral-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Galeri</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-mib-ink sm:text-3xl">
                Fasilitas &amp; tim kami
              </h2>
            </ScrollReveal>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {cfg.about_gallery_json.map((img, i) => (
                <li key={`${img.url}-${i}`}>
                  <ScrollReveal delay={i * 0.04} from="up" scale>
                    <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.alt ?? ""} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105" />
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
