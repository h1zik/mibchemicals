"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 6 * 1024 * 1024;
const BUCKET = "content-media";

/** Peta entitas → tabel, kolom yang diizinkan, folder, dan path edit admin. */
const ENTITIES = {
  industry: {
    table: "industries",
    fields: ["hero_image_url", "process_image_url"],
    folder: "industries",
    editPath: (id: string) => `/admin/industries/${id}/edit`,
  },
  solution: {
    table: "solutions",
    fields: ["image_url"],
    folder: "solutions",
    editPath: (id: string) => `/admin/solutions/${id}/edit`,
  },
  testimonial: {
    table: "testimonials",
    fields: ["avatar_url"],
    folder: "testimonials",
    editPath: (id: string) => `/admin/testimonials/${id}/edit`,
  },
} as const;

type EntityKey = keyof typeof ENTITIES;

async function requireAdminSupabase() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
  return supabase;
}

function pathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(url.slice(i + marker.length));
  } catch {
    return null;
  }
}

export async function uploadContentImage(formData: FormData): Promise<void> {
  const supabase = await requireAdminSupabase();

  const entityKey = String(formData.get("entity") ?? "") as EntityKey;
  const entity = ENTITIES[entityKey];
  if (!entity) throw new Error("Entitas tidak valid");

  const field = String(formData.get("field") ?? "");
  if (!(entity.fields as readonly string[]).includes(field)) {
    throw new Error("Kolom gambar tidak valid");
  }

  const rowId = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(rowId).success) throw new Error("ID tidak valid");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("Pilih file gambar");
  if (file.size > MAX_BYTES) throw new Error("Ukuran gambar maksimal 6 MB");
  const mime = (file.type || "").toLowerCase();
  if (!ALLOWED_TYPES.has(mime)) throw new Error("Hanya JPG, PNG, WebP, atau GIF");

  const { data: existing, error: exErr } = await supabase
    .from(entity.table)
    .select(`id, ${field}`)
    .eq("id", rowId)
    .maybeSingle();
  if (exErr || !existing) throw new Error("Data tidak ditemukan");

  const oldUrl =
    typeof (existing as unknown as Record<string, unknown>)[field] === "string"
      ? ((existing as unknown as Record<string, unknown>)[field] as string)
      : null;
  const oldPath = oldUrl ? pathFromPublicUrl(oldUrl) : null;

  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "image";
  const path = `${entity.folder}/${rowId}/${Date.now()}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, buf, {
    contentType: mime,
    upsert: false,
  });
  if (upErr) throw new Error(upErr.message);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const { error: updErr } = await supabase
    .from(entity.table)
    .update({ [field]: publicUrl })
    .eq("id", rowId);
  if (updErr) throw new Error(updErr.message);

  if (oldPath) {
    await supabase.storage.from(BUCKET).remove([oldPath]).catch(() => undefined);
  }

  revalidatePath("/", "layout");
  revalidatePath(entity.editPath(rowId));
  redirect(entity.editPath(rowId));
}

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/** Unggah satu gambar galeri /about ke content-media/about dan kembalikan URL publik. */
export async function uploadAboutGalleryImage(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = await requireAdminSupabase();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Pilih file gambar." };
    if (file.size > MAX_BYTES) return { ok: false, error: "Ukuran gambar maksimal 6 MB." };
    const mime = (file.type || "").toLowerCase();
    if (!ALLOWED_TYPES.has(mime)) return { ok: false, error: "Hanya JPG, PNG, WebP, atau GIF." };

    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "foto";
    const path = `about/${Date.now()}-${safeName}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, buf, {
      contentType: mime,
      upsert: false,
    });
    if (upErr) return { ok: false, error: upErr.message };
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { ok: true, url: urlData.publicUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unggah gagal." };
  }
}

/** Hapus gambar (set kolom ke null + hapus objek storage). */
export async function clearContentImage(formData: FormData): Promise<void> {
  const supabase = await requireAdminSupabase();
  const entityKey = String(formData.get("entity") ?? "") as EntityKey;
  const entity = ENTITIES[entityKey];
  if (!entity) throw new Error("Entitas tidak valid");
  const field = String(formData.get("field") ?? "");
  if (!(entity.fields as readonly string[]).includes(field)) {
    throw new Error("Kolom gambar tidak valid");
  }
  const rowId = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(rowId).success) throw new Error("ID tidak valid");

  const { data: existing } = await supabase
    .from(entity.table)
    .select(`id, ${field}`)
    .eq("id", rowId)
    .maybeSingle();
  const oldUrl =
    existing && typeof (existing as unknown as Record<string, unknown>)[field] === "string"
      ? ((existing as unknown as Record<string, unknown>)[field] as string)
      : null;
  const oldPath = oldUrl ? pathFromPublicUrl(oldUrl) : null;

  const { error } = await supabase
    .from(entity.table)
    .update({ [field]: null })
    .eq("id", rowId);
  if (error) throw new Error(error.message);

  if (oldPath) {
    await supabase.storage.from(BUCKET).remove([oldPath]).catch(() => undefined);
  }
  revalidatePath("/", "layout");
  revalidatePath(entity.editPath(rowId));
  redirect(entity.editPath(rowId));
}
