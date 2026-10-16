"use client";

import { FormEvent, useState } from "react";
import { BRAND } from "@/lib/brand";
import { Faq } from "./Faq";
import { RackSvg } from "@/components/rack/RackSvg";

export function BuySection() {
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout is not ready yet.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <section id="buy" className="border-t border-ink-line">
      <div className="mx-auto grid max-w-site gap-16 px-5 py-24 md:grid-cols-2 md:px-8 lg:py-32">
        <div className="relative min-h-[320px] bg-ink-raised hairline">
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <RackSvg className="h-full w-full max-h-[380px]" />
          </div>
          <p className="absolute bottom-4 left-4 font-display text-[0.65rem] uppercase tracking-[0.18em] text-paper-mute">
            The Rack · {BRAND.priceLabel}
          </p>
        </div>

        <div>
          <p className="kicker">Buy</p>
          <h2 className="display mt-4 text-5xl sm:text-6xl">The Rack</h2>
          <p className="mt-4 text-2xl text-ember">{BRAND.priceLabel}</p>
          <p className="mt-4 max-w-md text-paper-mute">
            Two rails and a pin. Ships folded flat in a sleeve, not a box
            the size of a pizza. Snap it open against the cushion.
            That&apos;s it.
          </p>

          <form onSubmit={checkout} className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <label className="flex items-center gap-3 border border-ink-line px-3 py-2">
              <span className="kicker !text-[0.6rem]">Qty</span>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="bg-transparent font-display text-lg outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n} className="bg-ink">
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="ember-btn w-full sm:w-auto" disabled={busy}>
              {busy ? "Opening Stripe…" : "Buy Now"}
            </button>
          </form>
          {error ? (
            <p className="mt-4 text-sm text-ember">{error}</p>
          ) : (
            <p className="mt-4 text-sm text-paper-mute">
              Hosted Stripe Checkout. No card form on this page.
            </p>
          )}

          <div className="mt-12">
            <p className="kicker mb-2">FAQ</p>
            <Faq />
          </div>
        </div>
      </div>
    </section>
  );
}
