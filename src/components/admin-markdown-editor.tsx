"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
/** Wajib agar panel pratinjau (mode live) merender Markdown, bukan teks mentah */
import "@uiw/react-markdown-preview/markdown.css";
import { adminLabel } from "@/lib/admin-ui";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[min(420px,70vh)] min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100/80 text-sm text-neutral-500"
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-mib/30 border-t-mib" aria-hidden />
      Memuat editor…
    </div>
  ),
});

type Props = {
  /** Nama field pada form (mis. body_md) */
  name?: string;
  label: string;
  defaultValue?: string;
  /** Tinggi area edit (px) */
  height?: number;
  helpText?: string;
  /** `edit` = satu kolom (paling jelas); `live` = tulis + pratinjau berdampingan */
  preview?: "edit" | "live" | "preview";
};

/** Konten yang pernah disimpan dengan literal \n jadi baris sungguhan */
function normalizeEditorMarkdown(raw: string): string {
  if (!raw || !raw.includes("\\n")) return raw;
  return raw.replace(/\\n/g, "\n");
}

export function AdminMarkdownEditor({
  name = "body_md",
  label,
  defaultValue = "",
  height = 420,
  helpText,
  preview = "edit",
}: Props) {
  const initial = useMemo(() => normalizeEditorMarkdown(defaultValue), [defaultValue]);
  const [value, setValue] = useState(initial);

  const defaultHelp =
    preview === "live"
      ? "Toolbar untuk format teks. Panel kanan memperbarui pratinjau. Isi disimpan sebagai Markdown."
      : "Satu kolom: pilih teks lalu gunakan toolbar (tebal, judul, daftar, tautan). Ikon pratinjau di toolbar untuk melihat hasil. Isi disimpan sebagai Markdown.";

  return (
    <div className="admin-md-editor w-full" data-color-mode="light">
      <p className={adminLabel}>{label}</p>
      <input type="hidden" name={name} value={value} />
      <div
        className="mt-2 w-full max-w-none rounded-xl border border-neutral-200 bg-white shadow-sm ring-1 ring-neutral-900/[0.04] transition focus-within:border-mib/40 focus-within:ring-2 focus-within:ring-mib/15 [&_.w-md-editor]:overflow-hidden [&_.w-md-editor]:!rounded-xl [&_.w-md-editor]:!border-0 [&_.w-md-editor]:!shadow-none [&_.w-md-editor-toolbar]:!border-b [&_.w-md-editor-toolbar]:!border-neutral-200 [&_.w-md-editor-toolbar]:!bg-neutral-50/90 [&_.w-md-editor-content]:!min-h-[280px]"
        role="group"
        aria-label={label}
      >
        <MDEditor
          value={value}
          onChange={(v) => setValue(v ?? "")}
          height={height}
          visibleDragbar={false}
          preview={preview}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500">{helpText ?? defaultHelp}</p>
    </div>
  );
}
