import { NextResponse } from "next/server";
import { getStripe, getStripePriceId } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const stripe = getStripe();
  const priceId = getStripePriceId();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";

  const body = (await request.json().catch(() => ({}))) as {
    quantity?: number;
  };
  const quantity = Math.min(4, Math.max(1, Number(body.quantity) || 1));

  if (!stripe || !priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe isn't wired yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to .env.local.",
      },
      { status: 503 },
    );
  }

  let productId: string | undefined;
  const admin = getSupabaseAdmin();
  if (admin) {
    const { data } = await admin
      .from("products")
      .select("id")
      .eq("slug", "the-rack")
      .eq("active", true)
      .maybeSingle();
    productId = data?.id;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity }],
    success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/order/cancelled`,
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
    metadata: {
      product_slug: "the-rack",
      product_id: productId ?? "",
      quantity: String(quantity),
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe did not return a checkout URL." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
