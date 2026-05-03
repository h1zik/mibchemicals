"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_LOGO_BYTES = 3 * 1024 * 1024;
const MAX_FAVICON_BYTES = 512 * 1024;

const LOGO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const FAVICON_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "application/octet-stream",
]);

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

function siteAssetPathFromPublicUrl(url: string): string | null {
  const marker = "/object/public/site-assets/";
  const i = url.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(url.slice(i + marker.length));
  } catch {
    return null;
  }
}

const assetKind = z.enum(["nav_logo", "favicon"]);

export async function uploadSiteBrandingAsset(formData: FormData): Promise<void> {
  const supabase = await requireAdminSupabase();
  const kind = assetKind.safeParse(formData.get("asset"));
  if (!kind.success) throw new Error("Jenis aset tidak valid");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Pilih file");
  }

  const { data: row, error: rowErr } = await supabase
    .from("site_config")
    .select("nav_logo_url, favicon_url")
    .eq("singleton_key", "main")
    .maybeSingle();
  if (rowErr || !row) throw new Error("Konfigurasi situs tidak ditemukan");

  const mime = (file.type || "").toLowerCase();
  const maxBytes = kind.data === "nav_logo" ? MAX_LOGO_BYTES : MAX_FAVICON_BYTES;

  if (file.size > maxBytes) {
    throw new Error(kind.data === "nav_logo" ? "Logo maks. 3 MB" : "Favicon maks. 512 KB");
  }
  const lower = file.name.toLowerCase();
  const isIco = lower.endsWith(".ico");
  const isSvg = lower.endsWith(".svg");

  if (kind.data === "favicon") {
    const ok =
      FAVICON_TYPES.has(mime) ||
      (isIco && (mime === "application/octet-stream" || mime === "" || mime === "image/x-icon"));
    if (!ok) throw new Error("Format favicon: ICO, PNG, SVG, WebP, atau JPG");
  } else {
    const ok = LOGO_TYPES.has(mime) || (isSvg && (!mime || mime === "application/octet-stream"));
    if (!ok) throw new Error("Format logo: JPG, PNG, WebP, GIF, atau SVG");
  }

  const oldUrl =
    kind.data === "nav_logo"
      ? typeof row.nav_logo_url === "string"
        ? row.nav_logo_url
        : null
      : typeof row.favicon_url === "string"
        ? row.favicon_url
        : null;
  const oldPath = oldUrl ? siteAssetPathFromPublicUrl(oldUrl) : null;

  const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "file";
  const folder = kind.data === "nav_logo" ? "nav-logo" : "favicon";
  const path = `${folder}/${Date.now()}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from("site-assets").upload(path, buf, {
    contentType: mime || "application/octet-stream",
    upsert: false,
  });
  if (upErr) throw new Error(upErr.message);

  const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
  const publicUrl = urlData.publicUrl;

  const patch =
    kind.data === "nav_logo" ? { nav_logo_url: publicUrl } : { favicon_url: publicUrl };
  const { error: updErr } = await supabase.from("site_config").update(patch).eq("singleton_key", "main");
  if (updErr) throw new Error(updErr.message);

  if (oldPath) {
    await supabase.storage.from("site-assets").remove([oldPath]).catch(() => undefined);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}
