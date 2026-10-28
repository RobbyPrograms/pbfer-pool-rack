# PBFER — The Rack

One-product site for a machined pool rack. Next.js, a 3D hero, Square checkout, and a Supabase waitlist.

Buy Now sends the shopper to Square’s own checkout page. Card numbers never touch this site.

## What to store in Vercel

Vercel keeps secrets for the live site. You paste them once. The site reads them when it runs. You do not put them in the code, and you do not commit them.

1. Open [vercel.com](https://vercel.com) and open this project.
2. Go to **Settings → Environment Variables**.
3. For each row below, click **Add**, paste the name, paste the value, and check **Production**. Check **Preview** too if you want checkout on preview links.
4. Save, then **Deployments → ⋯ on the latest deploy → Redeploy**. A new variable does nothing until the next deploy.

| Name | What to paste | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your live address, like `https://your-domain.com`. No slash at the end. | No. This one is public. |
| `SQUARE_ENV` | `sandbox` while you are testing. `production` when you want real cards. | No |
| `SQUARE_ACCESS_TOKEN` | From Square. Starts with a long random string. Sandbox token while testing, production token when you go live. | Yes. Never start the name with `NEXT_PUBLIC_`. |
| `SQUARE_LOCATION_ID` | From the same Square page. Looks like `L…` | Yes |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | From the Square webhook you create below. Skip this until you want orders saved in Supabase. | Yes |
| `SQUARE_WEBHOOK_URL` | Exactly `https://your-domain.com/api/webhooks/square` | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API. Looks like `https://something.supabase.co` | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page. The anon / publishable key. | Safe in the browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page. The service role key. | Yes. Never start the name with `NEXT_PUBLIC_`. |

Same names go in `.env.local` on your computer if you want checkout while running `npm run dev`. Copy `.env.example` to `.env.local` and fill the blanks. `.env.local` stays on your machine.

The amount Square charges is `priceCents` in `src/lib/brand.ts`. Right now that is `18900`, which is **$189.00**. The price written on the page is `priceLabel` (`$59.99`). Change both to the same number before you take a real payment.

## Where to get the Square values

1. Go to [developer.squareup.com/apps](https://developer.squareup.com/apps) and sign in.
2. Open your app, or click **+** and create one.
3. Open the **Sandbox** tab while testing.
4. Copy **Sandbox Access Token** into `SQUARE_ACCESS_TOKEN`.
5. Open **Locations** (still in Sandbox) and copy the location id into `SQUARE_LOCATION_ID`.
6. Leave `SQUARE_ENV` as `sandbox`.
7. Use a [Square sandbox test card](https://developer.squareup.com/docs/devtools/sandbox/payments) at checkout. A real card will not work in sandbox.

When you are ready for real money:

1. In the Square app, open the **Production** tab and copy the production access token and the production location id.
2. In Vercel, change `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, and set `SQUARE_ENV` to `production`.
3. Redeploy.

## Saving the order after they pay

Checkout works without this. This step writes the paid order into Supabase.

1. In the Square app, open **Webhooks → Add subscription**.
2. Notification URL: `https://your-domain.com/api/webhooks/square`
   It must match `SQUARE_WEBHOOK_URL` character for character.
3. Subscribe to **payment.updated**.
4. Copy the signature key into `SQUARE_WEBHOOK_SIGNATURE_KEY` in Vercel.
5. Redeploy.

Square’s order id is saved in the `orders` table, in the column named `stripe_checkout_session_id`. That column is just the receipt id. You do not need a Stripe account.

## Local setup

```bash
cd D:\Coding\pbfer-pool-rack
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Square keys, Buy Now says Square isn’t wired yet. The rest of the site still loads.

## Supabase

Schema lives in `supabase/migrations`. Tables: `products`, `orders`, `waitlist`.

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Or paste `supabase/migrations/20260923020219_init_schema.sql` into the Supabase SQL editor.

## Deploy

1. Push the repo and import it in Vercel.
2. Add the variables in the table above.
3. Redeploy.
4. Buy one rack in sandbox and confirm Square sends you back to `/order/success`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
