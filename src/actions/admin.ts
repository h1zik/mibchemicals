"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { parseGalleryImages } from "@/lib/product-gallery";
import { throwIfMissingGalleryColumn } from "@/lib/supabase-errors";
import { INDUSTRY_ICON_KEYS } from "@/lib/industry-icon-keys";
import { slugify } from "@/lib/slugify";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return null;
  return supabase;
}

function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/services");
  revalidatePath("/products");
  revalidatePath("/articles");
  revalidatePath("/contact");
  revalidatePath("/about");
}

function revalidateProductCategoriesAdmin() {
  revalidatePath("/admin/product-categories");
}

function revalidatePostCategoriesAdmin() {
  revalidatePath("/admin/post-categories");
}

function revalidateSettings() {
  revalidatePath("/admin/settings");
  revalidatePublic();
}

const siteConfigSectionKey = z.enum([
  "seo",
  "company",
  "hero",
  "solutions",
  "industries",
  "branding",
  "about",
]);

const seoSectionSchema = z.object({
  meta_title_default: z.string().min(1),
  meta_description_default: z.string().min(1),
  site_keywords: z.string().min(1),
});

const companySectionSchema = z.object({
  company_name: z.string().min(1),
  company_tagline: z.string().min(1),
  contact_email: z.string().email(),
  contact_phone: z.string().min(1),
  contact_address: z.string().min(1),
});

const heroSectionSchema = z.object({
  hero_title: z.string().min(1),
  hero_subtitle: z.string().min(1),
  hero_primary_cta_label: z.string().min(1),
  hero_primary_cta_url: z.string().min(1),
  hero_secondary_cta_label: z.string().min(1),
  hero_secondary_cta_url: z.string().min(1),
});

const solutionsSectionSchema = z.object({
  solution_problem_title: z.string().min(1),
  solution_problem_body: z.string(),
  solution_innovation_title: z.string().min(1),
  solution_innovation_body: z.string(),
  solution_mib_title: z.string().min(1),
  solution_mib_body: z.string(),
});

const aboutPageSectionSchema = z
  .object({
    about_page_title: z.string().min(1),
    about_page_subtitle: z.string(),
    about_page_body_md: z.string(),
    about_page_seo_title: z.string(),
    about_page_seo_description: z.string(),
  })
  .transform((d) => ({
    about_page_title: d.about_page_title.trim(),
    about_page_subtitle: d.about_page_subtitle.trim(),
    about_page_body_md: d.about_page_body_md,
    about_page_seo_title: d.about_page_seo_title.trim() || null,
    about_page_seo_description: d.about_page_seo_description.trim() || null,
  }));

const industryItemSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  summary: z.string(),
  icon_key: z.enum(INDUSTRY_ICON_KEYS).optional(),
});

function parseIndustriesPayload(raw: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("industries_json bukan JSON valid");
  }
  return z.array(industryItemSchema).min(1, "Minimal satu industri").parse(parsed);
}

export async function updateSiteConfigSeo(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const parsed = seoSectionSchema.safeParse({
    meta_title_default: formData.get("meta_title_default"),
    meta_description_default: formData.get("meta_description_default"),
    site_keywords: formData.get("site_keywords"),
  });
  if (!parsed.success) throw new Error(parsed.error.message);
  const { error } = await supabase.from("site_config").update(parsed.data).eq("singleton_key", "main");
  if (error) throw new Error(error.message);
  revalidateSettings();
}

export async function updateSiteConfigCompany(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const parsed = companySectionSchema.safeParse({
    company_name: formData.get("company_name"),
    company_tagline: formData.get("company_tagline"),
    contact_email: formData.get("contact_email"),
    contact_phone: formData.get("contact_phone"),
    contact_address: formData.get("contact_address"),
  });
  if (!parsed.success) throw new Error(parsed.error.message);
  const { error } = await supabase.from("site_config").update(parsed.data).eq("singleton_key", "main");
  if (error) throw new Error(error.message);
  revalidateSettings();
}

export async function updateSiteConfigHero(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const parsed = heroSectionSchema.safeParse({
    hero_title: formData.get("hero_title"),
    hero_subtitle: formData.get("hero_subtitle"),
    hero_primary_cta_label: formData.get("hero_primary_cta_label"),
    hero_primary_cta_url: formData.get("hero_primary_cta_url"),
    hero_secondary_cta_label: formData.get("hero_secondary_cta_label"),
    hero_secondary_cta_url: formData.get("hero_secondary_cta_url"),
  });
  if (!parsed.success) throw new Error(parsed.error.message);
  const { error } = await supabase.from("site_config").update(parsed.data).eq("singleton_key", "main");
  if (error) throw new Error(error.message);
  revalidateSettings();
}

