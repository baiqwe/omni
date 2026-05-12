# Seedance 2.0 Cloudflare Full-Stack Migration Plan

This document describes how to replace the current `Supabase Auth + Postgres + Storage + Realtime`
stack with:

- `Auth.js + D1` for authentication and sessions
- `D1` for business data
- `R2` for media storage
- `KV` for rate limits, job locks, and idempotency
- `Workers + OpenNext` for all API and page runtime behavior

The goal is to preserve every user-facing feature that already exists on `seedance2video.cc`
while removing dependence on Supabase service quotas.

---

## 1. Current Feature Inventory

These features already exist in the product and must remain supported after the migration.

### Public product and SEO

- Localized landing pages: `/en`, `/zh`
- Localized use-case pages: `/[locale]/[slug]`
- Guides page
- Pricing page
- About / Contact / Terms / Privacy
- Public video detail pages: `/[locale]/video/[id]`
- Static XML sitemap files and `robots.txt`
- Structured data:
  - `WebSite`
  - `Organization`
  - `SoftwareApplication`
  - `VideoObject`
  - `FAQPage`

### Creation workflow

- Homepage simplified generator
- `/[locale]/creative-center` professional workspace
- Kie provider selection:
  - `Seedance 2`
  - `Seedance 2 Fast`
- Supported generation modes:
  - `text_to_video`
  - `image_to_video`
  - `multi_modal_video`
- Image / video / audio upload staging
- Credits estimation
- Async job creation
- Job polling / status refresh
- Kie webhook support

### User and account

- Sign up
- Sign in
- Google OAuth sign in
- Sign out
- Forgot password / reset password
- Protected dashboard
- Credits balance
- Subscription status
- Processing generations card

### Billing

- Creem checkout
- Creem customer portal
- Creem webhook handling
- Credits top-up
- Subscription sync

---

## 2. Target Cloudflare Architecture

### Runtime

- Cloudflare Workers via OpenNext
- `nodejs_compat` remains enabled

### Auth

- `Auth.js`
- `@auth/d1-adapter`
- Providers:
  - `GoogleProvider`
  - `CredentialsProvider`

### Data

- `D1`
  - auth tables
  - customers
  - subscriptions
  - credits history
  - generations
  - generation assets
  - webhook events

### File storage

- `R2`
  - staged input uploads
  - generated outputs
  - thumbnails
  - public gallery assets

### High-frequency operational state

- `KV`
  - rate limits
  - active generation locks
  - webhook idempotency keys
  - temporary password reset tokens if needed

---

## 3. What Moves Where

| Concern | New system | Notes |
| --- | --- | --- |
| Google sign-in | Auth.js + Google Provider + D1 | Replaces Supabase OAuth |
| Email/password sign-in | Auth.js CredentialsProvider + D1 | Requires password hash storage |
| Session cookies | Auth.js | Replaces Supabase session cookies |
| Forgot password | Auth.js custom flow + mail provider | Needs email provider |
| User identity in middleware | Auth.js session lookup | Replaces Supabase SSR auth |
| Customer credits | D1 | Stored in `customers` |
| Credits history | D1 | Stored in `credits_history` |
| Generations | D1 | Stored in `generations` |
| Generation asset metadata | D1 | Stored in `generation_assets` |
| File uploads | R2 signed upload URLs | Replaces Supabase Storage |
| Polling state | D1 + API | Replaces Supabase Realtime |
| Rate limiting | KV | Replaces in-memory Map |
| Creem mapping | D1 | Replaces Supabase `customers` / `subscriptions` |
| Public gallery metadata | D1 or config | Phase 1 can stay config-driven |

---

## 4. Required Cloudflare Resources

You need to create these resources in Cloudflare before the final cutover:

1. `D1` database
2. `R2` bucket
3. `KV` namespace

Recommended names:

- D1:
  - `seedance2-prod`
- R2:
  - `seedance2-media`
- KV:
  - `seedance2-rate-limit`

---

## 5. Required External Services

### Google OAuth

You need a Google OAuth client with this callback:

- `https://seedance2video.cc/api/auth/callback/google`

### Email provider

To preserve sign-up / password reset flows, you need one of:

- Resend
- Postmark
- SendGrid

### Existing providers to keep

- Kie
- Creem

---

## 6. Environment Variables

### Auth.js

- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_TRUST_HOST=true`

### Site

- `NEXT_PUBLIC_APP_URL=https://seedance2video.cc`
- `NEXT_PUBLIC_SITE_URL=https://seedance2video.cc`
- `NEXT_PUBLIC_SITE_NAME=Seedance 2.0`
- `NEXT_PUBLIC_SUPPORT_EMAIL=hello@seedance2video.cc`

### Kie

- `KIE_API_KEY`
- `KIE_API_URL=https://api.kie.ai/api/v1`
- `KIE_CALLBACK_SECRET`

### Creem

- `CREEM_API_KEY`
- `CREEM_WEBHOOK_SECRET`

### Optional analytics / trust

- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- `NEXT_PUBLIC_LINKEDIN_URL`
- `NEXT_PUBLIC_REDDIT_URL`
- `VIDEO_CDN_URL`

### Email

- `RESEND_API_KEY` or equivalent provider credentials

---

## 7. D1 Schema Plan

### Auth tables

These come from the Auth.js D1 adapter or a compatible schema:

- `users`
- `accounts`
- `sessions`
- `verification_tokens`

### Business tables

#### `customers`

- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL UNIQUE`
- `email TEXT`
- `name TEXT`
- `credits INTEGER NOT NULL DEFAULT 0`
- `plan_type TEXT`
- `subscription_status TEXT`
- `creem_customer_id TEXT`
- `country TEXT`
- `metadata_json TEXT`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`

#### `credits_history`

- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `amount INTEGER NOT NULL`
- `type TEXT NOT NULL`
- `description TEXT`
- `creem_order_id TEXT`
- `metadata_json TEXT`
- `created_at TEXT NOT NULL`

#### `subscriptions`

- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `creem_subscription_id TEXT NOT NULL UNIQUE`
- `creem_product_id TEXT`
- `status TEXT NOT NULL`
- `current_period_start TEXT`
- `current_period_end TEXT`
- `canceled_at TEXT`
- `metadata_json TEXT`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`

#### `generations`

- `id TEXT PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `prompt TEXT NOT NULL`
- `model_id TEXT NOT NULL`
- `generation_type TEXT NOT NULL`
- `status TEXT NOT NULL`
- `status_detail TEXT`
- `credits_cost INTEGER NOT NULL`
- `resolution TEXT`
- `duration_seconds INTEGER`
- `aspect_ratio TEXT`
- `provider TEXT`
- `provider_job_id TEXT`
- `output_video_url TEXT`
- `thumbnail_url TEXT`
- `metadata_json TEXT`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`

#### `generation_assets`

- `id TEXT PRIMARY KEY`
- `generation_id TEXT NOT NULL`
- `asset_kind TEXT NOT NULL`
- `asset_role TEXT`
- `object_key TEXT NOT NULL`
- `public_url TEXT`
- `sort_order INTEGER NOT NULL DEFAULT 0`
- `created_at TEXT NOT NULL`

#### `webhook_events`

- `id TEXT PRIMARY KEY`
- `provider TEXT NOT NULL`
- `external_event_id TEXT`
- `payload_json TEXT NOT NULL`
- `processed_at TEXT`
- `created_at TEXT NOT NULL`

---

## 8. File-by-File Migration Map

### Authentication

Replace:

- `app/actions.ts`
- `app/auth/google/route.ts`
- `app/auth/callback/route.ts`
- `hooks/use-user.ts`
- `middleware.ts`
- `utils/supabase/server.ts`
- `utils/supabase/client.ts`

Add:

- `auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `utils/auth/session.ts`
- `utils/auth/password.ts`
- `utils/auth/reset-password.ts`

### Data layer

Replace:

- `utils/supabase/provision.ts`
- `utils/supabase/subscriptions.ts`
- `utils/public-generation.ts`

Add:

- `utils/cloudflare/context.ts`
- `utils/backend/runtime.ts`
- `utils/d1/db.ts`
- `utils/d1/customers.ts`
- `utils/d1/credits.ts`
- `utils/d1/generations.ts`
- `utils/d1/subscriptions.ts`
- `utils/d1/public-gallery.ts`

### Uploads

Replace:

- `app/api/uploads/prepare/route.ts`

Add:

- `utils/r2/server.ts`
- `utils/r2/presign.ts`

### Rate limit / locks

Replace:

- `utils/rate-limit.ts`

Add:

