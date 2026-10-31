import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";

type Props = {
  backHref: string;
  backLabel: string;
  title: string;
  /** Status publikasi entri yang sedang diedit; kosong untuk entri baru / tanpa status. */
  published?: boolean;
  /** Path publik untuk tautan pratinjau (hanya entri yang sudah tersimpan). */
  publicPath?: string | null;
  description?: React.ReactNode;
};

export function AdminEditorHeader({
  backHref,
  backLabel,
  title,
  published,
  publicPath,
  description,
}: Props) {
  return (
    <div className="mb-6 sm:mb-8">
      <Link
        href={backHref}
        className="-ml-1 inline-flex items-center gap-1.5 rounded px-1 text-sm font-medium text-admin-muted transition hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {backLabel}
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-admin-ink">
          {title}
        </h1>
        {published !== undefined ? <AdminStatusBadge published={published} /> : null}
        {publicPath ? (
          <Link
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded px-1 text-sm font-medium text-mib transition hover:text-mib-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
          >
            Lihat di situs
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ) : null}
      </div>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-admin-muted">{description}</p>
      ) : null}
    </div>
  );
}
