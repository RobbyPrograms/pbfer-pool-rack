import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getSquareConfig, squareFetch } from "@/lib/square";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type SquarePayment = {
  id?: string;
  order_id?: string;
  status?: string;
  buyer_email_address?: string;
  amount_money?: { amount?: number };
  shipping_address?: Record<string, unknown> | null;
};

type SquareEvent = {
  type?: string;
  data?: { object?: { payment?: SquarePayment } };
};

type SquareOrder = {
  order?: {
    line_items?: { quantity?: string }[];
  };
};

function signatureMatches(signature: string, body: string, url: string, key: string) {
  const digest = createHmac("sha256", key).update(url + body).digest("base64");
  const left = Buffer.from(digest);
  const right = Buffer.from(signature);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim();
  if (!signatureKey) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("x-square-hmacsha256-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  const notificationUrl =
    process.env.SQUARE_WEBHOOK_URL?.trim() ||
    `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/webhooks/square`;

  if (!signatureMatches(signature, payload, notificationUrl, signatureKey)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(payload) as SquareEvent;
  const payment = event.data?.object?.payment;
  if (event.type !== "payment.updated" || payment?.status !== "COMPLETED") {
    return NextResponse.json({ received: true });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  const orderId = payment.order_id || payment.id;
  if (!orderId) {
    return NextResponse.json({ error: "Payment had no order id." }, { status: 400 });
  }

  let quantity = 1;
  if (payment.order_id && getSquareConfig().ready) {
    try {
      const order = await squareFetch<SquareOrder>(`/v2/orders/${payment.order_id}`);
      const fromLine = Number(order.order?.line_items?.[0]?.quantity);
      if (fromLine > 0) quantity = fromLine;
    } catch {
      quantity = 1;
    }
  }

  const { error } = await admin.from("orders").upsert(
    {
      stripe_checkout_session_id: orderId,
      email: payment.buyer_email_address || "unknown@builttrue.com",
      quantity,
      amount_total_cents: payment.amount_money?.amount ?? 0,
      status: "paid",
      shipping_address: payment.shipping_address ?? null,
    },
    { onConflict: "stripe_checkout_session_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
