import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { getSiteConfig } from "@/lib/data/queries";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;
  return buildPageMetadata(await getSiteConfig(), {
    title: "Kontak",
    description: `Hubungi ${config.company_name} untuk specialty chemicals dan maklon kimia industri.`,
    path: "/contact",
  });
}

const contactIcons = {
  address: (
    <path d="M10 2.5a5.5 5.5 0 0 0-5.5 5.5c0 3.9 5.5 9.5 5.5 9.5s5.5-5.6 5.5-9.5A5.5 5.5 0 0 0 10 2.5Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
  ),
  email: (
    <path d="M3 5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 2.2V14h14V7.2l-7 4.4-7-4.4Zm.9-.2L10 10.8 16.1 7H3.9Z" />
  ),
  phone: (
    <path d="M7.4 3.6 8.6 6a1 1 0 0 1-.25 1.1l-1 1a9 9 0 0 0 3.55 3.55l1-1A1 1 0 0 1 13 10.4l2.4 1.2a1 1 0 0 1 .55 1l-.3 2a1 1 0 0 1-1.1.85A12 12 0 0 1 3.55 4.45 1 1 0 0 1 4.4 3.35l2-.3a1 1 0 0 1 1 .55Z" />
  ),
};

export default async function ContactPage() {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;

  const details = [
    { key: "address", label: "Alamat", value: config.contact_address, href: undefined },
    { key: "email", label: "Email", value: config.contact_email, href: `mailto:${config.contact_email}` },
    {
      key: "phone",
      label: "Telepon",
      value: config.contact_phone,
      href: `tel:${config.contact_phone.replace(/\s/g, "")}`,
    },
  ] as const;

  return (
    <>
      <PageHero
        eyebrow="Hubungi kami"
        title="Mari diskusikan kebutuhan Anda"
        subtitle="Ceritakan tantangan proses Anda — tim teknis kami siap membantu dari assessment, formulasi, hingga implementasi di lapangan."
      />

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <ScrollReveal from="up">
            <div className="space-y-4">
              {details.map((d) => (
                <div
                  key={d.key}
                  className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-card"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-mib/10 text-mib">
                    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
                      {contactIcons[d.key]}
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-mib">{d.label}</p>
                    {d.href ? (
                      <a className="mt-1 block break-words font-medium text-mib-ink hover:text-mib" href={d.href}>
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-1 break-words font-medium text-mib-ink">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} from="up">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-mib-gradient" />
              <h2 className="font-display text-xl font-bold text-mib-ink">Formulir permintaan</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Isi formulir berikut, tim kami akan menghubungi Anda secepatnya.
              </p>
              <div className="mt-8">
                <LeadForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
