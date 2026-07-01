import Link from "next/link";
import { IndustryIcon } from "@/components/industry-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StatCounter } from "@/components/stat-counter";
import { HeroManufacturingVisual } from "@/components/hero-manufacturing-visual";
import { SolutionSection } from "@/components/solution-section";
import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { resolveIndustryIconKey } from "@/lib/industry-icon-keys";
import { getPosts, getProducts, getServices, getSiteConfig } from "@/lib/data/queries";
import { getProductCardImageUrl } from "@/lib/product-gallery";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;
  return buildPageMetadata(await getSiteConfig(), {
    // Homepage memakai judul SEO branded penuh dari admin (meta_title_default),
    // tanpa append nama perusahaan lagi supaya tidak dobel.
    title: config.meta_title_default,
    appendCompany: false,
    description: config.meta_description_default,
    path: "/",
    keywords: ["specialty chemicals", "maklon kimia industri", "MIB Chemicals"],
  });
}

export default async function HomePage() {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;
  const [products, services, posts] = await Promise.all([
    getProducts(),
    getServices(),
    getPosts(),
  ]);
  const featured = products.filter((p) => p.featured && p.published).slice(0, 4);
  const homeServices = services.filter((s) => s.published).slice(0, 4);
  const homePosts = posts.filter((p) => p.published).slice(0, 3);

  const stats = [
    { value: 4, suffix: "+", label: "Sektor industri dilayani" },
    { value: 100, suffix: "%", label: "Formulasi sesuai kebutuhan" },
    { value: 24, suffix: "/7", label: "Dukungan teknis tim ahli" },
    { value: products.length || 12, suffix: "+", label: "Produk specialty chemicals" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.company_name,
    description: config.company_tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    email: config.contact_email,
    telephone: config.contact_phone,
    address: { "@type": "PostalAddress", addressCountry: config.contact_address },
    areaServed: config.industries_json.map((i) => i.name),
    knowsAbout: ["Specialty Chemicals", "Maklon Kimia Industri"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        {/* layered backgrounds */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid mask-fade" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-mib/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-mib-lime/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,1fr)_500px]">
          <ScrollReveal from="up">
            <span className="inline-flex items-center gap-2 rounded-full border border-mib/25 bg-mib/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mib-dark">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-mib" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mib" />
              </span>
              B2B · Oil &amp; Gas · Manufacturing · Mining · Water Treatment
            </span>

            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-mib-ink sm:text-5xl lg:text-6xl">
              {config.hero_title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
              {config.hero_subtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={config.hero_primary_cta_url}
                className="shine-hover group inline-flex items-center justify-center gap-2 rounded-lg bg-mib-gradient px-7 py-3.5 text-base font-semibold text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                {config.hero_primary_cta_label}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href={config.hero_secondary_cta_url}
                className="inline-flex items-center justify-center rounded-lg border-2 border-mib/30 bg-white/60 px-7 py-3.5 text-base font-semibold text-mib-dark backdrop-blur transition-all duration-300 hover:border-mib hover:bg-mib/5"
              >
                {config.hero_secondary_cta_label}
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-500">
              {["Formulasi presisi", "QC konsisten", "Pendampingan lapangan"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-mib" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.1 3.1 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                  </svg>
                  <dt className="font-medium text-neutral-700">{t}</dt>
                </div>
              ))}
            </dl>
          </ScrollReveal>

          {/* visual — pipeline flow maklon, frameless & menyatu dengan hero */}
          <ScrollReveal from="right" delay={0.1} scale className="relative">
            {/* glow lembut tanpa tepi keras agar visual "berpijak" */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mib-radial blur-2xl"
            />
            <div className="relative">
              <HeroManufacturingVisual />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------- STATS BAND (dark) ---------- */}
      <section className="relative overflow-hidden bg-mib-ink" aria-label="Statistik">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-dark" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-mib/20 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.08} from="up" className="text-center">
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

      <SolutionSection config={config} />

      {/* ---------- INDUSTRIES ---------- */}
      <section className="relative overflow-hidden bg-neutral-50 py-20 sm:py-24" aria-labelledby="industries-heading">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-50 mask-fade" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-mib">Sektor</p>
            <h2
              id="industries-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl"
            >
              Sektor yang dilayani
            </h2>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Spesialisasi specialty chemicals untuk kebutuhan operasional lintas industri berat.
            </p>
          </ScrollReveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {config.industries_json.map((ind, i) => (
              <li key={ind.key}>
                <ScrollReveal delay={i * 0.06} from="up" scale className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover">
                    <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-mib-gradient transition-transform duration-300 group-hover:scale-x-100" />
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-mib/10 text-mib transition-colors duration-300 group-hover:bg-mib group-hover:text-white">
                      <IndustryIcon industryKey={resolveIndustryIconKey(ind)} className="text-current" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-mib-ink">{ind.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{ind.summary}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section className="border-t border-neutral-200 bg-white py-20 sm:py-24" aria-labelledby="services-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Kapabilitas</p>
              <h2
                id="services-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl"
              >
                Layanan
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Solusi dan kapabilitas kimia industri — dari assessment hingga dukungan teknis.
              </p>
            </div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-1 font-semibold text-mib"
            >
              Semua layanan
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </ScrollReveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {homeServices.length === 0 ? (
              <li className="text-neutral-500">
                Belum ada layanan publikasi. Tambahkan layanan di dashboard admin.
              </li>
            ) : (
              homeServices.map((s, i) => (
                <li key={s.id}>
                  <ScrollReveal delay={i * 0.06} from="up" className="h-full">
                    <Link
                      href={`/services/${s.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:bg-white hover:shadow-card-hover"
                    >
                      <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-mib-gradient transition-transform duration-300 group-hover:scale-x-100" />
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-mib/10 text-mib transition-colors duration-300 group-hover:bg-mib group-hover:text-white">
                        <IndustryIcon industryKey={s.icon_key} className="shrink-0 text-current" />
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-mib-ink">{s.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">{s.summary}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                        Detail
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </ScrollReveal>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {/* ---------- PRODUCTS ---------- */}
      <section className="bg-neutral-50 py-20 sm:py-24" aria-labelledby="products-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Katalog</p>
              <h2
                id="products-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl"
              >
                Produk unggulan
              </h2>
              <p className="mt-2 text-neutral-600">
                Specialty chemicals dengan spesifikasi teknis dan MSDS.
              </p>
            </div>
            <Link href="/products" className="group inline-flex items-center gap-1 font-semibold text-mib">
              Katalog lengkap
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </ScrollReveal>
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.length === 0 ? (
              <li className="text-neutral-500">
                Belum ada produk unggulan. Hubungkan Supabase atau tambahkan data di dashboard.
              </li>
            ) : (
              featured.map((p, i) => {
                const thumb = getProductCardImageUrl(p);
                return (
                  <li key={p.id}>
                    <ScrollReveal delay={i * 0.07} from="up" scale className="h-full">
                      <Link
                        href={`/products/${p.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                      >
                        {thumb ? (
                          <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-neutral-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumb}
                              alt=""
                              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-mib-ink/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div>
                        ) : null}
                        <div className="p-6">
                          <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                            {p.product_category?.name ?? "—"}
                          </p>
                          <h3 className="mt-2 text-xl font-bold text-mib-ink">{p.name}</h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{p.description_md}</p>
                        </div>
                      </Link>
                    </ScrollReveal>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </section>

      {/* ---------- ARTICLES ---------- */}
      <section className="border-t border-neutral-200 bg-white py-20 sm:py-24" aria-labelledby="articles-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-mib">Insight</p>
              <h2
                id="articles-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-mib-ink sm:text-4xl"
              >
                Artikel &amp; insight
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Berita industri, studi kasus, dan pembaruan dari tim MIB Chemicals.
              </p>
            </div>
            <Link href="/articles" className="group inline-flex items-center gap-1 font-semibold text-mib">
              Semua artikel
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </ScrollReveal>
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {homePosts.length === 0 ? (
              <li className="text-neutral-500 lg:col-span-3">
                Belum ada artikel terbit. Tulis artikel di dashboard admin.
              </li>
            ) : (
              homePosts.map((post, i) => (
                <li key={post.id}>
                  <ScrollReveal delay={i * 0.07} from="up" scale className="h-full">
                    <Link
                      href={`/articles/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-mib/40 hover:shadow-card-hover"
                    >
                      {post.cover_image_url ? (
                        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center bg-mib/5 font-display text-2xl font-bold text-mib/40">
                          MIB
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-mib">
                          {post.post_category?.name ??
                            (post.post_type === "case_study" ? "Studi kasus" : "Berita")}
                        </p>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-mib-ink">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-600">{post.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-mib">
                          Baca
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

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
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/5"
            >
              Lihat katalog produk
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
