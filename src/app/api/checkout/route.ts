import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { getSquareConfig, squareFetch } from "@/lib/square";

type PaymentLinkResponse = {
  payment_link?: { url?: string; id?: string; order_id?: string };
};

export async function POST(request: Request) {
  const square = getSquareConfig();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000";

  const body = (await request.json().catch(() => ({}))) as {
    quantity?: number;
  };
  const quantity = Math.min(4, Math.max(1, Number(body.quantity) || 1));

  if (!square.ready) {
    return NextResponse.json(
      {
        error:
          "Square isn't wired yet. Add SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID.",
      },
      { status: 503 },
    );
  }

  try {
    const created = await squareFetch<PaymentLinkResponse>(
      "/v2/online-checkout/payment-links",
      {
        method: "POST",
        body: JSON.stringify({
          idempotency_key: randomUUID(),
          description: `${BRAND.product} × ${quantity}`,
          order: {
            location_id: square.locationId,
            line_items: [
              {
                name: BRAND.product,
                quantity: String(quantity),
                base_price_money: {
                  amount: BRAND.priceCents,
                  currency: "USD",
                },
              },
            ],
          },
          checkout_options: {
            redirect_url: `${origin}/order/success`,
            ask_for_shipping_address: true,
            allow_tipping: false,
          },
        }),
      },
    );

    const url = created.payment_link?.url;
    if (!url) {
      return NextResponse.json(
        { error: "Square did not return a checkout URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Square checkout failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
