insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'generations',
    'generations',
    true,
    262144000,
    array[
        'image/jpeg',
        'image/png',
        'image/webp',
        'video/mp4',
        'video/quicktime',
        'video/webm',
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/x-wav',
        'audio/mp4'
    ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
