# PBFER — The Rack

One-product site for a machined pool rack. Next.js App Router, a lightweight React Three Fiber hero with a CSS/SVG fallback, Stripe Checkout, and a Supabase waitlist.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind
- React Three Fiber + drei (lazy-loaded, `ssr: false`)
- Framer Motion for page motion only
- Supabase (Postgres + RLS)
- Stripe Checkout + webhooks
- Vercel (`@vercel/og` / `next/og` spec cards)

## Local setup

```bash
cd D:\Coding\pbfer-pool-rack
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs without keys: waitlist uses an in-memory demo store, checkout returns a clear "Stripe isn't wired" message. Wire the env vars below for production behavior.

## Environment variables

Copy `.env.example` → `.env.local`.

| Variable | Where it lives | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Vercel + local | `http://localhost:3000` locally; your production URL on Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API keys | Publishable / anon key. Safe for the browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API keys | **Server only.** Never prefix with `NEXT_PUBLIC_`. Used by waitlist + Stripe webhook. |
| `STRIPE_SECRET_KEY` | Stripe Developers → API keys | Start with `sk_test_…`. Swap to `sk_live_…` at launch. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | `pk_test_…` then `pk_live_…` |
| `STRIPE_PRICE_ID` | Stripe Product catalog | One-time price for The Rack |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhooks | `whsec_…` from the `checkout.session.completed` endpoint |

### Going live with Stripe

1. Keep test keys in `.env.local` until a real charge is intended.
2. In the Stripe Dashboard, create the same Product/Price in live mode (or run the seed script against live keys).
3. Replace `sk_test_` / `pk_test_` / test `price_` / test `whsec_` with live values in Vercel.
4. Point the webhook at `https://YOUR_DOMAIN/api/webhooks/stripe`.

## Supabase

Schema lives in `supabase/migrations`. Tables: `products`, `orders`, `waitlist`. RLS is on for all three.

- Public role: `SELECT` on `products` only.
- `waitlist` inserts go through `/api/waitlist` (service role + rate limit + email validation).
- `orders` writes go through `/api/webhooks/stripe` only.

### Apply the migration

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Or paste `supabase/migrations/20260923020219_init_schema.sql` into the Supabase SQL editor.

Seed the product row after push (update the Stripe price id):

```sql
insert into products (name, slug, price_cents, stripe_price_id, description, specs, active)
values (
  'The Rack',
  'the-rack',
  18900,
  'price_YOUR_TEST_PRICE',
  'Folding glass-filled nylon pool rack.',
  '{"material":"PAL","fold":"flat","weight":"238g"}'::jsonb,
  true
);
```

## Stripe

Create a one-time Product + Price ($189) in the Dashboard, or:

```bash
node --env-file=.env.local scripts/seed-stripe.mjs
```

Paste the printed `STRIPE_PRICE_ID` into `.env.local`.

Local webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Use the `whsec_…` the CLI prints as `STRIPE_WEBHOOK_SECRET`.

## 3D + performance

- Hero visual is a config switch in `src/lib/hero-visual.ts`: `procedural` (current 3D caret — two rails, open at the bottom) or `spin` (360° photo sequence). Drop frames in `/public/spin` and flip the mode — no section rebuild.
- Hero and exploded views lazy-load with `next/dynamic` (`ssr: false`).
- Canvas `dpr` is capped at `[1, 2]`. Two or three lights. Primitive geometry only.
- `prefers-reduced-motion`, low core/memory devices, save-data, missing WebGL, or a first-second FPS probe under ~28 all fall back to the SVG rack.
- A React error boundary swallows WebGL context failures.
- Mobile: auto-rotate only, no drag (avoids scroll hijack).
- Fallback SVG gets a light perspective tilt on scroll.

Force the fallback in DevTools: CPU 4× slowdown, or `prefers-reduced-motion: reduce` in the Rendering panel.

## Shareable spec cards

`/og` and `/og?stat=fold|nylon|weight|bevel` return a 1200×630 branded card via `next/og`. Default Open Graph / Twitter images point here.

## Hidden shop talk

Click the header mark seven times, or type `rack`. Optional. Never in the way.

## Deploy to Vercel

1. Push the repo and import the project in Vercel.
2. Add every env var from `.env.example` (production values).
3. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
4. Deploy.
5. In Stripe, add the live webhook URL: `https://YOUR_DOMAIN/api/webhooks/stripe` → event `checkout.session.completed`.
6. Confirm a test-mode purchase against the preview URL before flipping to live keys.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
