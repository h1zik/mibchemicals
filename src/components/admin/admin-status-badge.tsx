type AdminStatusBadgeProps = {
  published: boolean;
};

export function AdminStatusBadge({ published }: AdminStatusBadgeProps) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold " +
        (published ? "bg-mib/10 text-mib-dark" : "bg-admin-draft-bg text-admin-draft")
      }
    >
      <span
        className={"h-1.5 w-1.5 rounded-full " + (published ? "bg-mib" : "bg-admin-draft")}
        aria-hidden
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}