export async function updateSiteConfigSolutions(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const parsed = solutionsSectionSchema.safeParse({
    solution_problem_title: formData.get("solution_problem_title"),
    solution_problem_body: formData.get("solution_problem_body"),
    solution_innovation_title: formData.get("solution_innovation_title"),
    solution_innovation_body: formData.get("solution_innovation_body"),
    solution_mib_title: formData.get("solution_mib_title"),
    solution_mib_body: formData.get("solution_mib_body"),
  });
  if (!parsed.success) throw new Error(parsed.error.message);
  const { error } = await supabase.from("site_config").update(parsed.data).eq("singleton_key", "main");
  if (error) throw new Error(error.message);
  revalidateSettings();
}

export async function updateSiteConfigAbout(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const parsed = aboutPageSectionSchema.safeParse({
    about_page_title: formData.get("about_page_title"),
    about_page_subtitle: formData.get("about_page_subtitle"),
    about_page_body_md: formData.get("about_page_body_md"),
    about_page_seo_title: formData.get("about_page_seo_title"),
    about_page_seo_description: formData.get("about_page_seo_description"),
  });
  if (!parsed.success) throw new Error(parsed.error.message);
  const { error } = await supabase.from("site_config").update(parsed.data).eq("singleton_key", "main");
  if (error) {
    if (/about_page_|schema cache/i.test(error.message)) {
      throw new Error(
        "Kolom halaman Tentang belum ada di database Supabase. Buka SQL Editor, jalankan isi file supabase/migrations/007_about_page.sql, tunggu beberapa detik agar schema cache terbarui, lalu simpan lagi."
      );
    }
    throw new Error(error.message);
  }
  revalidateSettings();
}

function parseOptionalAbsoluteUrl(raw: unknown, label: string): string | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const p = z.string().url().safeParse(s);
  if (!p.success) throw new Error(`${label}: URL tidak valid`);
  return p.data;
}

export async function updateSiteConfigBranding(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const nav_logo_url = parseOptionalAbsoluteUrl(formData.get("nav_logo_url"), "Logo navbar");
  const favicon_url = parseOptionalAbsoluteUrl(formData.get("favicon_url"), "Favicon");
  const { error } = await supabase
    .from("site_config")
    .update({ nav_logo_url, favicon_url })
    .eq("singleton_key", "main");
  if (error) throw new Error(error.message);
  revalidateSettings();
}

export async function updateSiteConfigIndustries(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const raw = String(formData.get("industries_json") ?? "");
  const industries = parseIndustriesPayload(raw);
  const { error } = await supabase
    .from("site_config")
    .update({ industries_json: industries })
    .eq("singleton_key", "main");
  if (error) throw new Error(error.message);
  revalidateSettings();
}

/** Menyalin nilai template ke satu bagian site_config (efek “hapus kustomisasi bagian ini”). */
export async function resetSiteConfigSection(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const section = siteConfigSectionKey.safeParse(formData.get("section"));
  if (!section.success) throw new Error("Bagian tidak valid");
  const fb = FALLBACK_SITE_CONFIG;
  const patch: Record<string, unknown> = {};
  switch (section.data) {
    case "seo":
      patch.meta_title_default = fb.meta_title_default;
      patch.meta_description_default = fb.meta_description_default;
      patch.site_keywords = fb.site_keywords;
      break;
    case "company":
      patch.company_name = fb.company_name;
      patch.company_tagline = fb.company_tagline;
      patch.contact_email = fb.contact_email;
      patch.contact_phone = fb.contact_phone;
      patch.contact_address = fb.contact_address;
      break;
    case "hero":
      patch.hero_title = fb.hero_title;
      patch.hero_subtitle = fb.hero_subtitle;
      patch.hero_primary_cta_label = fb.hero_primary_cta_label;
      patch.hero_primary_cta_url = fb.hero_primary_cta_url;
      patch.hero_secondary_cta_label = fb.hero_secondary_cta_label;
      patch.hero_secondary_cta_url = fb.hero_secondary_cta_url;
      break;
    case "solutions":
      patch.solution_problem_title = fb.solution_problem_title;
      patch.solution_problem_body = fb.solution_problem_body;
      patch.solution_innovation_title = fb.solution_innovation_title;
      patch.solution_innovation_body = fb.solution_innovation_body;
      patch.solution_mib_title = fb.solution_mib_title;
      patch.solution_mib_body = fb.solution_mib_body;
      break;
    case "industries":
      patch.industries_json = fb.industries_json;
      break;
    case "branding":
      patch.nav_logo_url = fb.nav_logo_url;
      patch.favicon_url = fb.favicon_url;
      break;
    case "about":
      patch.about_page_title = fb.about_page_title;
      patch.about_page_subtitle = fb.about_page_subtitle;
      patch.about_page_body_md = fb.about_page_body_md;
      patch.about_page_seo_title = fb.about_page_seo_title;
      patch.about_page_seo_description = fb.about_page_seo_description;
      break;
    default:
      break;
  }
  const { error } = await supabase.from("site_config").update(patch).eq("singleton_key", "main");
  if (error) throw new Error(error.message);
  revalidateSettings();
}

