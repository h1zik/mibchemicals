type AdminFormSectionProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
};

export function AdminFormSection({ title, description, children }: AdminFormSectionProps) {
  return (
    <section className="rounded-xl border border-admin-line bg-white">
      <header className="border-b border-admin-line px-5 py-4 sm:px-6">
        <h2 className="font-display text-base font-semibold tracking-tight text-admin-ink">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm leading-relaxed text-admin-muted">{description}</p>
        ) : null}
      </header>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}
