"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CUSTOM_FONTS, MAX_LOGO_BYTES } from "@/lib/customization";
import styles from "./CustomCheckout.module.css";

export type CustomDesign = { kind: "name"; name: string; font: string } | { kind: "logo"; file: File };
export type CustomPlan = { mode: "same" | "individual"; designs: CustomDesign[]; colors: string[] };
type Draft = { kind: string; name: string; font: string };
const emptyDraft = (): Draft => ({ kind: "", name: "", font: "" });

export function CustomCheckout({ colors, quantity, open, onClose, onSave }: { colors: string[]; quantity: number; open: boolean; onClose: () => void; onSave: (plan: CustomPlan) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"same" | "individual">("same");
  const [drafts, setDrafts] = useState<Draft[]>(() => Array.from({ length: 4 }, emptyDraft));
  const [sharedLogo, setSharedLogo] = useState<File | null>(null);
  const activeDrafts = Array.from({ length: mode === "same" ? 1 : quantity }, (_, index) => drafts[index] ?? emptyDraft());
  const needsLogo = activeDrafts.some((draft) => draft.kind === "logo");
  const [error, setError] = useState("");
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current?.close();
  }, [open]);

  function update(index: number, changes: Partial<Draft>) {
    setDrafts((items) => Array.from({ length: Math.max(items.length, quantity) }, (_, i) => {
      const item = items[i] ?? emptyDraft();
      return i === index ? { ...item, ...changes } : item;
    }));
    setError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const designs: CustomDesign[] = [];
    for (const [index, draft] of activeDrafts.entries()) {
      const prefix = mode === "individual" ? "Rack " + (index + 1) + ": " : "";
      if (draft.kind === "logo") {
        if (!sharedLogo || !sharedLogo.size || sharedLogo.size > MAX_LOGO_BYTES) { setError("Upload the shared logo for this order (up to 3 MB)."); return; }
        designs.push({ kind: "logo", file: sharedLogo });
      } else if (draft.kind === "name") {
        if (!draft.name.trim() || !CUSTOM_FONTS.some((item) => item.id === draft.font)) { setError(prefix + "Enter a name and select a font."); return; }
        designs.push({ kind: "name", name: draft.name.trim(), font: draft.font });
      } else { setError(prefix + "Choose Name or Logo."); return; }
    }
    onSave({ mode, designs, colors: [...colors] });
    onClose();
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="custom-title" onClose={onClose}>
    <div className={styles.top}><p className="kicker">Make It Yours</p><button type="button" onClick={onClose} aria-label="Close customization form">Close x</button></div>
    <h2 id="custom-title" className="display">Customize True<span className="text-ember">Rack</span></h2>
    <p className={styles.summary}>Quantity {quantity} - $59.99 each</p>
    <div className={styles.orderColors}>{colors.map((color, index) => <span key={index}>Rack {index + 1}: {color}</span>)}</div>
    <form onSubmit={submit}>
      {quantity > 1 && <fieldset className={styles.assignment}>
        <legend>How would you like to customize your racks?</legend>
        <label><input type="radio" name="design-mode" checked={mode === "same"} onChange={() => { setMode("same"); setError(""); }} /> Same design on every rack</label>
        <label><input type="radio" name="design-mode" checked={mode === "individual"} onChange={() => { setMode("individual"); setError(""); }} /> Customize each rack</label>
        <p className={styles.help}>Use the same design on every rack, or choose a different name for each. One shared logo per order can be applied to any racks you select.</p>
      </fieldset>}
      {needsLogo && <fieldset className={styles.rackDesign}>
        <legend>Your order&apos;s logo</legend>
        <div className={styles.fields}>
          <label>{sharedLogo ? "Replace shared logo" : "Upload your logo"}<input type="file" accept=".png,.jpg,.jpeg,.webp,.pdf" required={!sharedLogo} onChange={(event) => { const file = event.target.files?.[0]; if (file) { setSharedLogo(file); setError(""); } }} aria-describedby="shared-logo-help" /></label>
          {sharedLogo && <p className={styles.fileName}>Selected: {sharedLogo.name}</p>}
          <p id="shared-logo-help" className={styles.help}>One logo per order, shared by every rack marked Logo. Replacing this file updates all logo racks. PNG, JPG, WebP, or PDF, up to 3 MB.</p>
        </div>
      </fieldset>}
      {activeDrafts.map((draft, index) => {
        const selectedFont = CUSTOM_FONTS.find((item) => item.id === draft.font);
        return <fieldset key={index} className={styles.rackDesign}>
          <legend>{mode === "individual" || quantity === 1 ? "Rack " + (index + 1) + " - " + colors[index] : "Design for all " + quantity + " racks"}</legend>
          <div className={styles.choices}>
            <label><input required type="radio" name={"kind-" + index} checked={draft.kind === "name"} onChange={() => update(index, { kind: "name" })} /> Name</label>
            <label><input required type="radio" name={"kind-" + index} checked={draft.kind === "logo"} onChange={() => update(index, { kind: "logo" })} /> Logo</label>
          </div>
          {draft.kind === "name" && <div className={styles.fields}>
            <label>Name to print<input required maxLength={40} value={draft.name} onChange={(event) => update(index, { name: event.target.value })} placeholder="Type your name" /></label>
            <label>Font<select required value={draft.font} onChange={(event) => update(index, { font: event.target.value })}><option value="" disabled>Select a font</option>{CUSTOM_FONTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            {draft.name.trim() && selectedFont && <div className={styles.preview}><span>Font preview</span><p style={{ fontWeight: selectedFont.weight }}>{draft.name}</p></div>}
          </div>}
          {draft.kind === "logo" && <div className={styles.fields}>
            <p className={styles.help}>{sharedLogo ? "Uses the shared logo: " + sharedLogo.name : "Upload your shared logo in the order logo field above."}</p>
          </div>}
        </fieldset>;
      })}
      <p className={styles.help}>Customizations are saved for this visit. Design approval and payment will be connected next.</p>
      <button type="submit" className="ember-btn">Save Customizations</button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </form>
  </dialog>;
}