/** Buat baris site_config utama dari template (jika belum ada). */
export async function createSiteConfigRow(formData?: FormData): Promise<void> {
  void formData;
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const { data: existing } = await supabase
    .from("site_config")
    .select("id")
    .eq("singleton_key", "main")
    .maybeSingle();
  if (existing) throw new Error("Baris site_config sudah ada");
  const fb = FALLBACK_SITE_CONFIG;
  const { error } = await supabase.from("site_config").insert({
    singleton_key: "main",
    meta_title_default: fb.meta_title_default,
    meta_description_default: fb.meta_description_default,
    site_keywords: fb.site_keywords,
    company_name: fb.company_name,
    company_tagline: fb.company_tagline,
    contact_email: fb.contact_email,
    contact_phone: fb.contact_phone,
    contact_address: fb.contact_address,
    hero_title: fb.hero_title,
    hero_subtitle: fb.hero_subtitle,
    hero_primary_cta_label: fb.hero_primary_cta_label,
    hero_primary_cta_url: fb.hero_primary_cta_url,
    hero_secondary_cta_label: fb.hero_secondary_cta_label,
    hero_secondary_cta_url: fb.hero_secondary_cta_url,
    solution_problem_title: fb.solution_problem_title,
    solution_problem_body: fb.solution_problem_body,
    solution_innovation_title: fb.solution_innovation_title,
    solution_innovation_body: fb.solution_innovation_body,
    solution_mib_title: fb.solution_mib_title,
    solution_mib_body: fb.solution_mib_body,
    industries_json: fb.industries_json,
    nav_logo_url: fb.nav_logo_url,
    favicon_url: fb.favicon_url,
    about_page_title: fb.about_page_title,
    about_page_subtitle: fb.about_page_subtitle,
    about_page_body_md: fb.about_page_body_md,
    about_page_seo_title: fb.about_page_seo_title,
    about_page_seo_description: fb.about_page_seo_description,
  });
  if (error) throw new Error(error.message);
  revalidateSettings();
}

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string(),
  body_md: z.string(),
  icon_key: z.string().min(1),
  sort_order: z.coerce.number().int(),
  published: z.coerce.boolean(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export async function upsertService(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = formData.get("id") as string | null;
  const title = String(formData.get("title") ?? "");
  let slug = String(formData.get("slug") ?? "");
  if (!slug) slug = slugify(title);
  const parsed = serviceSchema.safeParse({
    id: id || undefined,
    slug,
    title,
    summary: String(formData.get("summary") ?? ""),
    body_md: String(formData.get("body_md") ?? ""),
    icon_key: String(formData.get("icon_key") ?? "flask"),
    sort_order: formData.get("sort_order") ?? 0,
    published: formData.get("published") === "on" || formData.get("published") === "true",
    seo_title: formData.get("seo_title") || undefined,
    seo_description: formData.get("seo_description") || undefined,
  });
  if (!parsed.success) throw new Error(parsed.error.message);

  const row = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    body_md: parsed.data.body_md,
    icon_key: parsed.data.icon_key,
    sort_order: parsed.data.sort_order,
    published: parsed.data.published,
    seo_title: parsed.data.seo_title ?? null,
    seo_description: parsed.data.seo_description ?? null,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("services")
      .update(row)
      .eq("id", parsed.data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("services").insert(row);
    if (error) throw new Error(error.message);
    revalidatePath("/services");
    revalidatePath("/admin/services");
    redirect("/admin/services");
  }
  revalidatePath("/services");
  revalidatePath("/admin/services");
}

export async function deleteServiceForm(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) throw new Error("ID tidak valid");
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  category_id: z.string().uuid(),
  description_md: z.string(),
  specs_json: z.string(),
  gallery_images_json: z.string(),
  featured: z.coerce.boolean(),
  sort_order: z.coerce.number().int(),
  published: z.coerce.boolean(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

const productCategorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  sort_order: z.coerce.number().int(),
});

