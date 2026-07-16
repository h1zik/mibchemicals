-- Solusi (problem → solution) sebagai konten CMS, ber-relasi ke industri.
-- Meniru struktur tabel Masalah–Solusi eonchemicals. Jalankan setelah 009.

create table if not exists public.solutions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  industry_id uuid references public.industries (id) on delete set null,
  equipment text,
  problem text not null default '',
  solution_label text not null default '',
  summary text not null default '',
  body_md text not null default '',
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.solutions.equipment is 'Kolom "Equipment" pada tabel industri (mis. Pickling Line).';
comment on column public.solutions.problem is 'Kolom "Masalah" pada tabel industri.';
comment on column public.solutions.solution_label is 'Kolom "Solusi" ringkas pada tabel industri (mis. Acid Corrosion Inhibitor).';

drop trigger if exists trg_solutions_updated on public.solutions;
create trigger trg_solutions_updated
  before update on public.solutions
  for each row execute procedure public.set_updated_at();

alter table public.solutions enable row level security;

drop policy if exists "solutions_select_public" on public.solutions;
create policy "solutions_select_public"
  on public.solutions for select
  using (published = true or public.is_admin());

drop policy if exists "solutions_write_admin" on public.solutions;
create policy "solutions_write_admin"
  on public.solutions for all
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists idx_solutions_industry_id on public.solutions (industry_id);
create index if not exists idx_solutions_sort_order on public.solutions (sort_order);
