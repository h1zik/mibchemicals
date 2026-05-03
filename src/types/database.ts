export type IndustryItem = {
  key: string;
  name: string;
  summary: string;
};

export type SiteConfig = {
  id: string;
  singleton_key: string;
  updated_at: string;
  meta_title_default: string;
  meta_description_default: string;
  site_keywords: string;
  company_name: string;
  company_tagline: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_cta_label: string;
  hero_primary_cta_url: string;
  hero_secondary_cta_label: string;
  hero_secondary_cta_url: string;
  solution_problem_title: string;
  solution_problem_body: string;
  solution_innovation_title: string;
  solution_innovation_body: string;
  solution_mib_title: string;
  solution_mib_body: string;
  industries_json: IndustryItem[];
  /** URL publik logo di navbar (opsional). */
  nav_logo_url: string | null;
  /** URL publik favicon (opsional). */
  favicon_url: string | null;
};

import type { ProductGalleryImage } from "@/lib/product-gallery";

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body_md: string;
  icon_key: string;
  sort_order: number;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description_md: string;
  specs_json: Record<string, string>;
  /** Galeri: item dengan `path` (bucket product-gallery) atau `url` absolut */
  gallery_images: ProductGalleryImage[];
  msds_bucket_path: string | null;
  msds_original_filename: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  cover_image_url: string | null;
  post_type: "news" | "case_study";
  published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  author_name: string;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | null;
  industry: string | null;
  message: string;
  created_at: string;
};