export async function upsertProduct(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = formData.get("id") as string | null;
  const name = String(formData.get("name") ?? "");
  let slug = String(formData.get("slug") ?? "");
  if (!slug) slug = slugify(name);
  let specs: Record<string, string> = {};
  const specsRaw = String(formData.get("specs_json") ?? "{}");
  try {
    specs = JSON.parse(specsRaw) as Record<string, string>;
  } catch {
    throw new Error("specs_json harus berupa object JSON");
  }
  const galleryRaw = String(formData.get("gallery_images_json") ?? "[]");
  let galleryParsed: unknown;
  try {
    galleryParsed = JSON.parse(galleryRaw);
  } catch {
    throw new Error("Galeri harus berupa array JSON valid");
  }
  const gallery_images = parseGalleryImages(galleryParsed);

  const parsed = productSchema.safeParse({
    id: id || undefined,
    slug,
    name,
    category_id: String(formData.get("category_id") ?? ""),
    description_md: String(formData.get("description_md") ?? ""),
    specs_json: specsRaw,
    gallery_images_json: galleryRaw,
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    sort_order: formData.get("sort_order") ?? 0,
    published: formData.get("published") === "on" || formData.get("published") === "true",
    seo_title: formData.get("seo_title") || undefined,
    seo_description: formData.get("seo_description") || undefined,
  });
  if (!parsed.success) throw new Error(parsed.error.message);

  const row = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    category_id: parsed.data.category_id,
    description_md: parsed.data.description_md,
    specs_json: specs,
    gallery_images,
    featured: parsed.data.featured,
    sort_order: parsed.data.sort_order,
    published: parsed.data.published,
    seo_title: parsed.data.seo_title ?? null,
    seo_description: parsed.data.seo_description ?? null,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("products")
      .update(row)
      .eq("id", parsed.data.id);
    if (error) {
      throwIfMissingGalleryColumn(error);
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("products").insert(row);
    if (error) {
      throwIfMissingGalleryColumn(error);
      throw new Error(error.message);
    }
    revalidatePath("/", "layout");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    redirect("/admin/products");
  }
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function upsertProductCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = formData.get("id") as string | null;
  const name = String(formData.get("name") ?? "");
  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) slug = slugify(name);
  const parsed = productCategorySchema.safeParse({
    id: id || undefined,
    slug,
    name,
    sort_order: formData.get("sort_order") ?? 0,
  });
  if (!parsed.success) throw new Error(parsed.error.message);

  const row = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    sort_order: parsed.data.sort_order,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("product_categories")
      .update(row)
      .eq("id", parsed.data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("product_categories").insert(row);
    if (error) throw new Error(error.message);
    revalidateProductCategoriesAdmin();
    revalidatePublic();
    redirect("/admin/product-categories");
  }
  revalidateProductCategoriesAdmin();
  revalidatePublic();
}

export async function deleteProductCategoryForm(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) throw new Error("ID tidak valid");
  const { count, error: countErr } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);
  if (countErr) throw new Error(countErr.message);
  if (count != null && count > 0) {
    throw new Error(
      `Tidak dapat menghapus kategori: masih dipakai oleh ${count} produk. Pindahkan produk ke kategori lain dulu.`
    );
  }
  const { error } = await supabase.from("product_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateProductCategoriesAdmin();
  revalidatePublic();
  redirect("/admin/product-categories");
}

export async function deleteProductForm(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) throw new Error("ID tidak valid");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

const postSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string(),
  body_md: z.string(),
  cover_image_url: z.string().optional(),
  post_type: z.enum(["news", "case_study"]),
  category_id: z.string().uuid(),
  published: z.coerce.boolean(),
  published_at: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  author_name: z.string().min(1),
});

const postCategorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  sort_order: z.coerce.number().int(),
});

