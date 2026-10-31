import Link from "next/link";
import { Plus, type LucideIcon } from "lucide-react";
import { adminPrimaryBtn } from "@/lib/admin-ui";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
};

export function AdminEmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-[#c8cfbd] bg-white/70 px-6 py-10 sm:flex-row sm:items-center sm:gap-5 sm:px-8">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mib/10 text-mib">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-semibold text-admin-ink">{title}</p>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-admin-muted">{description}</p>
      </div>
      {action ? (
        <Link href={action.href} className={adminPrimaryBtn}>
          <Plus className="h-4 w-4" aria-hidden />
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
