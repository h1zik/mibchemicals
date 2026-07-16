import Link from "next/link";
import { IndustryIcon } from "@/components/industry-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StatCounter } from "@/components/stat-counter";
import { IndustryFinder } from "@/components/industry-finder";
import { SolutionSection } from "@/components/solution-section";
import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { SITE_PHOTOS } from "@/lib/site-photos";
import {
  getIndustries,
  getPosts,
  getServices,
  getSolutions,
  getSiteConfig,
  getTestimonials,
} from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;
  return buildPageMetadata(await getSiteConfig(), {
    title: config.meta_title_default,
    appendCompany: false,
    description: config.meta_description_default,
    path: "/",
    keywords: ["specialty chemicals", "solusi kimia industri", "MIB Chemicals"],
  });
}

export default async function HomePage() {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;
  const [industries, solutions, services, posts, testimonials] = await Promise.all([
    getIndustries(),
    getSolutions(),
    getServices(),
    getPosts(),
    getTestimonials(),
  ]);

  const pubIndustries = industries.filter((i) => i.published);
  const homeIndustries = pubIndustries.slice(0, 6);
  const homeSolutions = solutions.filter((s) => s.published).slice(0, 6);
  const homeServices = services.filter((s) => s.published).slice(0, 4);
  const caseStudies = posts.filter((p) => p.published && p.post_type === "case_study").slice(0, 3);
  const homePosts = posts.filter((p) => p.published && p.post_type === "news").slice(0, 3);
  const pubTestimonials = testimonials.filter((t) => t.published).slice(0, 6);
  const stats = config.company_stats_json;
  const certs = config.certifications_json;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.company_name,
    description: config.company_tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    email: config.contact_email,
    telephone: config.contact_phone,
    address: { "@type": "PostalAddress", addressCountry: config.contact_address },
    areaServed: pubIndustries.map((i) => i.name),
    knowsAbout: ["Specialty Chemicals", "Engineering", "Jasa Kimia Industri"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid mask-fade" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-mib/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-mib-lime/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_520px]">
          <ScrollReveal from="up">
            <span className="inline-flex items-center gap-2 rounded-full border border-mib/25 bg-mib/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mib-dark">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-mib" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mib" />
              </span>
              Kimia · Engineering · Jasa
            </span>

            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-mib-ink sm:text-5xl lg:text-6xl">
              {config.hero_title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">{config.hero_subtitle}</p>

            <div className="mt-8 max-w-xl">
              <IndustryFinder options={pubIndustries.map((i) => ({ slug: i.slug, name: i.name }))} />
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/solutions"
                className="shine-hover group inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                Lihat solusi kami
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href={config.hero_primary_cta_url}
                className="inline-flex items-center justify-center rounded-lg border-2 border-mib/30 bg-white/60 px-7 py-3.5 text-base font-semibold text-mib-dark backdrop-blur transition-all duration-300 hover:border-mib hover:bg-mib/5"
              >
                {config.hero_primary_cta_label}
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal from="right" delay={0.1} scale className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mib-radial blur-2xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 shadow-card-hover">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_PHOTOS.heroWarehouse}
                alt="Fasilitas dan produk MIB Chemicals"
                className="aspect-[4/3] w-full object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-mib-ink/30 to-transparent" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------- CREDIBILITY (stats + sertifikasi) ---------- */}
      {stats.length > 0 || certs.length > 0 ? (
        <section className="relative overflow-hidden bg-mib-ink" aria-label="Kredibilitas">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-dark" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-mib/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
            {stats.length > 0 ? (
              <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
                {stats.map((s, i) => (
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
            ) : null}

            {certs.length > 0 ? (
              <ScrollReveal from="up" className={stats.length > 0 ? "mt-12 border-t border-white/10 pt-10" : ""}>
                <p className="text-center text-xs font-semibold uppercase tracking-wider text-mib-lime">
                  Sertifikasi &amp; standar
                </p>
                <ul className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  {certs.map((c, i) => (
                    <li
                      key={`${c.name}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                      title={c.description}
                    >
                      {c.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.image_url} alt="" className="h-10 w-10 rounded object-contain" />
                      ) : null}
                      <span className="text-sm font-semibold text-white">{c.name}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            ) : null}
          </div>
        </section>
      ) : null}

      <SolutionSection config={config} />

      {/* ---------- INDUSTRIES ---------- */}
      <section className="relative overflow-hidden bg-neutral-50 py-20 sm:py-24" aria-labelledby="industries-heading">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-50 mask-fade" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Sektor</p>
              <h2 id="industries-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl">
                Solusi di setiap industri
              </h2>
              <p className="mt-3 max-w-2xl text-neutral-600">
                Setiap industri punya tantangan spesifik. Telusuri solusi kami per sektor.
              </p>
            </div>
            <Link href="/industries" className="group inline-flex items-center gap-1 font-semibold text-mib">
              Semua industri
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </ScrollReveal>

          {homeIndustries.length === 0 ? (
            <p className="mt-10 text-neutral-500">Belum ada industri publikasi. Tambahkan di dashboard admin.</p>
          ) : (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homeIndustries.map((ind, i) => (
                <li key={ind.id}>
                  <ScrollReveal delay={i * 0.06} from="up" scale className="h-full">
                    <Link
                      href={`/industries/${ind.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                        {ind.hero_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={ind.hero_image_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-mib/5">
                            <IndustryIcon industryKey={ind.icon_key} className="h-12 w-12 text-mib/40" />
                          </div>
                        )}
                        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-mib-ink/55 to-transparent opacity-70" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-mib shadow-sm">
                            <IndustryIcon industryKey={ind.icon_key} className="h-5 w-5 text-current" />
                          </span>
                          <h3 className="font-display text-lg font-bold text-white drop-shadow">{ind.name}</h3>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{ind.summary}</p>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---------- SOLUTIONS ---------- */}
      {homeSolutions.length > 0 ? (
        <section className="border-t border-neutral-200 bg-white py-20 sm:py-24" aria-labelledby="solutions-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-mib">Problem &amp; Solusi</p>
                <h2 id="solutions-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl">
                  Solusi untuk tantangan nyata
                </h2>
                <p className="mt-2 max-w-2xl text-neutral-600">
                  Masalah operasional di lapangan dan bagaimana kami menyelesaikannya.
                </p>
              </div>
              <Link href="/solutions" className="group inline-flex items-center gap-1 font-semibold text-mib">
                Semua solusi
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </ScrollReveal>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homeSolutions.map((s, i) => (
                <li key={s.id}>
                  <ScrollReveal delay={i * 0.06} from="up" className="h-full">
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:bg-white hover:shadow-card-hover"
                    >
                      {s.industry ? (
                        <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                          Industri {s.industry.name}
                        </p>
                      ) : null}
                      <h3 className="mt-2 text-lg font-bold leading-snug text-mib-ink">{s.title}</h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">{s.summary || s.problem}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                        Baca
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---------- SERVICES ---------- */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-24" aria-labelledby="services-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Kapabilitas</p>
              <h2 id="services-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl">
                Layanan
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Dari assessment, formulasi, hingga dukungan teknis di lapangan.
              </p>
            </div>
            <Link href="/services" className="group inline-flex items-center gap-1 font-semibold text-mib">
              Semua layanan
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </ScrollReveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {homeServices.length === 0 ? (
              <li className="text-neutral-500">Belum ada layanan publikasi.</li>
            ) : (
              homeServices.map((s, i) => (
                <li key={s.id}>
                  <ScrollReveal delay={i * 0.06} from="up" className="h-full">
                    <Link
                      href={`/services/${s.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-mib-gradient transition-transform duration-300 group-hover:scale-x-100" />
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-mib/10 text-mib transition-colors duration-300 group-hover:bg-mib group-hover:text-white">
                        <IndustryIcon industryKey={s.icon_key} className="shrink-0 text-current" />
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-mib-ink">{s.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{s.summary}</p>
                    </Link>
                  </ScrollReveal>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* ---------- SUCCESS STORIES ---------- */}
      {caseStudies.length > 0 ? (
        <section className="border-t border-neutral-200 bg-white py-20 sm:py-24" aria-labelledby="cases-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-mib">Cerita sukses</p>
                <h2 id="cases-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl">
                  Bermitra menyelesaikan tantangan
                </h2>
              </div>
              <Link href="/articles" className="group inline-flex items-center gap-1 font-semibold text-mib">
                Semua cerita
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </ScrollReveal>
            <ul className="mt-10 grid gap-6 lg:grid-cols-3">
              {caseStudies.map((post, i) => (
                <li key={post.id}>
                  <ScrollReveal delay={i * 0.07} from="up" scale className="h-full">
                    <Link
                      href={`/articles/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      {post.cover_image_url ? (
                        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.cover_image_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="flex aspect-[16/10] w-full items-center justify-center bg-mib/5 font-display text-2xl font-bold text-mib/40">
                          MIB
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-mib">Studi kasus</p>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-mib-ink">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---------- TESTIMONIALS ---------- */}
      {pubTestimonials.length > 0 ? (
        <section className="border-t border-neutral-200 bg-neutral-50 py-20 sm:py-24" aria-labelledby="testi-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Testimoni</p>
              <h2 id="testi-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl">
                Apa kata mitra kami
              </h2>
            </ScrollReveal>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pubTestimonials.map((t, i) => (
                <li key={t.id}>
                  <ScrollReveal delay={i * 0.06} from="up" className="h-full">
                    <figure className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
                      {t.rating ? (
                        <div className="mb-3 flex gap-0.5 text-mib-lime" aria-label={`${t.rating} dari 5`}>
                          {Array.from({ length: 5 }).map((_, j) => (
                            <span key={j} className={j < (t.rating ?? 0) ? "text-mib" : "text-neutral-200"}>★</span>
                          ))}
                        </div>
                      ) : null}
                      <blockquote className="flex-1 text-sm leading-relaxed text-neutral-700">“{t.quote}”</blockquote>
                      <figcaption className="mt-5 flex items-center gap-3 border-t border-neutral-100 pt-4">
                        {t.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mib/10 text-sm font-bold text-mib">
                            {t.author_name.charAt(0)}
                          </span>
                        )}
                        <div>
                          <p className="text-sm font-bold text-mib-ink">{t.author_name}</p>
                          {t.author_role ? <p className="text-xs text-neutral-500">{t.author_role}</p> : null}
                        </div>
                      </figcaption>
                    </figure>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---------- ARTICLES ---------- */}
      {homePosts.length > 0 ? (
        <section className="border-t border-neutral-200 bg-white py-20 sm:py-24" aria-labelledby="articles-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-mib">Insight</p>
                <h2 id="articles-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl">
                  Artikel &amp; insight
                </h2>
              </div>
              <Link href="/articles" className="group inline-flex items-center gap-1 font-semibold text-mib">
                Semua artikel
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </ScrollReveal>
            <ul className="mt-10 grid gap-6 lg:grid-cols-3">
              {homePosts.map((post, i) => (
                <li key={post.id}>
                  <ScrollReveal delay={i * 0.07} from="up" scale className="h-full">
                    <Link
                      href={`/articles/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      {post.cover_image_url ? (
                        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={post.cover_image_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center bg-mib/5 font-display text-2xl font-bold text-mib/40">
                          MIB
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                          {post.post_category?.name ?? "Berita"}
                        </p>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-mib-ink">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ---------- CLOSING CTA ---------- */}
      <section className="relative overflow-hidden bg-mib-ink py-20 sm:py-24" aria-labelledby="cta-heading">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-dark" />
        <div aria-hidden className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-mib/25 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-mib-lime/15 blur-3xl" />
        <ScrollReveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 id="cta-heading" className="text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Siap diskusikan kebutuhan kimia industri Anda?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
            Tim teknis kami siap membantu dari assessment, formulasi, hingga implementasi di lapangan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={config.hero_primary_cta_url}
              className="shine-hover group inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
            >
              {config.hero_primary_cta_label}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/5"
            >
              Lihat solusi kami
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