export async function upsertPost(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = formData.get("id") as string | null;
  const title = String(formData.get("title") ?? "");
  let slug = String(formData.get("slug") ?? "");
  if (!slug) slug = slugify(title);
  const published =
    formData.get("published") === "on" || formData.get("published") === "true";
  const publishedAtRaw = (formData.get("published_at") as string | null) || null;

  const parsed = postSchema.safeParse({
    id: id || undefined,
    slug,
    title,
    excerpt: String(formData.get("excerpt") ?? ""),
    body_md: String(formData.get("body_md") ?? ""),
    cover_image_url: formData.get("cover_image_url") || undefined,
    post_type: formData.get("post_type") ?? "news",
    category_id: String(formData.get("category_id") ?? ""),
    published,
    published_at: publishedAtRaw ?? undefined,
    seo_title: formData.get("seo_title") || undefined,
    seo_description: formData.get("seo_description") || undefined,
    author_name: String(formData.get("author_name") ?? "MIB Chemicals"),
  });
  if (!parsed.success) throw new Error(parsed.error.message);

  const published_at = parsed.data.published
    ? new Date(parsed.data.published_at || Date.now()).toISOString()
    : null;

  const row = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    body_md: parsed.data.body_md,
    cover_image_url: parsed.data.cover_image_url ?? null,
    post_type: parsed.data.post_type,
    category_id: parsed.data.category_id,
    published: parsed.data.published,
    published_at,
    seo_title: parsed.data.seo_title ?? null,
    seo_description: parsed.data.seo_description ?? null,
    author_name: parsed.data.author_name,
  };

  if (parsed.data.id) {
    const { error } = await supabase.from("posts").update(row).eq("id", parsed.data.id);
    if (error) throw new Error(error.message);
  } else {
    const { data: inserted, error } = await supabase.from("posts").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    if (!inserted?.id) throw new Error("Gagal membuat artikel");
    revalidatePath("/articles");
    revalidatePath(`/articles/${parsed.data.slug}`);
    revalidatePath("/admin/posts");
    revalidatePublic();
    redirect(`/admin/posts/${inserted.id}/edit`);
  }
  revalidatePath("/articles");
  revalidatePath(`/articles/${parsed.data.slug}`);
  revalidatePath("/admin/posts");
  revalidatePublic();
}

export async function upsertPostCategory(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = formData.get("id") as string | null;
  const name = String(formData.get("name") ?? "");
  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug) slug = slugify(name);
  const parsed = postCategorySchema.safeParse({
    id: id || undefined,
    slug,
    name,
    sort_order: formData.get("sort_order") ?? 0,
  });
  if (!parsed.success) throw new Error(parsed.error.message);

  const row = {
    slug: parsed.data.slug,
    name: parsed.data.name,
    sort_order: parsed.data.sort_order,
  };

  if (parsed.data.id) {
    const { error } = await supabase
      .from("post_categories")
      .update(row)
      .eq("id", parsed.data.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("post_categories").insert(row);
    if (error) throw new Error(error.message);
    revalidatePostCategoriesAdmin();
    revalidatePublic();
    redirect("/admin/post-categories");
  }
  revalidatePostCategoriesAdmin();
  revalidatePublic();
}

export async function deletePostCategoryForm(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) throw new Error("ID tidak valid");
  const { count, error: countErr } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);
  if (countErr) throw new Error(countErr.message);
  if (count != null && count > 0) {
    throw new Error(
      `Tidak dapat menghapus kategori: masih dipakai oleh ${count} artikel. Pindahkan artikel ke kategori lain dulu.`
    );
  }
  const { error } = await supabase.from("post_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePostCategoriesAdmin();
  revalidatePublic();
  redirect("/admin/post-categories");
}

export async function deletePostForm(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const id = String(formData.get("id") ?? "");
  if (!z.string().uuid().safeParse(id).success) throw new Error("ID tidak valid");
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/articles");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function uploadProductMsds(formData: FormData): Promise<void> {
  const supabase = await requireAdmin();
  if (!supabase) throw new Error("Unauthorized");
  const productId = String(formData.get("product_id") ?? "");
  const file = formData.get("file");
  if (!productId || !(file instanceof File) || file.size === 0) {
    throw new Error("Produk dan file wajib diisi");
  }
  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", productId)
    .maybeSingle();
  if (!product?.slug) throw new Error("Produk tidak ditemukan");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${product.slug}/${Date.now()}-${safeName}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from("msds").upload(path, buf, {
    contentType: file.type || "application/pdf",
    upsert: true,
  });
  if (upErr) throw new Error(upErr.message);

  const { error } = await supabase
    .from("products")
    .update({
      msds_bucket_path: path,
      msds_original_filename: file.name,
    })
    .eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId}/edit`);
}
