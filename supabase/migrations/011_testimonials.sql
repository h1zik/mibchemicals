-- Testimonial pelanggan sebagai konten CMS. Jalankan setelah 009.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null default '',
  avatar_url text,
  industry_id uuid references public.industries (id) on delete set null,
  rating int check (rating between 1 and 5),
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.testimonials.author_role is 'Jabatan / perusahaan penulis (opsional).';

drop trigger if exists trg_testimonials_updated on public.testimonials;
create trigger trg_testimonials_updated
  before update on public.testimonials
  for each row execute procedure public.set_updated_at();

alter table public.testimonials enable row level security;

drop policy if exists "testimonials_select_public" on public.testimonials;
create policy "testimonials_select_public"
  on public.testimonials for select
  using (published = true or public.is_admin());

drop policy if exists "testimonials_write_admin" on public.testimonials;
create policy "testimonials_write_admin"
  on public.testimonials for all
  using (public.is_admin())
  with check (public.is_admin());

create index if not exists idx_testimonials_sort_order on public.testimonials (sort_order);
