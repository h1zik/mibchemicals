import type { SiteConfig } from "@/types/database";

/** Used when Supabase env is not set (e.g. local build without keys). */
export const FALLBACK_SITE_CONFIG: SiteConfig = {
  id: "local",
  singleton_key: "main",
  updated_at: new Date().toISOString(),
  meta_title_default:
    "MIB Chemicals | Specialty Chemicals & Maklon Kimia Industri",
  meta_description_default:
    "MIB Chemicals — specialty chemicals dan maklon kimia industri untuk Oil & Gas, Manufacturing, Mining, dan Water Treatment. Atur konten di Supabase.",
  site_keywords:
    "specialty chemicals, maklon kimia industri, MIB Chemicals, kimia industri",
  company_name: "MIB Chemicals",
  company_tagline:
    "Menjadi perusahaan specialty chemicals yang leading dalam inovasi dan penyelesaian masalah customer.",
  contact_email: "sales@mibchemicals.example",
  contact_phone: "+62 000 0000 0000",
  contact_address: "Indonesia",
  hero_title: "Specialty Chemicals for Industrial Excellence",
  hero_subtitle:
    "Solusi kimia terpercaya untuk Oil & Gas, Manufacturing, Mining, dan Water Treatment.",
  hero_primary_cta_label: "Hubungi Kami",
  hero_primary_cta_url: "/contact",
  hero_secondary_cta_label: "Lihat Layanan",
  hero_secondary_cta_url: "/services",
  solution_problem_title: "Tantangan Industri",
  solution_problem_body:
    "Operasi B2B menghadapi variabilitas proses, compliance, dan tekanan efisiensi.",
  solution_innovation_title: "Inovasi Berbasis Data",
  solution_innovation_body:
    "Formulasi presisi dan pendekatan engineering disesuaikan dengan kondisi lapangan Anda.",
  solution_mib_title: "Solusi MIB Chemicals",
  solution_mib_body:
    "Dari assessment hingga delivery, kami mendampingi implementasi specialty chemicals yang aman dan konsisten.",
  industries_json: [
    {
      key: "oil-gas",
      name: "Oil & Gas",
      summary: "Aditif dan treatment untuk produksi dan pemrosesan.",
    },
    {
      key: "manufacturing",
      name: "Manufacturing",
      summary: "Kimia proses untuk lini produksi dan finishing.",
    },
    {
      key: "mining",
      name: "Mining",
      summary: "Flotasi, ekstraksi, dan manajemen air tambang.",
    },
    {
      key: "water",
      name: "Water Treatment",
      summary: "Koagulan, biocide, dan optimasi sistem air industri.",
    },
  ],
  nav_logo_url: null,
  favicon_url: null,
  about_page_title: "Tentang kami",
  about_page_subtitle:
    "Specialty chemicals dan maklon kimia industri — mitra formulasi untuk operasi B2B Anda.",
  about_page_body_md:
    "## Visi kami\n\nMenjadi mitra specialty chemicals dan maklon kimia industri yang andal untuk kebutuhan B2B.\n\n## Yang kami lakukan\n\nKami mendampingi formulasi, skala produksi, dan implementasi di lapangan — dari assessment hingga delivery.",
  about_page_seo_title: null,
  about_page_seo_description: null,
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
