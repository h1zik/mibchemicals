-- MIB Chemicals — core schema, RLS, storage, seed
-- Run in Supabase SQL Editor or via CLI migrations.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.site_config (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null unique default 'main',
  updated_at timestamptz not null default now(),
  meta_title_default text not null default 'MIB Chemicals | Specialty Chemicals & Maklon Kimia Industri',
  meta_description_default text not null default 'MIB Chemicals menyediakan specialty chemicals dan solusi maklon kimia industri untuk Oil & Gas, Manufacturing, Mining, dan Water Treatment.',
  site_keywords text not null default 'specialty chemicals, maklon kimia industri, kimia industri, B2B chemicals, MIB Chemicals',
  company_name text not null default 'MIB Chemicals',
  company_tagline text not null default 'Menjadi perusahaan specialty chemicals yang leading dalam inovasi dan penyelesaian masalah customer.',
  contact_email text not null default 'sales@mibchemicals.example',
  contact_phone text not null default '+62 000 0000 0000',
  contact_address text not null default 'Indonesia',
  hero_title text not null default 'Specialty Chemicals for Industrial Excellence',
  hero_subtitle text not null default 'Solusi kimia terpercaya untuk Oil & Gas, Manufacturing, Mining, dan Water Treatment.',
  hero_primary_cta_label text not null default 'Hubungi Kami',
  hero_primary_cta_url text not null default '/contact',
  hero_secondary_cta_label text not null default 'Lihat Layanan',
  hero_secondary_cta_url text not null default '/services',
  solution_problem_title text not null default 'Tantangan Industri',
  solution_problem_body text not null default 'Operasi B2B menghadapi variabilitas proses, compliance, dan tekanan efisiensi energi serta air.',
  solution_innovation_title text not null default 'Inovasi Berbasis Data',
  solution_innovation_body text not null default 'Kami menggabungkan formulasi presisi dengan pendekatan engineering untuk menyesuaikan solusi pada kondisi lapangan Anda.',
  solution_mib_title text not null default 'Solusi MIB Chemicals',
  solution_mib_body text not null default 'Dari assessment hingga delivery, tim kami mendampingi implementasi specialty chemicals yang aman, konsisten, dan terukur.',
  industries_json jsonb not null default '[
    {"key":"oil-gas","name":"Oil & Gas","summary":"Aditif dan treatment untuk produksi dan pemrosesan."},
    {"key":"manufacturing","name":"Manufacturing","summary":"Kimia proses untuk lini produksi dan finishing."},
    {"key":"mining","name":"Mining","summary":"Flotasi, ekstraksi, dan manajemen air tambang."},
    {"key":"water","name":"Water Treatment","summary":"Koagulan, biocide, dan optimasi sistem air industri."}
  ]'::jsonb
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body_md text not null default '',
  icon_key text not null default 'flask',
  sort_order int not null default 0,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'General',
  description_md text not null default '',
  specs_json jsonb not null default '{}'::jsonb,
  msds_bucket_path text,
  msds_original_filename text,
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body_md text not null default '',
  cover_image_url text,
  post_type text not null default 'news' check (post_type in ('news', 'case_study')),
  published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  author_name text not null default 'MIB Chemicals',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  phone text,
  industry text,
  message text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Triggers: updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_config_updated on public.site_config;
create trigger trg_site_config_updated
  before update on public.site_config
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_services_updated on public.services;
create trigger trg_services_updated
  before update on public.services
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_products_updated on public.products;
create trigger trg_products_updated
  before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_posts_updated on public.posts;
create trigger trg_posts_updated
  before update on public.posts
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.admin_users enable row level security;
alter table public.site_config enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.leads enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- admin_users: users can see only their row; inserts via service role / dashboard bootstrap
drop policy if exists "admin_users_select_self" on public.admin_users;
create policy "admin_users_select_self"
  on public.admin_users for select
  using (auth.uid() = user_id);

-- site_config: public read; admins write
drop policy if exists "site_config_select_all" on public.site_config;
create policy "site_config_select_all"
  on public.site_config for select
  using (true);

drop policy if exists "site_config_update_admin" on public.site_config;
create policy "site_config_update_admin"
  on public.site_config for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site_config_insert_admin" on public.site_config;
create policy "site_config_insert_admin"
  on public.site_config for insert
  with check (public.is_admin());

-- services
drop policy if exists "services_select_public" on public.services;
create policy "services_select_public"
  on public.services for select
  using (published = true or public.is_admin());

drop policy if exists "services_write_admin" on public.services;
create policy "services_write_admin"
  on public.services for all
  using (public.is_admin())
  with check (public.is_admin());

-- products
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  using (published = true or public.is_admin());

drop policy if exists "products_write_admin" on public.products;
create policy "products_write_admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- posts
drop policy if exists "posts_select_public" on public.posts;
create policy "posts_select_public"
  on public.posts for select
  using ((published = true and published_at is not null and published_at <= now()) or public.is_admin());

drop policy if exists "posts_write_admin" on public.posts;
create policy "posts_write_admin"
  on public.posts for all
  using (public.is_admin())
  with check (public.is_admin());

