# Cloudflare Auth.js + D1 + R2 + KV Cutover Checklist

Use this checklist while implementing and validating the migration away from Supabase.

## A. Cloudflare resource setup

- [ ] Create D1 database
- [ ] Create R2 bucket
- [ ] Create KV namespace
- [ ] Add bindings to `wrangler.jsonc`
- [ ] Regenerate or update `cloudflare-env.d.ts`

## B. Auth setup

- [ ] Create Google OAuth application
- [ ] Add production callback URL
- [ ] Add preview callback URL if needed
- [ ] Configure `AUTH_SECRET`
- [ ] Configure `AUTH_GOOGLE_ID`
- [ ] Configure `AUTH_GOOGLE_SECRET`
- [ ] Configure email provider secrets

## C. D1 schema setup

- [ ] Apply auth schema
- [ ] Apply business schema
- [ ] Apply indexes
- [ ] Verify tables exist

## D. Upload pipeline setup

- [ ] Create R2 bucket policy if needed
- [ ] Verify signed upload URL generation
- [ ] Verify browser can upload image
- [ ] Verify browser can upload video
- [ ] Verify browser can upload audio

## E. Generation flow validation

- [ ] Logged-in user can open creative center
- [ ] Prompt-only generation can be submitted
- [ ] Image-to-video generation can be submitted
- [ ] Multi-reference generation can be submitted
- [ ] Credits decrement correctly
- [ ] Failed generation does not lose credits
- [ ] Kie webhook updates status
- [ ] Polling endpoint reflects updated status

## F. Billing validation

- [ ] Checkout session opens
- [ ] Creem webhook validates successfully
- [ ] Customer record is created or updated
- [ ] Subscription record is created or updated
- [ ] Credits purchase updates balance
- [ ] Customer portal URL loads

## G. Public and SEO validation

- [ ] Homepage returns 200
- [ ] Creative center returns 200
- [ ] Public video page returns 200
- [ ] `robots.txt` returns 200
- [ ] `sitemap.xml` returns 200
- [ ] `video-sitemap.xml` returns 200

## H. Post-cutover cleanup

- [ ] Remove Supabase env vars from production
- [ ] Remove Supabase runtime code paths
- [ ] Remove dead migrations and scripts once stable
- [ ] Update deployment documentation