- `utils/kv/rate-limit.ts`
- `utils/kv/job-lock.ts`
- `utils/kv/idempotency.ts`

### Generation routes

Replace:

- `app/api/ai/generate/route.ts`
- `app/api/ai/generate/[id]/route.ts`
- `app/api/webhooks/kie/route.ts`
- `app/api/credits/route.ts`

### Billing routes

Replace:

- `app/api/creem/checkout/route.ts`
- `app/api/creem/customer-portal/route.ts`
- `app/api/webhooks/creem/route.ts`

### Dashboard and polling

Replace:

- `app/(main)/[locale]/dashboard/page.tsx`
- `hooks/use-processing-generations.ts`

---

## 9. Migration Phases

### Phase 1 — Foundation

Goal:
- Add Cloudflare bindings, D1 schema, R2/KV helpers, backend selection helpers

Deliverables:
- `wrangler.jsonc` bindings
- `cloudflare-env.d.ts` updated
- D1 SQL files
- helper modules

Validation:
- build still passes
- no runtime behavior changed yet

### Phase 2 — Auth

Goal:
- Replace Supabase Auth with Auth.js + D1

Deliverables:
- Google login
- sign in / sign up
- session cookies
- middleware protection

Validation:
- user can sign in
- protected dashboard redirects when logged out
- `next` redirect works after sign in

### Phase 3 — Uploads

Goal:
- Replace Supabase signed upload with R2 signed upload

Validation:
- image/video/audio upload works
- uploaded object is visible in R2
- workspace stores returned URL correctly

### Phase 4 — Generations and credits

Goal:
- Replace generation and credits APIs with D1 + KV

Validation:
- create generation returns `202`
- credits decrement correctly
- insufficient credits returns `402`
- generation row appears in dashboard

### Phase 5 — Kie status updates

Goal:
- Replace job polling and webhook persistence with D1 updates

Validation:
- webhook updates D1 row
- polling endpoint returns updated status
- output URL appears on success

### Phase 6 — Billing

Goal:
- Replace customer/subscription storage with D1

Validation:
- checkout still opens
- webhook updates subscription status
- credits top-up still works

### Phase 7 — Cleanup

Goal:
- Remove unused Supabase code, env vars, and migrations

Validation:
- no runtime references to Supabase remain

---

## 10. Feature-by-Feature Verification Checklist

### Public product experience

- [ ] `/en` returns `200`
- [ ] `/zh` returns `200`
- [ ] `/en/creative-center` returns `200`
- [ ] `/en/guides` returns `200`
- [ ] key use-case pages return `200`
- [ ] `robots.txt` returns `200`
- [ ] `sitemap.xml` returns `200`

### Authentication

- [ ] sign-up works
- [ ] sign-in works
- [ ] Google sign-in works
- [ ] sign-out works
- [ ] forgot-password email is sent
- [ ] password reset works
- [ ] protected dashboard blocks anonymous users

### Generation workflow

- [ ] image upload works
- [ ] video upload works
- [ ] audio upload works
- [ ] homepage -> creative-center query sync works
- [ ] create generation works
- [ ] Kie task id is stored
- [ ] polling updates status
- [ ] output video URL is persisted
- [ ] public video detail page still renders

### Billing / credits

- [ ] credits estimate endpoint works
- [ ] checkout API works
- [ ] customer portal works
- [ ] Creem webhook updates D1
- [ ] credits history remains correct

---

## 11. What You Need To Do

### Before coding is complete

You need to prepare:

1. Cloudflare resources
   - create D1 database
   - create R2 bucket
   - create KV namespace

2. Google OAuth client
   - create callback URL

3. Email provider
   - choose Resend / Postmark / SendGrid

4. Cloudflare secrets
   - Auth.js
   - Kie
   - Creem
   - email provider

### Before cutover

1. Apply D1 schema
2. Deploy Worker with new bindings
3. Test auth and uploads in preview
4. Test generation path end-to-end
5. Test Creem webhook on staging
6. Cut production traffic

---

## 12. Recommended Execution Order For This Repo

1. Foundation:
   - bindings
   - D1 schema
   - helper modules
2. Auth.js
3. R2 uploads
4. D1 generations + credits
5. Kie webhook / polling
6. D1 subscriptions / billing
7. Supabase removal

This order minimizes breakage and preserves feature continuity while the system is being replaced.