-- leads: anyone can submit; admins read
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public"
  on public.leads for insert
  with check (true);

drop policy if exists "leads_select_admin" on public.leads;
create policy "leads_select_admin"
  on public.leads for select
  using (public.is_admin());

drop policy if exists "leads_delete_admin" on public.leads;
create policy "leads_delete_admin"
  on public.leads for delete
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage (MSDS)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('msds', 'msds', true)
on conflict (id) do nothing;

drop policy if exists "msds_public_read" on storage.objects;
create policy "msds_public_read"
  on storage.objects for select
  using (bucket_id = 'msds');

drop policy if exists "msds_upload_admin" on storage.objects;
create policy "msds_upload_admin"
  on storage.objects for insert
  with check (bucket_id = 'msds' and public.is_admin());

drop policy if exists "msds_update_admin" on storage.objects;
create policy "msds_update_admin"
  on storage.objects for update
  using (bucket_id = 'msds' and public.is_admin())
  with check (bucket_id = 'msds' and public.is_admin());

drop policy if exists "msds_delete_admin" on storage.objects;
create policy "msds_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'msds' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed (idempotent inserts by slug)
-- ---------------------------------------------------------------------------

insert into public.site_config (singleton_key) values ('main')
on conflict (singleton_key) do nothing;

insert into public.services (slug, title, summary, body_md, icon_key, sort_order, published, seo_title, seo_description)
values
  ('formulasi-maklon', 'Formulasi & Maklon Kimia', 'Desain formulasi sesuai parameter proses dan regulasi setempat.', 'Kami mendukung **maklon kimia industri** dengan dokumentasi teknis dan skala pilot hingga produksi.', 'flask', 10, true,
   'Maklon Kimia Industri | MIB Chemicals', 'Layanan formulasi specialty chemicals untuk B2B.'),
  ('water-treatment', 'Water Treatment Chemicals', 'Program dosing dan monitoring untuk sistem air industri.', 'Solusi koagulasi, **scale inhibition**, dan kontrol mikrobiologi disesuaikan dengan sumber air Anda.', 'droplet', 20, true,
   'Kimia Water Treatment | MIB Chemicals', 'Specialty chemicals untuk pengolahan air industri.'),
  ('technical-support', 'Technical Support', 'Ahli kimia mendampingi troubleshooting dan optimasi.', 'Audit proses, sampling, dan rekomendasi berbasis data untuk peningkatan yield dan kepatuhan.', 'support', 30, true,
   'Technical Support Kimia | MIB Chemicals', 'Dukungan teknis B2B untuk specialty chemicals.')
on conflict (slug) do nothing;

insert into public.products (slug, name, category, description_md, specs_json, featured, sort_order, published, seo_title, seo_description)
values
  ('scale-inhibitor-x1', 'Scale Inhibitor X1', 'Water Treatment',
   'Inhibitor endapan untuk sistem pendingin dan boiler industri.',
   '{"appearance":"Clear liquid","pH":"6.5–8.0","density":"1.05 g/mL"}'::jsonb,
   true, 10, true,
   'Scale Inhibitor Specialty Chemicals | MIB', 'Produk kimia industri untuk pencegahan scaling.'),
  ('demulsifier-pro', 'Demulsifier Pro', 'Oil & Gas',
   'Demulsifier untuk pemisahan air-minyak pada fasilitas produksi.',
   '{"appearance":"Amber liquid","flash_point":"> 60 °C"}'::jsonb,
   true, 20, true,
   'Demulsifier Oil & Gas | MIB Chemicals', 'Specialty chemicals untuk Oil & Gas.')
on conflict (slug) do nothing;

insert into public.posts (slug, title, excerpt, body_md, post_type, published, published_at, seo_title, seo_description, author_name)
values
  ('meningkatkan-efisiensi-water-treatment', 'Meningkatkan Efisiensi Water Treatment di Pabrik',
   'Studi singkat optimasi dosing dan monitoring kualitas air.',
   '## Ringkasan\n\nDengan pendekatan **data-driven**, tim MIB membantu pelanggan menurunkan konsumsi kimia sambil mempertahankan kualitas outlet.\n\n## Hasil\n\n- Penurunan downtime sistem\n- Kepatuhan parameter regulatori',
   'case_study', true, now() - interval '2 days',
   'Case Study Water Treatment | MIB Chemicals', 'Studi kasus specialty chemicals water treatment.',
   'MIB Chemicals'),
  ('tren-specialty-chemicals-2026', 'Tren Specialty Chemicals untuk Industri 2026',
   'Gambaran singkat inovasi dan sustainability.',
   'Industri B2B semakin mengutamakan **traceability** dan formulasi ramah lingkungan. MIB Chemicals berinvestasi pada R&D kolaboratif.',
   'news', true, now() - interval '7 days',
   'Berita Specialty Chemicals | MIB Chemicals', 'Update industri kimia khusus dan maklon.',
   'MIB Chemicals')
on conflict (slug) do nothing;
