import { FALLBACK_SITE_CONFIG } from "@/lib/constants";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseGalleryImages } from "@/lib/product-gallery";
import { INDUSTRY_ICON_KEY_SET } from "@/lib/industry-icon-keys";
import type {
  Post,
  PostCategory,
  Product,
  ProductCategory,
  Service,
  SiteConfig,
} from "@/types/database";

function parseProductCategoryEmbed(raw: unknown): Product["product_category"] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.slug === "string"
  ) {
    return { id: o.id, name: o.name, slug: o.slug };
  }
  return null;
}

export function mapProductRow(row: Record<string, unknown>): Product {
  const specs = row.specs_json;
  const specsJson =
    typeof specs === "object" && specs !== null && !Array.isArray(specs)
      ? (specs as Record<string, string>)
      : {};
  const categoryId = row.category_id;
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    category_id: typeof categoryId === "string" ? categoryId : String(categoryId ?? ""),
    product_category: parseProductCategoryEmbed(row.product_categories),
    description_md: String(row.description_md ?? ""),
    specs_json: specsJson,
    gallery_images: parseGalleryImages(row.gallery_images),
    msds_bucket_path:
      row.msds_bucket_path == null || row.msds_bucket_path === ""
        ? null
        : String(row.msds_bucket_path),
    msds_original_filename:
      row.msds_original_filename == null || row.msds_original_filename === ""
        ? null
        : String(row.msds_original_filename),
    featured: Boolean(row.featured),
    sort_order: Number(row.sort_order ?? 0),
    published: Boolean(row.published),
    seo_title:
      row.seo_title == null || row.seo_title === "" ? null : String(row.seo_title),
    seo_description:
      row.seo_description == null || row.seo_description === ""
        ? null
        : String(row.seo_description),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export const PRODUCT_LIST_SELECT = "*, product_categories ( id, name, slug )";

export const POST_LIST_SELECT = "*, post_categories ( id, name, slug )";

function parsePostCategoryEmbed(raw: unknown): Post["post_category"] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.slug === "string"
  ) {
    return { id: o.id, name: o.name, slug: o.slug };
  }
  return null;
}

export function mapPostRow(row: Record<string, unknown>): Post {
  const categoryId = row.category_id;
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    body_md: String(row.body_md ?? ""),
    cover_image_url:
      row.cover_image_url == null || row.cover_image_url === ""
        ? null
        : String(row.cover_image_url),
    post_type: row.post_type === "case_study" ? "case_study" : "news",
    published: Boolean(row.published),
    published_at:
      row.published_at == null || row.published_at === ""
        ? null
        : String(row.published_at),
    seo_title:
      row.seo_title == null || row.seo_title === "" ? null : String(row.seo_title),
    seo_description:
      row.seo_description == null || row.seo_description === ""
        ? null
        : String(row.seo_description),
    author_name: String(row.author_name ?? "MIB Chemicals"),
    category_id: typeof categoryId === "string" ? categoryId : String(categoryId ?? ""),
    post_category: parsePostCategoryEmbed(row.post_categories),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as ProductCategory[];
}

export async function getPostCategories(): Promise<PostCategory[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("post_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as PostCategory[];
}

function parseIndustries(raw: unknown): SiteConfig["industries_json"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      if (
        typeof o.key === "string" &&
        typeof o.name === "string" &&
        typeof o.summary === "string"
      ) {
        const icon_key =
          typeof o.icon_key === "string" && INDUSTRY_ICON_KEY_SET.has(o.icon_key) ? o.icon_key : undefined;
        return { key: o.key, name: o.name, summary: o.summary, ...(icon_key ? { icon_key } : {}) };
      }
      return null;
    })
    .filter(Boolean) as SiteConfig["industries_json"];
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .eq("singleton_key", "main")
    .maybeSingle();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const fb = FALLBACK_SITE_CONFIG;
  return {
    ...(data as SiteConfig),
    industries_json: parseIndustries(data.industries_json),
    nav_logo_url:
      row.nav_logo_url == null || row.nav_logo_url === "" ? null : String(row.nav_logo_url),
    favicon_url:
      row.favicon_url == null || row.favicon_url === "" ? null : String(row.favicon_url),
    about_page_title:
      typeof row.about_page_title === "string" && row.about_page_title.trim()
        ? String(row.about_page_title).trim()
        : fb.about_page_title,
    about_page_subtitle:
      typeof row.about_page_subtitle === "string" ? String(row.about_page_subtitle) : fb.about_page_subtitle,
    about_page_body_md:
      typeof row.about_page_body_md === "string" ? String(row.about_page_body_md) : fb.about_page_body_md,
    about_page_seo_title:
      row.about_page_seo_title == null || row.about_page_seo_title === ""
        ? null
        : String(row.about_page_seo_title),
    about_page_seo_description:
      row.about_page_seo_description == null || row.about_page_seo_description === ""
        ? null
        : String(row.about_page_seo_description),
  };
}

export async function getServices(): Promise<Service[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Service;
}

export async function getProducts(): Promise<Product[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapProductRow(row as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapProductRow(data as Record<string, unknown>);
}

export async function getPosts(): Promise<Post[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_LIST_SELECT)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return data.map((row) => mapPostRow(row as Record<string, unknown>));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_LIST_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapPostRow(data as Record<string, unknown>);
}

export async function getSimilarProducts(
  categoryId: string,
  excludeProductId: string,
  limit = 4
): Promise<Product[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !categoryId
  ) {
    return [];
  }
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .eq("category_id", categoryId)
    .eq("published", true)
    .neq("id", excludeProductId)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return data.map((row) => mapProductRow(row as Record<string, unknown>));
}

export async function getSimilarPosts(
  categoryId: string,
  excludePostId: string,
  limit = 3
): Promise<Post[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !categoryId
  ) {
    return [];
  }
  const supabase = createSupabaseServerClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_LIST_SELECT)
    .eq("category_id", categoryId)
    .eq("published", true)
    .not("published_at", "is", null)
    .lte("published_at", now)
    .neq("id", excludePostId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map((row) => mapPostRow(row as Record<string, unknown>));
}

export function getMsdsPublicUrl(bucketPath: string | null): string | null {
  if (!bucketPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const trimmed = base.replace(/\/$/, "");
  return `${trimmed}/storage/v1/object/public/msds/${bucketPath}`;
}
