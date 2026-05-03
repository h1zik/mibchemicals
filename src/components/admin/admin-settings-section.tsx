import { adminCard } from "@/lib/admin-ui";

type AdminSettingsSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminSettingsSection({ title, description, children }: AdminSettingsSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-neutral-900">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-relaxed text-neutral-600">{description}</p> : null}
      </div>
      <div className={adminCard}>{children}</div>
    </section>
  );
}
