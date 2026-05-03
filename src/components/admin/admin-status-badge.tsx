type AdminStatusBadgeProps = {
  published: boolean;
};

export function AdminStatusBadge({ published }: AdminStatusBadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold " +
        (published
          ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/15"
          : "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-500/10")
      }
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}
