import { ScrollReveal } from "@/components/scroll-reveal";

type Props = {
  /** Label kecil di atas judul (uppercase) */
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Konten tambahan di bawah subtitle (mis. CTA, breadcrumb meta) */
  children?: React.ReactNode;
  /** Slot di atas eyebrow (mis. breadcrumb) — tidak dianimasikan */
  top?: React.ReactNode;
  /** Lebar sempit (max-w-3xl) untuk halaman detail yang body-nya naratif */
  narrow?: boolean;
};

/**
 * Header hero konsisten untuk halaman bagian dalam — memakai tekstur grid,
 * glow brand, eyebrow, dan judul display seperti hero homepage.
 */
export function PageHero({ eyebrow, title, subtitle, children, top, narrow }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid mask-fade" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-mib/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] rounded-full bg-mib-lime/10 blur-3xl"
      />
      <div
        className={`relative mx-auto px-4 sm:px-6 ${
          narrow ? "max-w-3xl py-12 sm:py-16" : "max-w-6xl py-16 sm:py-20"
        }`}
      >
        {top}
        <ScrollReveal from="up">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-mib">{eyebrow}</p>
          ) : null}
          <h1
            className={`mt-2 text-balance font-display font-bold leading-[1.05] tracking-tight text-mib-ink ${
              narrow ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
            }`}
          >
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">{subtitle}</p>
          ) : null}
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
}
