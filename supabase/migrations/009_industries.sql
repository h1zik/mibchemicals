-- Industri sebagai konten CMS (tabel + halaman per-sektor).
-- Menggantikan peran site_config.industries_json (kolom lama dibiarkan untuk kompatibilitas).
-- Jalankan setelah 001–008. Di Supabase: SQL Editor → tempel → Run.

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null default '',
  intro_md text not null default '',
  icon_key text not null default 'flask',
  hero_image_url text,
  process_image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.industries.intro_md is 'Konteks/masalah industri (Markdown), tampil di atas tabel Masalah–Solusi.';
comment on column public.industries.process_image_url is 'Ilustrasi proses industri (URL publik, opsional).';

drop trigger if exists trg_industries_updated on public.industries;
create trigger trg_industries_updated
  before update on public.industries
  for each row execute procedure public.set_updated_at();

alter table public.industries enable row level security;

drop policy if exists "industries_select_public" on public.industries;
create policy "industries_select_public"
  on public.industries for select
  using (published = true or public.is_admin());

drop policy if exists "industries_write_admin" on public.industries;
create policy "industries_write_admin"
  on public.industries for all
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists idx_industries_sort_order on public.industries (sort_order);

-- Seed dari daftar default (selaras dengan site_config.industries_json bawaan).
insert into public.industries (slug, name, summary, icon_key, sort_order, published) values
  ('oil-gas', 'Oil & Gas', 'Aditif dan treatment untuk produksi dan pemrosesan.', 'oil-gas', 10, true),
  ('manufacturing', 'Manufacturing', 'Kimia proses untuk lini produksi dan finishing.', 'manufacturing', 20, true),
  ('mining', 'Mining', 'Flotasi, ekstraksi, dan manajemen air tambang.', 'mining', 30, true),
  ('water-treatment', 'Water Treatment', 'Koagulan, biocide, dan optimasi sistem air industri.', 'water', 40, true)
on conflict (slug) do nothing;
