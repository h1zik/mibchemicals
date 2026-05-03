-- Logo navigasi & favicon (URL di site_config + bucket site-assets)

alter table public.site_config
  add column if not exists nav_logo_url text;

alter table public.site_config
  add column if not exists favicon_url text;

comment on column public.site_config.nav_logo_url is 'URL publik gambar logo navbar (mis. Supabase Storage site-assets).';
comment on column public.site_config.favicon_url is 'URL publik favicon (ico/png/svg/webp).';

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

drop policy if exists "site_assets_public_read" on storage.objects;
create policy "site_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'site-assets');

drop policy if exists "site_assets_upload_admin" on storage.objects;
create policy "site_assets_upload_admin"
  on storage.objects for insert
  with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "site_assets_update_admin" on storage.objects;
create policy "site_assets_update_admin"
  on storage.objects for update
  using (bucket_id = 'site-assets' and public.is_admin())
  with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "site_assets_delete_admin" on storage.objects;
create policy "site_assets_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'site-assets' and public.is_admin());
