"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ImagePlus, Link2, Loader2 } from "lucide-react";
import type { ICommand } from "@uiw/react-md-editor/commands";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { uploadPostBodyImage } from "@/actions/admin-post-body-image";
import { adminLabel, adminPrimaryBtn, adminSecondaryBtn } from "@/lib/admin-ui";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[min(480px,70vh)] min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-neutral-100/80 text-sm text-neutral-500"
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-mib/30 border-t-mib" aria-hidden />
      Memuat editor…
    </div>
  ),
});

type Props = {
  name?: string;
  label: string;
  defaultValue?: string;
  height?: number;
  helpText?: string;
  preview?: "edit" | "live" | "preview";
  /** Jika ada, gambar diunggah ke folder artikel ini. Untuk artikel baru, unggah memakai draft_key internal. */
  postId?: string | null;
};

function normalizeEditorMarkdown(raw: string): string {
  if (!raw || !raw.includes("\\n")) return raw;
  return raw.replace(/\\n/g, "\n");
}

function getEditorTextarea(root: HTMLElement | null): HTMLTextAreaElement | null {
  return root?.querySelector<HTMLTextAreaElement>("textarea.w-md-editor-text-input") ?? null;
}

/** Sembunyikan perintah gambar bawaan (placeholder `url` membingungkan); diganti panel unggah. */
function filterToolbarCommands(cmd: ICommand): false | ICommand {
  if (cmd.keyCommand === "image") return false;
  return cmd;
}

export function AdminMarkdownEditor({
  name = "body_md",
  label,
  defaultValue = "",
  height = 480,
  helpText,
  preview = "live",
  postId = null,
}: Props) {
  const initial = useMemo(() => normalizeEditorMarkdown(defaultValue), [defaultValue]);
  const [value, setValue] = useState(initial);
  const valueRef = useRef(initial);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const editorWrapRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const draftKey = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }, []);

  const [urlDraft, setUrlDraft] = useState("");
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const insertAtCursor = useCallback((snippet: string) => {
    const current = valueRef.current;
    const ta = getEditorTextarea(editorWrapRef.current);
    let next: string;
    let cursorPos: number;
    if (ta) {
      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      next = current.slice(0, s) + snippet + current.slice(e);
      cursorPos = s + snippet.length;
    } else {
      next = current + snippet;
      cursorPos = next.length;
    }
    valueRef.current = next;
    setValue(next);
    requestAnimationFrame(() => {
      const ta2 = getEditorTextarea(editorWrapRef.current);
      if (ta2) {
        ta2.focus();
        ta2.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }, []);

  const runUpload = useCallback(
    (file: File | undefined | null) => {
      if (!file || file.size === 0) {
        setUploadErr("Pilih file gambar.");
        return;
      }
      setUploadErr(null);
      const fd = new FormData();
      fd.set("file", file);
      if (postId) fd.set("post_id", postId);
      else fd.set("draft_key", draftKey);

      startTransition(async () => {
        const res = await uploadPostBodyImage(fd);
        if (!res.ok) {
          setUploadErr(res.error);
          return;
        }
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "Gambar";
        insertAtCursor(`\n\n![${alt}](${res.url})\n\n`);
        if (fileRef.current) fileRef.current.value = "";
      });
    },
    [postId, draftKey, insertAtCursor]
  );

  const onPickFile = () => fileRef.current?.click();

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.dataTransfer.files?.[0];
      if (f && f.type.startsWith("image/")) runUpload(f);
    },
    [runUpload]
  );

  const insertFromUrlField = () => {
    const raw = urlDraft.trim();
    if (!raw) {
      setUploadErr("Tempel URL gambar dulu.");
      return;
    }
    try {
      const u = new URL(raw);
      if (!/^https?:$/i.test(u.protocol)) {
        setUploadErr("URL harus http atau https.");
        return;
      }
    } catch {
      setUploadErr("URL tidak valid.");
      return;
    }
    setUploadErr(null);
    insertAtCursor(`\n\n![Gambar](${raw})\n\n`);
    setUrlDraft("");
  };

  const defaultHelp =
    preview === "live"
      ? "Tulis di kiri, pratinjau di kanan. Toolbar untuk format; gambar dari file lewat panel di bawah — tidak perlu mencari URL sendiri."
      : "Toolbar untuk format teks. Gambar: gunakan panel bantuan di bawah.";

  return (
    <div className="admin-md-editor w-full space-y-3" data-color-mode="light">
      <p className={adminLabel}>{label}</p>

      <div
        className="rounded-xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50/80 p-4 shadow-sm ring-1 ring-neutral-900/[0.04] sm:p-5"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mib/10 px-2.5 py-1 text-xs font-semibold text-mib">
            <ImagePlus className="h-3.5 w-3.5" aria-hidden />
            Gambar di isi artikel
          </span>
          <span className="text-xs text-neutral-500">
            Seret file ke sini atau unggah — tautan Markdown disisipkan otomatis di posisi kursor.
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            className="sr-only"
            disabled={pending}
            onChange={(e) => runUpload(e.target.files?.[0])}
          />
          <button
            type="button"
            className={`${adminPrimaryBtn} w-full justify-center sm:w-auto`}
            disabled={pending}
            onClick={onPickFile}
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Mengunggah…
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" aria-hidden />
                Pilih gambar dari komputer
              </>
            )}
          </button>

          <details className="w-full sm:ml-auto sm:w-auto sm:min-w-[220px]">
            <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-600 underline-offset-2 hover:text-mib hover:underline [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" aria-hidden />
                Punya URL gambar? (opsional)
              </span>
            </summary>
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 sm:flex-row sm:items-center">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://…"
                className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-mib focus:ring-2 focus:ring-mib/15"
                disabled={pending}
              />
              <button
                type="button"
                className={`${adminSecondaryBtn} shrink-0 whitespace-nowrap`}
                disabled={pending}
                onClick={insertFromUrlField}
              >
                Sisipkan
              </button>
            </div>
          </details>
        </div>

        {uploadErr ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {uploadErr}
          </p>
        ) : null}
      </div>

      <input type="hidden" name={name} value={value} />
      <div
        ref={editorWrapRef}
        className="w-full max-w-none rounded-xl border border-neutral-200 bg-white shadow-sm ring-1 ring-neutral-900/[0.04] transition focus-within:border-mib/40 focus-within:ring-2 focus-within:ring-mib/15 [&_.w-md-editor]:overflow-hidden [&_.w-md-editor]:!rounded-xl [&_.w-md-editor]:!border-0 [&_.w-md-editor]:!shadow-none [&_.w-md-editor-toolbar]:!border-b [&_.w-md-editor-toolbar]:!border-neutral-200 [&_.w-md-editor-toolbar]:!bg-neutral-50/90 [&_.w-md-editor-content]:!min-h-[280px]"
        role="group"
        aria-label={label}
      >
        <MDEditor
          value={value}
          onChange={(v) => setValue(v ?? "")}
          height={height}
          visibleDragbar={false}
          preview={preview}
          commandsFilter={filterToolbarCommands}
        />
      </div>
      <p className="text-xs leading-relaxed text-neutral-500">{helpText ?? defaultHelp}</p>
    </div>
  );
}
