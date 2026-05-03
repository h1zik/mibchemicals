import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseGalleryImages } from "@/lib/product-gallery";
import type { Post, Product, Service, SiteConfig } from "@/types/database";

function mapProductRow(row: Record<string, unknown>): Product {
  const specs = row.specs_json;
  const specsJson =
    typeof specs === "object" && specs !== null && !Array.isArray(specs)
      ? (specs as Record<string, string>)
      : {};
  return {
    ...(row as unknown as Product),
    specs_json: specsJson,
    gallery_images: parseGalleryImages(row.gallery_images),
  };
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
        return { key: o.key, name: o.name, summary: o.summary };
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
  return {
    ...(data as SiteConfig),
    industries_json: parseIndustries(data.industries_json),
    nav_logo_url:
      row.nav_logo_url == null || row.nav_logo_url === "" ? null : String(row.nav_logo_url),
    favicon_url:
      row.favicon_url == null || row.favicon_url === "" ? null : String(row.favicon_url),
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
    .select("*")
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
    .select("*")
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
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];
  return data as Post[];
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
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data as Post;
}

export function getMsdsPublicUrl(bucketPath: string | null): string | null {
  if (!bucketPath) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  const trimmed = base.replace(/\/$/, "");
  return `${trimmed}/storage/v1/object/public/msds/${bucketPath}`;
}
