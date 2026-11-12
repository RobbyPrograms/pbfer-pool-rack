"use client";

import { useEffect, useState } from "react";
import { CustomCheckout, type CustomPlan } from "@/components/Shop/CustomCheckout";
import styles from "./BuySection.module.css";
import { CUSTOM_FONTS, CUSTOM_PRICE_CENTS, MAX_ORDER_QUANTITY } from "@/lib/customization";
import { BRAND } from "@/lib/brand";
import { SHOP_COLORS } from "@/lib/shop-colors";
import { ShopMedia } from "@/components/Shop/ShopMedia";

export function BuySection() {
  const [qty, setQty] = useState(1);
  const [quantityText, setQuantityText] = useState("1");
  const [custom, setCustom] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [design, setDesign] = useState<CustomPlan | null>(null);
  const price = custom ? CUSTOM_PRICE_CENTS : BRAND.priceCents;
  function chooseVariant(isCustom: boolean) {
    setCustom(isCustom);
    setError(null);
  }
  const [colorIndex, setColorIndex] = useState(0);
  const [colorMode, setColorMode] = useState<"same" | "individual">("same");
  const [rackColors, setRackColors] = useState<(number | null)[]>([null, null, null, null]);
  const [activeRack, setActiveRack] = useState(0);
  const currentRack = Math.min(activeRack, qty - 1);
  const selectedColorIndex = colorMode === "individual" ? rackColors[currentRack] ?? colorIndex : colorIndex;
  const color = SHOP_COLORS[selectedColorIndex];
  const orderColors = Array.from({ length: qty }, (_, index) => SHOP_COLORS[colorMode === "individual" ? rackColors[index] ?? colorIndex : colorIndex].name);
  function selectColor(index: number) {
    if (colorMode === "same") setColorIndex(index);
    else setRackColors((items) => Array.from({ length: Math.max(items.length, qty) }, (_, rack) => rack === currentRack ? index : items[rack] ?? null));
    setError(null);
  }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const selectCustom = () => {
      setCustom(true);
      setError(null);
    };
    const selectFromHash = () => {
      if (window.location.hash === "#shop-customize") selectCustom();
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    window.addEventListener("select-truerack-custom", selectCustom);
    return () => {
      window.removeEventListener("hashchange", selectFromHash);
      window.removeEventListener("select-truerack-custom", selectCustom);
    };
  }, []);

  async function checkout() {
    if (!quantityText || Number(quantityText) !== qty) { setError("Enter a quantity from 1 to " + MAX_ORDER_QUANTITY + "."); return; }
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
        body: JSON.stringify({ quantity: qty, color: orderColors[0], colors: orderColors }),
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
        <div className="min-w-0">
          <ShopMedia key={color.name} color={color} />
          <fieldset className="mt-7">
            <legend className="font-semibold text-ember">Available Colors</legend>
            <p className="mt-1 text-sm text-paper-mute">From modern and sleek to bold and sporty,<br />choose the colors that reflect your venue&apos;s style.</p>
            {qty > 1 && <div className={styles.colorAssignment}>
              <div className={styles.colorModes} role="group" aria-label="Order colors">
                <button type="button" aria-pressed={colorMode === "same"} onClick={() => setColorMode("same")}>Same color for all</button>
                <button type="button" aria-pressed={colorMode === "individual"} onClick={() => setColorMode("individual")}>Choose per rack</button>
              </div>
              {colorMode === "individual" && <div className={styles.rackTabs} role="group" aria-label="Choose a rack to change its color">
                {qty > 8 ? <label className="text-sm">Choose rack<select className="ml-2 border border-ink-line bg-ink p-2" value={currentRack} onChange={(event) => setActiveRack(Number(event.target.value))}>{orderColors.map((name, index) => <option key={index} value={index}>Rack {index + 1} - {name}</option>)}</select></label> : orderColors.map((name, index) => <button key={index} type="button" aria-pressed={currentRack === index} onClick={() => setActiveRack(index)}><span style={{ backgroundColor: SHOP_COLORS.find((item) => item.name === name)?.hex }} />Rack {index + 1}</button>)}
              </div>}
            </div>}
            <div className="mt-3 grid max-w-sm grid-cols-4 gap-3">
              {SHOP_COLORS.map((item, index) => <button key={item.name} type="button" onClick={() => selectColor(index)} aria-pressed={selectedColorIndex === index} aria-label={item.name} className="group min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper">
                <span className={`block h-6 rounded border border-paper/20 ${selectedColorIndex === index ? "ring-2 ring-ember ring-offset-2 ring-offset-ink" : "group-hover:ring-1 group-hover:ring-paper"}`} style={{ backgroundColor: item.hex }} />
                <span className="mt-1.5 block text-xs text-paper-mute">{item.name}</span>
              </button>)}
            </div>
          </fieldset>
        </div>

        <div>
          <div id="shop-customize" className={styles.switch} data-custom={custom} role="group" aria-label="TrueRack option">
            <span className={styles.slider} aria-hidden="true" />
            <button type="button" className={styles.option} aria-pressed={!custom} onClick={() => chooseVariant(false)}>True<span className={!custom ? "text-black" : ""}>Rack</span></button>
            <button type="button" className={styles.option} aria-pressed={custom} onClick={() => chooseVariant(true)}>True<span className={custom ? "text-black" : ""}>Rack</span> Custom</button>
          </div>
          <h2 className="display mt-4 text-5xl sm:text-6xl">True<span className="text-ember">Rack</span></h2>
          <p className="mt-4 text-2xl text-ember" aria-live="polite">${(price / 100).toFixed(2)}</p>
          <p className={styles.priceNote}>{custom ? "Your name or logo on one side. BuiltTrue on the other." : "Standard BuiltTrue Branding"}</p>
          <p className="mt-4 max-w-md text-paper-mute">
            A tight rack. A clean lift. More time playing. TrueRack makes racking simple with a preset opening angle and a design that pushes away easily. Lightweight and foldable, it fits in your bag for wherever you play. Compatible with 8-ball, 9-ball, and 10-ball.
          </p>



          <div className="mt-8 flex flex-col items-start gap-4">
            <div className={styles.quantityGroup}>
              <label htmlFor="shop-quantity" className={styles.quantityLabel}>Quantity</label>
              <div className={styles.quantityControl}>
                <button type="button" aria-label="Decrease quantity" disabled={qty <= 1 || busy} onClick={() => { setQty(qty - 1); setQuantityText(String(qty - 1)); setError(null); }}>−</button>
              <input
                id="shop-quantity"
                type="number" min={1} max={MAX_ORDER_QUANTITY} step={1} aria-label="Quantity"
                value={quantityText}
                onChange={(event) => {
                  const value = event.target.value;
                  setQuantityText(value);
                  const number = Number(value);
                  if (Number.isInteger(number) && number >= 1 && number <= MAX_ORDER_QUANTITY) setQty(number);
                  setError(null);
                }}
                onBlur={() => { if (!quantityText || Number(quantityText) !== qty) setQuantityText(String(qty)); }}
                className={styles.quantityInput}
              />
                <button type="button" aria-label="Increase quantity" disabled={qty >= MAX_ORDER_QUANTITY || busy} onClick={() => { setQty(qty + 1); setQuantityText(String(qty + 1)); setError(null); }}>+</button>
              </div>
            </div>
            <p className="text-sm text-paper" aria-live="polite">Total: ${((price * qty) / 100).toFixed(2)}</p>
            <button type="button" onClick={() => checkout()} className={styles.checkout} disabled={busy} aria-busy={busy}>
              <span>{busy ? "Opening Checkout..." : "Checkout"}</span>
              <span className={styles.checkoutArrow} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </button>
          </div>
          {custom && design && <div className={styles.design}>
            <p className="text-sm text-paper-mute">Your customization</p>
            <p className="mt-1 text-sm">{design.mode === "same" ? "Same design on all " + qty + (qty === 1 ? " rack" : " racks") : "Individual designs"}</p>
            {(design.mode === "same" ? [design.designs[0]] : design.designs.slice(0, qty)).map((item, index) => <p key={index} className="mt-2">
              {design.mode === "individual" ? "Rack " + (index + 1) + " (" + orderColors[index] + "): " : ""}{item.kind === "name" ? item.name + " / " + CUSTOM_FONTS.find((font) => font.id === item.font)?.label : "Logo: " + item.file.name}
            </p>)}
            {design.mode === "individual" && design.designs.length !== qty && <p className="mt-2 text-sm text-ember">Update your designs for the new quantity.</p>}
            <button type="button" onClick={() => setCustomOpen(true)}>Edit customization</button>
          </div>}
          {error && <p className="mt-4 text-sm text-paper-mute" role="status">{error}</p>}
          <CustomCheckout colors={orderColors} quantity={qty} open={customOpen} onClose={() => setCustomOpen(false)} onSave={setDesign} />

        </div>
      </div>
    </section>
  );
}
