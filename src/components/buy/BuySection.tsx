"use client";

import { useState } from "react";
import { CustomCheckout, type CustomPlan } from "@/components/Shop/CustomCheckout";
import styles from "./BuySection.module.css";
import { CUSTOM_FONTS, CUSTOM_PRICE_CENTS } from "@/lib/customization";
import { BRAND } from "@/lib/brand";
import { SHOP_COLORS } from "@/lib/shop-colors";
import { ShopMedia } from "@/components/Shop/ShopMedia";

export function BuySection() {
  const [qty, setQty] = useState(1);
  const [custom, setCustom] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [design, setDesign] = useState<CustomPlan | null>(null);
  const price = custom ? CUSTOM_PRICE_CENTS : BRAND.priceCents;
  function chooseVariant(isCustom: boolean) {
    setCustom(isCustom);
    setError(null);
  }
  const [colorIndex, setColorIndex] = useState(0);
  const color = SHOP_COLORS[colorIndex];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    if (custom) {
      setError(null);
      setCustomOpen(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: qty, color: color.name }),
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
    <section id="shop" className="border-t border-ink-line">
      <div className="mx-auto grid max-w-site gap-16 px-5 py-24 md:grid-cols-2 md:px-8 lg:py-32">
        <ShopMedia key={color.name} color={color} />

        <div>
          <div id="shop-customize" className={styles.switch} data-custom={custom} role="group" aria-label="TrueRack option">
            <span className={styles.slider} aria-hidden="true" />
            <button type="button" className={styles.option} aria-pressed={!custom} onClick={() => chooseVariant(false)}>TrueRack</button>
            <button type="button" className={styles.option} aria-pressed={custom} onClick={() => chooseVariant(true)}>TrueRack Custom</button>
          </div>
          <h2 className="display mt-4 text-5xl sm:text-6xl">True<span className="text-ember">Rack</span></h2>
          <p className="mt-4 text-2xl text-ember" aria-live="polite">${(price / 100).toFixed(2)}</p>
          <p className={styles.priceNote}>{custom ? "Custom name or logo" : "Standard / Unbranded"} - per rack</p>
          <p className="mt-4 max-w-md text-paper-mute">
            A tight rack. A clean lift. More time playing. TrueRack makes racking simple with a preset opening angle and a design that pushes away easily. Lightweight and foldable, it fits in your bag for wherever you play. Compatible with 8-ball, 9-ball, and 10-ball.
          </p>

          <fieldset className="mt-7">
            <legend className="font-semibold text-ember">Available Colors</legend>
            <p className="mt-1 text-sm text-paper-mute">From modern and sleek to bold and sporty,<br />choose the colors that reflect your venue&apos;s style.</p>
            <div className="mt-3 grid max-w-sm grid-cols-4 gap-3">
              {SHOP_COLORS.map((item, index) => <button key={item.name} type="button" onClick={() => setColorIndex(index)} aria-pressed={colorIndex === index} aria-label={item.name} className="group min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper">
                <span className={`block h-6 rounded border border-paper/20 ${colorIndex === index ? "ring-2 ring-ember ring-offset-2 ring-offset-ink" : "group-hover:ring-1 group-hover:ring-paper"}`} style={{ backgroundColor: item.hex }} />
                <span className="mt-1.5 block text-xs text-paper-mute">{item.name}</span>
              </button>)}
            </div>
            <p className="mt-3 text-sm" aria-live="polite">{color.name}{color.placeholder ? " - placeholder photos; color photos coming soon." : ""}</p>
          </fieldset>

          <div className="mt-8 flex flex-col items-start gap-4">
            <label className="flex items-center gap-3 border border-ink-line px-3 py-2">
              <span className="kicker !text-[0.6rem]">Qty</span>
              <select
                value={qty}
                onChange={(e) => {
                  setQty(Number(e.target.value));
                  setError(null);
                }}
                className="bg-transparent font-display text-lg outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n} className="bg-ink">
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" onClick={() => checkout()} className={styles.checkout} disabled={busy}>{busy ? "Opening Checkout..." : "Checkout"}</button>
          </div>
          {custom && design && <div className={styles.design}>
            <p className="text-sm text-paper-mute">Your customization</p>
            <p className="mt-1 text-sm">{design.mode === "same" ? "Same design on all " + qty + (qty === 1 ? " rack" : " racks") : "Individual designs"}</p>
            {(design.mode === "same" ? [design.designs[0]] : design.designs.slice(0, qty)).map((item, index) => <p key={index} className="mt-2">
              {design.mode === "individual" ? "Rack " + (index + 1) + ": " : ""}{item.kind === "name" ? item.name + " / " + CUSTOM_FONTS.find((font) => font.id === item.font)?.label : "Logo: " + item.file.name}
            </p>)}
            {design.mode === "individual" && design.designs.length !== qty && <p className="mt-2 text-sm text-ember">Update your designs for the new quantity.</p>}
            <button type="button" onClick={() => setCustomOpen(true)}>Edit customization</button>
          </div>}
          {error && <p className="mt-4 text-sm text-paper-mute" role="status">{error}</p>}
          <CustomCheckout color={color.name} quantity={qty} open={customOpen} onClose={() => setCustomOpen(false)} onSave={setDesign} />

        </div>
      </div>
    </section>
  );
}
