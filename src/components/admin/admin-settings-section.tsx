import { adminCard } from "@/lib/admin-ui";

type AdminSettingsSectionProps = {
  /** Anchor untuk navigasi dalam halaman. */
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminSettingsSection({ id, title, description, children }: AdminSettingsSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 space-y-3 md:scroll-mt-20">
      <div>
        <h2 id={`${id}-title`} className="font-display text-xl font-semibold tracking-tight text-admin-ink">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm leading-relaxed text-admin-muted">{description}</p> : null}
      </div>
      <div className={adminCard}>{children}</div>
    </section>
  );
}
