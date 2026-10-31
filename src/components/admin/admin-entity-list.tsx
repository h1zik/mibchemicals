import Link from "next/link";
import { ExternalLink, ImageOff, Pencil } from "lucide-react";
import { AdminDeleteButton } from "@/components/admin/admin-delete-button";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";

export function AdminEntityList({
  children,
  count,
  noun,
}: {
  children: React.ReactNode;
  count: number;
  /** Kata benda untuk ringkasan jumlah, mis. "solusi". */
  noun: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-admin-line bg-white">
      <p className="border-b border-admin-line bg-admin-soft/60 px-4 py-2.5 text-xs text-admin-muted sm:px-5">
        {count} {noun}
      </p>
      <ul className="divide-y divide-admin-line">{children}</ul>
    </div>
  );
}

type RowProps = {
  id: string;
  title: string;
  editHref: string;
  /** Path publik; menampilkan tautan pratinjau bila diisi. */
  publicPath?: string | null;
  /** `undefined` = entitas tanpa status publikasi (mis. kategori). */
  published?: boolean;
  /** Teks sekunder di bawah judul (slug, kutipan, dsb.). */
  meta?: React.ReactNode;
  /** Chip tambahan di samping judul. */
  tags?: React.ReactNode;
  /** `undefined` = tanpa kolom gambar; `null` = entitas punya gambar tapi belum diisi. */
  imageUrl?: string | null;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function AdminEntityRow({
  id,
  title,
  editHref,
  publicPath,
  published,
  meta,
  tags,
  imageUrl,
  deleteAction,
}: RowProps) {
  return (
    <li className="group relative flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-admin-canvas/70 sm:px-5">
      {imageUrl !== undefined ? (
        <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-admin-line bg-admin-soft sm:block">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-admin-muted/50">
              <ImageOff className="h-4 w-4" aria-hidden />
            </span>
          )}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href={editHref}
            className="truncate font-medium text-admin-ink decoration-mib/40 underline-offset-4 after:absolute after:inset-0 hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-mib"
          >
            {title}
          </Link>
          {published !== undefined ? <AdminStatusBadge published={published} /> : null}
          {tags}
        </div>
        {meta ? <div className="mt-0.5 truncate text-xs text-admin-muted">{meta}</div> : null}
      </div>

      {/* `relative z-10` agar aksi berada di atas area klik baris. */}
      <div className="relative z-10 flex shrink-0 items-center gap-1">
        {publicPath && published !== false ? (
          <Link
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-8 w-8 items-center justify-center rounded-md text-admin-muted transition hover:bg-white hover:text-admin-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib sm:inline-flex"
            title="Lihat di situs"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            <span className="sr-only">Lihat {title} di situs</span>
          </Link>
        ) : null}
        <Link
          href={editHref}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-mib transition hover:bg-mib/10 hover:text-mib-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-mib"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only sm:not-sr-only">Edit</span>
          <span className="sr-only"> {title}</span>
        </Link>
        <AdminDeleteButton action={deleteAction} id={id} itemLabel={title} />
      </div>
    </li>
  );
}

/** Chip netral untuk kategori / tipe. */
export function AdminTag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "brand" }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium " +
        (tone === "brand" ? "bg-mib/10 text-mib-dark" : "bg-admin-soft text-admin-muted")
      }
    >
      {children}
    </span>
  );
}
