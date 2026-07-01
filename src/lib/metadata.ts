import type { Metadata } from "next";
import { FALLBACK_SITE_CONFIG, siteUrl } from "@/lib/constants";
import type { SiteConfig } from "@/types/database";

export function buildPageMetadata(
  config: SiteConfig | null,
  opts: {
    title: string;
    description?: string;
    path?: string;
    keywords?: string[];
    /**
     * Tambahkan " | {company_name}" di belakang judul. Default true.
     * Set false untuk halaman yang judulnya sudah lengkap (mis. homepage
     * yang memakai meta_title_default).
     */
    appendCompany?: boolean;
  }
): Metadata {
  const base = config ?? FALLBACK_SITE_CONFIG;
  const description =
    opts.description ?? base.meta_description_default;
  const title =
    opts.appendCompany === false
      ? opts.title
      : `${opts.title} | ${base.company_name}`;
  const keywordStr = [
    ...(opts.keywords ?? []),
    ...base.site_keywords.split(",").map((k) => k.trim()),
    "specialty chemicals",
    "maklon kimia industri",
  ]
    .filter(Boolean)
    .join(", ");

  const url = opts.path ? new URL(opts.path, siteUrl).toString() : siteUrl;

  return {
    // absolute: cegah root layout template ("%s | company") membungkus ulang
    // judul yang sudah lengkap ini (kalau tidak, jadi ganda/tiga kali).
    title: { absolute: title },
    description,
    keywords: keywordStr,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: base.company_name,
      locale: "id_ID",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}
