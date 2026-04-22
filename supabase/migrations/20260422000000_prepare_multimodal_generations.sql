alter table public.generations
    add column if not exists generation_type text not null default 'image_to_video',
    add column if not exists input_images jsonb not null default '[]'::jsonb,
    add column if not exists input_videos jsonb not null default '[]'::jsonb,
    add column if not exists input_audios jsonb not null default '[]'::jsonb,
    add column if not exists resolution text,
    add column if not exists duration_seconds integer,
    add column if not exists aspect_ratio text,
    add column if not exists output_video_url text,
    add column if not exists provider_job_id text,
    add column if not exists status_detail text;

create index if not exists generations_provider_job_id_idx
    on public.generations(provider_job_id);

comment on column public.generations.generation_type is 'image_to_video, text_to_video, multi_modal_video, extension, edit';
comment on column public.generations.input_images is 'Ordered image references staged in storage or remote URLs.';
comment on column public.generations.input_videos is 'Ordered video references staged in storage or remote URLs.';
comment on column public.generations.input_audios is 'Ordered audio references staged in storage or remote URLs.';
comment on column public.generations.output_video_url is 'Final generated video URL once the async job succeeds.';
