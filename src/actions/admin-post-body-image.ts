"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

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

export type UploadPostBodyImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/** Unggah gambar untuk disisipkan ke Markdown isi artikel (bucket post-covers, folder inline/). */
export async function uploadPostBodyImage(formData: FormData): Promise<UploadPostBodyImageResult> {
  try {
    const supabase = await requireAdminSupabase();
    const file = formData.get("file");
    const postIdRaw = formData.get("post_id");
    const draftKeyRaw = String(formData.get("draft_key") ?? "").trim();

    const postIdParsed = z.string().uuid().safeParse(
      typeof postIdRaw === "string" ? postIdRaw : ""
    );
    const draftParsed = z.string().uuid().safeParse(draftKeyRaw);

    const postId = postIdParsed.success ? postIdParsed.data : null;
    const draftKey = draftParsed.success ? draftParsed.data : null;

    if (!postId && !draftKey) {
      return { ok: false, error: "Sesi unggah tidak valid. Muat ulang halaman dan coba lagi." };
    }

    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Pilih file gambar terlebih dahulu." };
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, error: "Ukuran gambar maksimal 5 MB." };
    }
    const mime = (file.type || "").toLowerCase();
    if (!ALLOWED_TYPES.has(mime)) {
      return { ok: false, error: "Hanya JPG, PNG, WebP, atau GIF." };
    }

    let slug: string | null = null;
    if (postId) {
      const { data: post, error: postErr } = await supabase
        .from("posts")
        .select("id, slug")
        .eq("id", postId)
        .maybeSingle();
      if (postErr || !post?.slug) {
        return { ok: false, error: "Artikel tidak ditemukan." };
      }
      slug = post.slug;
    }

    const folder = postId ?? `drafts/${draftKey}`;
    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "gambar";
    const path = `inline/${folder}/${Date.now()}-${safeName}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage.from("post-covers").upload(path, buf, {
      contentType: mime,
      upsert: false,
    });
    if (upErr) return { ok: false, error: upErr.message };

    const { data: urlData } = supabase.storage.from("post-covers").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    if (postId && slug) {
      revalidatePath("/articles");
      revalidatePath("/admin/posts");
      revalidatePath(`/articles/${slug}`);
      revalidatePath("/", "layout");
    }

    return { ok: true, url: publicUrl };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unggah gagal.",
    };
  }
}
