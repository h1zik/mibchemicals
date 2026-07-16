-- Blok kredibilitas: statistik perusahaan, sertifikasi, galeri foto /about.
-- Semua diisi klien lewat admin; default kosong agar tidak menampilkan data karangan.

alter table public.site_config
  add column if not exists company_stats_json jsonb not null default '[]'::jsonb,
  add column if not exists certifications_json jsonb not null default '[]'::jsonb,
  add column if not exists about_gallery_json jsonb not null default '[]'::jsonb;

comment on column public.site_config.company_stats_json is
  'Array of { "value": number, "suffix": string, "label": string } — statistik perusahaan (tahun, cabang, SDM). Kosong = section disembunyikan.';
comment on column public.site_config.certifications_json is
  'Array of { "name": string, "description": string, "image_url"?: string } — sertifikasi/akreditasi. Kosong = section disembunyikan.';
comment on column public.site_config.about_gallery_json is
  'Array of { "url": string, "alt"?: string } — galeri foto fasilitas di halaman /about.';
