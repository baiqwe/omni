# Seedance 2 Transformation Roadmap

## P0: Brand + Product Shell

- Replace anime-specific branding, metadata, and homepage copy with Seedance 2 positioning.
- Force dark mode and remove theme switching from the public shell.
- Replace the single-image editor hero with a multi-modal workspace shell.
- Reframe the homepage sections around showcases, key features, use cases, workflow, pricing, testimonials, and FAQ.

## P1: Data Model + Async Generation Flow

- Expand `generations` to support:
  - `generation_type`
  - `input_images`
  - `input_videos`
  - `input_audios`
  - `resolution`
  - `duration_seconds`
  - `aspect_ratio`
  - `output_video_url`
  - `provider_job_id`
  - `status_detail`
- Split generation API into:
  - `POST /api/ai/generate` creates a job
  - `GET /api/ai/generate/:id` polls job status
- Move from sync image waiting to async video job orchestration.
- Stage all uploaded assets in storage before provider handoff.

## P2: Pricing + Credits Logic

- Replace fixed `1 credit = 1 generation` assumptions.
- Introduce dynamic credit estimation by:
  - resolution
  - duration
  - mode
  - optional audio or extension workflow
- Keep buy-out packs and subscriptions in the same pricing surface.

## P3: Gallery + Reusable Prompt Loops

- Upgrade placeholder showcase cards into hover-play videos.
- Support “Try this prompt” backfill into the workspace.
- Add curated templates for:
  - dance motion transfer
  - product ads
  - film previs
  - social short-form

## P4: SEO + Programmatic Landing Pages

- Keep manual canonical and hreflang control.
- Use `permanentRedirect` at the root route.
- Build pSEO landers for focused video workflows:
  - image to video
  - reference video generation
  - ai dance motion transfer
  - product ad generator
  - storyboard to video

## Immediate Next Build Slice

1. Add Supabase migration for multi-modal generation columns.
2. Refactor the generation API into async job creation + polling.
3. Add upload staging for image/video/audio assets.
4. Connect one provider integration behind a typed adapter.
