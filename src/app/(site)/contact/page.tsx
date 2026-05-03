import { LeadForm } from "@/components/lead-form";
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

export default async function ContactPage() {
  const config = (await getSiteConfig()) ?? FALLBACK_SITE_CONFIG;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2">
        <ScrollReveal>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Kontak</h1>
            <p className="mt-4 text-lg text-neutral-600">
              Ceritakan tantangan proses Anda. Lead tersimpan aman di Supabase untuk tim internal.
            </p>
            <address className="mt-10 space-y-3 not-italic text-neutral-700">
              <p>
                <span className="font-semibold text-foreground">Alamat</span>
                <br />
                {config.contact_address}
              </p>
              <p>
                <span className="font-semibold text-foreground">Email</span>
                <br />
                <a className="text-mib hover:underline" href={`mailto:${config.contact_email}`}>
                  {config.contact_email}
                </a>
              </p>
              <p>
                <span className="font-semibold text-foreground">Telepon</span>
                <br />
                <a className="text-mib hover:underline" href={`tel:${config.contact_phone.replace(/\s/g, "")}`}>
                  {config.contact_phone}
                </a>
              </p>
            </address>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-xl font-bold text-foreground">Formulir permintaan</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Data dikirim melalui server action (tanpa mengekspos service role ke browser).
            </p>
            <div className="mt-8">
              <LeadForm />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
