import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FALLBACK_SITE_CONFIG, siteUrl } from "@/lib/constants";
import { getSiteConfig } from "@/lib/data/queries";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const cfg = await getSiteConfig();
  const base = cfg ?? FALLBACK_SITE_CONFIG;
  const fav = base.favicon_url?.trim();
  const icons =
    fav && fav.length > 0
      ? {
          icon: [{ url: fav }],
          shortcut: fav,
        }
      : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: base.meta_title_default,
      template: `%s | ${base.company_name}`,
    },
    description: base.meta_description_default,
    keywords: base.site_keywords,
    ...(icons ? { icons } : {}),
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: base.company_name,
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
