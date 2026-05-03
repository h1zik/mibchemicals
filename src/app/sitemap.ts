import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/constants";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl.replace(/\/$/, "");
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/articles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const supabase = createSupabasePublicClient();
  if (!supabase) return staticRoutes;

  const [services, products, posts] = await Promise.all([
    supabase.from("services").select("slug, updated_at").eq("published", true),
    supabase.from("products").select("slug, updated_at").eq("published", true),
    supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("published", true)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString()),
  ]);

  const dynamic: MetadataRoute.Sitemap = [];

  services.data?.forEach((s) => {
    dynamic.push({
      url: `${base}/services/${s.slug}`,
      lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  });
  products.data?.forEach((p) => {
    dynamic.push({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  });
  posts.data?.forEach((p) => {
    dynamic.push({
      url: `${base}/articles/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  });

  return [...staticRoutes, ...dynamic];
}
