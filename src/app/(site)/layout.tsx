import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { getSiteConfig } from "@/lib/data/queries";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-mib focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten
      </a>
      <SiteHeader config={config} />
      <main id="main-content">{children}</main>
      <SiteFooter config={config} />
    </>
  );
}
