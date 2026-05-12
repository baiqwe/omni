create or replace function public.create_gemini-omni_generation_with_credits(
    p_user_id uuid,
    p_prompt text,
    p_model_id text,
    p_generation_type text,
    p_credits_cost integer,
    p_input_images jsonb default '[]'::jsonb,
    p_input_videos jsonb default '[]'::jsonb,
    p_input_audios jsonb default '[]'::jsonb,
    p_resolution text default null,
    p_duration_seconds integer default null,
    p_aspect_ratio text default null,
    p_provider_job_id text default null,
    p_status text default 'pending',
    p_status_detail text default null,
    p_metadata jsonb default '{}'::jsonb
)
returns table (
    id uuid,
    created_at timestamptz,
    provider_job_id text,
    credits_cost integer
)
language plpgsql
security definer
as $$
declare
    v_project_id uuid;
    v_customer_id uuid;
    v_current_credits integer;
    v_generation_id uuid;
    v_generation_created_at timestamptz;
begin
    v_project_id := public.get_current_project_id();

    if v_project_id is null then
        raise exception 'PROJECT_CONTEXT_MISSING';
    end if;

    select c.id, c.credits
      into v_customer_id, v_current_credits
      from public.customers c
     where c.user_id = p_user_id
       and c.project_id = v_project_id
     for update;

    if v_customer_id is null then
        raise exception 'CUSTOMER_NOT_FOUND';
    end if;

    if p_credits_cost < 0 then
        raise exception 'INVALID_CREDIT_AMOUNT';
    end if;

    if v_current_credits < p_credits_cost then
        raise exception 'INSUFFICIENT_CREDITS';
    end if;

    update public.customers
       set credits = credits - p_credits_cost,
           updated_at = now()
     where id = v_customer_id
       and project_id = v_project_id;

    insert into public.credits_history (
        project_id,
        customer_id,
        amount,
        type,
        description,
        created_at,
        metadata
    ) values (
        v_project_id,
        v_customer_id,
        p_credits_cost,
        'subtract',
        format('Omni generation (%s, %s, %ss)', p_generation_type, coalesce(p_resolution, 'unknown'), coalesce(p_duration_seconds, 0)),
        now(),
        jsonb_build_object('action', 'ai_generation', 'mode', p_generation_type)
    );

    insert into public.generations (
        project_id,
        user_id,
        prompt,
        model_id,
        status,
        credits_cost,
        metadata,
        generation_type,
        input_images,
        input_videos,
        input_audios,
        resolution,
        duration_seconds,
        aspect_ratio,
        provider_job_id,
        status_detail
    ) values (
        v_project_id,
        p_user_id,
        p_prompt,
        p_model_id,
        p_status,
        p_credits_cost,
        coalesce(p_metadata, '{}'::jsonb),
        p_generation_type,
        coalesce(p_input_images, '[]'::jsonb),
        coalesce(p_input_videos, '[]'::jsonb),
        coalesce(p_input_audios, '[]'::jsonb),
        p_resolution,
        p_duration_seconds,
        p_aspect_ratio,
        p_provider_job_id,
        p_status_detail
    )
    returning generations.id, generations.created_at, generations.provider_job_id, generations.credits_cost
      into v_generation_id, v_generation_created_at, provider_job_id, credits_cost;

    id := v_generation_id;
    created_at := v_generation_created_at;

    return next;
end;
$$;

alter function public.create_gemini-omni_generation_with_credits(
    uuid,
    text,
    text,
    text,
    integer,
    jsonb,
    jsonb,
    jsonb,
    text,
    integer,
    text,
    text,
    text,
    text,
    jsonb
) set search_path = public;

grant execute on function public.create_gemini-omni_generation_with_credits(
    uuid,
    text,
    text,
    text,
    integer,
    jsonb,
    jsonb,
    jsonb,
    text,
    integer,
    text,
    text,
    text,
    text,
    jsonb
) to authenticated;
