create table if not exists public.generations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    prompt text not null,
    model_id text not null,
    image_url text,
    input_image_url text,
    status text not null default 'succeeded',
    credits_cost integer not null default 0,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create index if not exists generations_user_id_idx
    on public.generations(user_id);

create index if not exists generations_created_at_idx
    on public.generations(created_at desc);

create index if not exists generations_status_idx
    on public.generations(status);

alter table public.generations enable row level security;

drop policy if exists "Users can view their own generations" on public.generations;
create policy "Users can view their own generations"
    on public.generations for select
    using (auth.uid() = user_id);

drop policy if exists "Users can insert their own generations" on public.generations;
create policy "Users can insert their own generations"
    on public.generations for insert
    with check (auth.uid() = user_id);

drop policy if exists "Service role can manage generations" on public.generations;
create policy "Service role can manage generations"
    on public.generations for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');

grant all on public.generations to authenticated;
grant all on public.generations to service_role;
