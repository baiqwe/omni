# Seedance 2.0

This repo is a Next.js 15 + Supabase + Tailwind + next-intl application refactored into a **multi-modal AI video workspace** with:

- A tool-first homepage and localized scenario landing pages
- Signed-upload asset staging for image, video, and audio references
- Async generation jobs, dashboard recovery, and public video share pages
- Cloudflare Workers deployment support via `@opennextjs/cloudflare`

## Getting Started

1. Copy `.env.example` to `.env` and fill required keys.
2. Install and run:

```bash
npm i
npm run dev
```

## Configure

- **Brand & domain:** `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_APP_URL`
- **Landing pages:** `config/landing-pages.ts`

## Deploy To Cloudflare Workers

This repo is configured for Cloudflare Workers using OpenNext.

1. Install dependencies:

```bash
npm install
```

2. Copy `.dev.vars.example` to `.dev.vars` for local Worker preview.

3. Log in to Cloudflare:

```bash
npx wrangler login
```

4. Set production secrets in Cloudflare:

```bash
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put REPLICATE_API_TOKEN
npx wrangler secret put CREEM_API_KEY
npx wrangler secret put CREEM_WEBHOOK_SECRET
```

5. Preview the Worker locally:

```bash
npm run preview
```

6. Deploy:

```bash
npm run deploy
```

## Cloudflare Notes

- Worker config lives in `wrangler.jsonc`
- OpenNext adapter config lives in `open-next.config.ts`
- Static asset caching headers live in `public/_headers`
- If you put video delivery behind Cloudflare CDN, set `VIDEO_CDN_URL`
