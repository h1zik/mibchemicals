type AdminFormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AdminFormSection({ title, description, children }: AdminFormSectionProps) {
  return (
    <section className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm sm:p-6">
      <header className="border-b border-neutral-100 pb-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-900">{title}</h2>
        {description ? <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{description}</p> : null}
      </header>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}
