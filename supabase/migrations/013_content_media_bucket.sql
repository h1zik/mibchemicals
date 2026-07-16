-- Bucket storage untuk gambar konten CMS baru (industri, solusi, testimoni,
-- sertifikasi, galeri about). Public read + admin write. Jalankan setelah 009–012.

insert into storage.buckets (id, name, public)
values ('content-media', 'content-media', true)
on conflict (id) do nothing;

drop policy if exists "content_media_public_read" on storage.objects;
create policy "content_media_public_read"
  on storage.objects for select
  using (bucket_id = 'content-media');

drop policy if exists "content_media_upload_admin" on storage.objects;
create policy "content_media_upload_admin"
  on storage.objects for insert
  with check (bucket_id = 'content-media' and public.is_admin());

drop policy if exists "content_media_update_admin" on storage.objects;
create policy "content_media_update_admin"
  on storage.objects for update
  using (bucket_id = 'content-media' and public.is_admin())
  with check (bucket_id = 'content-media' and public.is_admin());

drop policy if exists "content_media_delete_admin" on storage.objects;
create policy "content_media_delete_admin"
  on storage.objects for delete
  using (bucket_id = 'content-media' and public.is_admin());
