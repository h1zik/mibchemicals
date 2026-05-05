import Link from "next/link";
import { IndustryIcon } from "@/components/industry-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
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
    title: config.company_name,
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
      <ScrollReveal className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-mib">
              B2B · Oil & Gas · Manufacturing · Mining · Water Treatment
            </p>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {config.hero_title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-neutral-600">{config.hero_subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={config.hero_primary_cta_url}
                className="inline-flex items-center justify-center rounded border-2 border-mib bg-mib px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-mib-dark"
              >
                {config.hero_primary_cta_label}
              </Link>
              <Link
                href={config.hero_secondary_cta_url}
                className="inline-flex items-center justify-center rounded border-2 border-mib px-6 py-3 text-base font-semibold text-mib transition hover:bg-mib/5"
              >
                {config.hero_secondary_cta_label}
              </Link>
            </div>
          </div>
          <HeroManufacturingVisual />
        </div>
      </ScrollReveal>

      <SolutionSection config={config} />

      <section className="bg-neutral-50 py-16 sm:py-20" aria-labelledby="industries-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <h2
              id="industries-heading"
              className="text-3xl font-bold tracking-tight text-foreground"
            >
              Sektor yang dilayani
            </h2>
            <p className="mt-3 max-w-2xl text-neutral-600">
              Konten sektor dapat diubah dari Supabase (JSON industri) tanpa deploy ulang.
            </p>
          </ScrollReveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {config.industries_json.map((ind, i) => (
              <li key={ind.key}>
                <ScrollReveal delay={i * 0.06} className="h-full">
                  <div className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                    <IndustryIcon industryKey={resolveIndustryIconKey(ind)} />
                    <h3 className="mt-4 text-lg font-bold text-foreground">{ind.name}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{ind.summary}</p>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-white py-16 sm:py-20" aria-labelledby="services-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="services-heading"
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Layanan
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Solusi dan kapabilitas kimia industri — dari assessment hingga dukungan teknis.
              </p>
            </div>
            <Link href="/services" className="font-semibold text-mib hover:underline">
              Semua layanan →
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
                  <ScrollReveal delay={i * 0.06} className="h-full">
                    <Link
                      href={`/services/${s.slug}`}
                      className="flex h-full flex-col rounded-lg border border-neutral-200 bg-neutral-50/50 p-6 shadow-sm transition hover:border-mib hover:bg-white hover:shadow-md"
                    >
                      <IndustryIcon industryKey={s.icon_key} className="shrink-0" />
                      <h3 className="mt-4 text-xl font-bold text-foreground">{s.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{s.summary}</p>
                      <span className="mt-4 text-sm font-semibold text-mib">Detail →</span>
                    </Link>
                  </ScrollReveal>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="products-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="products-heading"
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Produk unggulan
              </h2>
              <p className="mt-2 text-neutral-600">
                Specialty chemicals dengan spesifikasi teknis dan MSDS.
              </p>
            </div>
            <Link href="/products" className="font-semibold text-mib hover:underline">
              Katalog lengkap →
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
                    <ScrollReveal delay={i * 0.07} className="h-full">
                      <Link
                        href={`/products/${p.slug}`}
                        className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:border-mib hover:shadow-md"
                      >
                        {thumb ? (
                          <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden bg-neutral-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumb}
                              alt=""
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        ) : null}
                        <div className="p-6">
                          <p className="text-xs font-semibold uppercase text-mib">
                            {p.product_category?.name ?? "—"}
                          </p>
                          <h3 className="mt-2 text-xl font-bold text-foreground">{p.name}</h3>
                          <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{p.description_md}</p>
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

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20" aria-labelledby="articles-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="articles-heading"
                className="text-3xl font-bold tracking-tight text-foreground"
              >
                Artikel & insight
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Berita industri, studi kasus, dan pembaruan dari tim MIB Chemicals.
              </p>
            </div>
            <Link href="/articles" className="font-semibold text-mib hover:underline">
              Semua artikel →
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
                  <ScrollReveal delay={i * 0.07} className="h-full">
                    <Link
                      href={`/articles/${post.slug}`}
                      className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:border-mib hover:shadow-md"
                    >
                      {post.cover_image_url ? (
                        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center bg-neutral-100 text-sm font-semibold text-neutral-400">
                          MIB
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-xs font-semibold uppercase text-mib">
                          {post.post_category?.name ??
                            (post.post_type === "case_study" ? "Studi kasus" : "Berita")}
                        </p>
                        <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">{post.title}</h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm text-neutral-600">{post.excerpt}</p>
                        <span className="mt-4 text-sm font-semibold text-mib">Baca →</span>
                      </div>
                    </Link>
                  </ScrollReveal>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
