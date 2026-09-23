import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const admin = getSupabaseAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Database not configured." }, { status: 500 });
    }

    const email =
      session.customer_details?.email ||
      session.customer_email ||
      "unknown@pbfer.com";
    const quantity = Number(session.metadata?.quantity || 1);
    const productId = session.metadata?.product_id || null;

    const { error } = await admin.from("orders").upsert(
      {
        stripe_checkout_session_id: session.id,
        email,
        product_id: productId || null,
        quantity,
        amount_total_cents: session.amount_total ?? 0,
        status: "paid",
        shipping_address:
          session.collected_information?.shipping_details?.address ?? null,
      },
      { onConflict: "stripe_checkout_session_id" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
