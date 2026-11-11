import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { SHOP_COLORS } from "@/lib/shop-colors";
import { CUSTOM_PRICE_CENTS, MAX_LOGO_BYTES, logoFormat, validateName } from "@/lib/customization";
import { getSquareConfig, squareFetch } from "@/lib/square";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
type PaymentLinkResponse = { payment_link?: { url?: string; id?: string; order_id?: string } };

export async function POST(request: Request) {
  if (!rateLimit("checkout:" + clientKey(request), 8, 60_000)) return NextResponse.json({ error: "Please wait a minute before trying again." }, { status: 429 });
  if (Number(request.headers.get("content-length")) > MAX_LOGO_BYTES + 65536) return NextResponse.json({ error: "Logo files must be 3 MB or smaller." }, { status: 413 });
  let body: Record<string, unknown>;
  let file: File | null = null;
  try {
    if (request.headers.get("content-type")?.includes("multipart/form-data")) {
      const form = await request.formData();
      body = Object.fromEntries(form.entries());
      const uploaded = form.get("logo");
      file = uploaded instanceof File ? uploaded : null;
    } else {
      const parsed: unknown = await request.json();
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid request");
      body = parsed as Record<string, unknown>;
    }
  } catch { return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 }); }

  if (body.variant !== undefined && body.variant !== "standard" && body.variant !== "custom") return NextResponse.json({ error: "Choose a valid product option." }, { status: 400 });
  const custom = body.variant === "custom";
  const quantity = Number(body.quantity ?? 1);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 4) return NextResponse.json({ error: "Choose a quantity between 1 and 4." }, { status: 400 });
  const color = SHOP_COLORS.find((item) => item.name === (body.color ?? "Black"))?.name;
  if (!color) return NextResponse.json({ error: "Choose a valid color." }, { status: 400 });

  let note = "Standard / Unbranded";
  let upload: { bytes: Uint8Array; extension: string; mime: string } | null = null;
  if (custom) {
    try {
      if (body.kind === "name") {
        const selection = validateName(body.name, body.font);
        note = "Name: " + selection.name + "; Font: " + selection.font.label;
      } else if (body.kind === "logo") {
        if (!file || !file.size || file.size > MAX_LOGO_BYTES) throw new Error("Upload a logo file up to 3 MB.");
        const bytes = new Uint8Array(await file.arrayBuffer());
        const format = logoFormat(bytes);
        if (!format) throw new Error("Upload a PNG, JPG, WebP, or PDF logo.");
        upload = { bytes, ...format };
      } else throw new Error("Choose Name or Logo before checking out.");
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid customization." }, { status: 400 });
    }
  }

  const square = getSquareConfig();
  if (!square.ready) return NextResponse.json({ error: "Checkout is not available yet. Please try again later." }, { status: 503 });
  const admin = upload ? getSupabaseAdmin() : null;
  if (upload && !admin) return NextResponse.json({ error: "Logo uploads are not available yet. Please try again later." }, { status: 503 });
  let artworkPath: string | null = null;
  try {
    if (upload && admin) {
      const { data: bucket } = await admin.storage.getBucket("custom-logos");
      if (!bucket) {
        const { error } = await admin.storage.createBucket("custom-logos", { public: false, fileSizeLimit: MAX_LOGO_BYTES, allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "application/pdf"] });
        if (error) throw new Error("Logo uploads are unavailable. Please try again later.");
      } else if (bucket.public) {
        throw new Error("Logo uploads are unavailable. Please try again later.");
      }
      const path = randomUUID() + "." + upload.extension;
      const { error } = await admin.storage.from("custom-logos").upload(path, upload.bytes, { contentType: upload.mime, upsert: false });
      if (error) throw new Error("Your logo could not be saved. Please try again.");
      artworkPath = path;
      note = "Logo artwork: custom-logos/" + path;
    }
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const created = await squareFetch<PaymentLinkResponse>("/v2/online-checkout/payment-links", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: randomUUID(),
        description: "TrueRack " + (custom ? "Custom" : "Standard") + " x " + quantity,
        order: {
          location_id: square.locationId,
          line_items: [{
            name: "TrueRack - " + (custom ? "Custom" : "Standard / Unbranded") + " - " + color,
            note,
            quantity: String(quantity),
            base_price_money: { amount: custom ? CUSTOM_PRICE_CENTS : BRAND.priceCents, currency: "USD" },
            metadata: { color, customization: custom ? String(body.kind) : "none", ...(artworkPath ? { artwork_path: "custom-logos/" + artworkPath } : {}) },
          }],
        },
        checkout_options: { redirect_url: origin + "/order/success", ask_for_shipping_address: true, allow_tipping: false },
      }),
    });
    const url = created.payment_link?.url;
    if (!url) throw new Error("Square did not return a checkout URL.");
    return NextResponse.json({ url });
  } catch (error) {
    if (artworkPath && admin) await admin.storage.from("custom-logos").remove([artworkPath]);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout failed." }, { status: 502 });
  }
}
