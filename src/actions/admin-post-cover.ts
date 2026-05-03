"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

function postCoverPathFromPublicUrl(url: string): string | null {
  const marker = "/object/public/post-covers/";
  const i = url.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(url.slice(i + marker.length));
  } catch {
    return null;
  }
}

export async function uploadPostCoverImage(formData: FormData): Promise<void> {
  const supabase = await requireAdminSupabase();
  const postId = String(formData.get("post_id") ?? "");
  const file = formData.get("file");

  if (!z.string().uuid().safeParse(postId).success) {
    throw new Error("ID artikel tidak valid");
  }
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Pilih file gambar");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran gambar maksimal 5 MB");
  }
  const mime = (file.type || "").toLowerCase();
  if (!ALLOWED_TYPES.has(mime)) {
    throw new Error("Hanya JPG, PNG, WebP, atau GIF");
  }

  const { data: post, error: postErr } = await supabase
    .from("posts")
    .select("id, slug, cover_image_url")
    .eq("id", postId)
    .maybeSingle();
  if (postErr || !post) throw new Error("Artikel tidak ditemukan");

  const oldUrl = typeof post.cover_image_url === "string" ? post.cover_image_url : null;
  const oldPath = oldUrl ? postCoverPathFromPublicUrl(oldUrl) : null;

  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "cover";
  const path = `${postId}/${Date.now()}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from("post-covers").upload(path, buf, {
    contentType: mime,
    upsert: false,
  });
  if (upErr) throw new Error(upErr.message);

  const { data: urlData } = supabase.storage.from("post-covers").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const { error: updErr } = await supabase
    .from("posts")
    .update({ cover_image_url: publicUrl })
    .eq("id", postId);
  if (updErr) throw new Error(updErr.message);

  if (oldPath) {
    await supabase.storage.from("post-covers").remove([oldPath]).catch(() => undefined);
  }

  revalidatePath("/articles");
  revalidatePath("/admin/posts");
  revalidatePath(`/articles/${post.slug}`);
  revalidatePath("/", "layout");
  redirect(`/admin/posts/${postId}/edit`);
}
