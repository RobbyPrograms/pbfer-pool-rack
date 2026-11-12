-- Customer artwork is private. Only the server service role can upload/read it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('custom-logos', 'custom-logos', false, 3145728,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;
