-- Halaman "Tentang kami" (konten dari site_config, diedit di admin)

alter table public.site_config
  add column if not exists about_page_title text not null default 'Tentang kami',
  add column if not exists about_page_subtitle text not null default '',
  add column if not exists about_page_body_md text not null default E'## Visi kami\n\nMenjadi mitra specialty chemicals dan maklon kimia industri yang andal untuk kebutuhan B2B.\n\n## Yang kami lakukan\n\nKami mendampingi formulasi, skala produksi, dan implementasi di lapangan — dari assessment hingga delivery.',
  add column if not exists about_page_seo_title text,
  add column if not exists about_page_seo_description text;

comment on column public.site_config.about_page_title is 'Judul utama halaman /about.';
comment on column public.site_config.about_page_subtitle is 'Subjudul / lead paragraf di bawah judul.';
comment on column public.site_config.about_page_body_md is 'Isi halaman Tentang (Markdown).';
comment on column public.site_config.about_page_seo_title is 'Meta title khusus halaman about (opsional).';
comment on column public.site_config.about_page_seo_description is 'Meta description khusus halaman about (opsional).';
