insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'generations',
    'generations',
    true,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view generation images" on storage.objects;
create policy "Public can view generation images"
    on storage.objects for select
    to public
    using (bucket_id = 'generations');

drop policy if exists "Service role can manage generation images" on storage.objects;
create policy "Service role can manage generation images"
    on storage.objects for all
    to service_role
    using (bucket_id = 'generations')
    with check (bucket_id = 'generations');

create unique index if not exists generations_one_pending_per_user_project_uidx
    on public.generations(project_id, user_id)
    where status = 'pending';
