"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CUSTOM_FONTS, MAX_LOGO_BYTES } from "@/lib/customization";
import styles from "./CustomCheckout.module.css";

export type CustomDesign = { kind: "name"; name: string; font: string } | { kind: "logo"; file: File };
export type CustomPlan = { mode: "same" | "individual"; designs: CustomDesign[] };
type Draft = { kind: string; name: string; font: string; file: File | null };
const emptyDraft = (): Draft => ({ kind: "", name: "", font: "", file: null });

export function CustomCheckout({ color, quantity, open, onClose, onSave }: { color: string; quantity: number; open: boolean; onClose: () => void; onSave: (plan: CustomPlan) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"same" | "individual">("same");
  const [drafts, setDrafts] = useState<Draft[]>(() => Array.from({ length: 4 }, emptyDraft));
  const [error, setError] = useState("");
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current?.close();
  }, [open]);

  function update(index: number, changes: Partial<Draft>) {
    setDrafts((items) => items.map((item, i) => i === index ? { ...item, ...changes } : item));
    setError("");
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const active = drafts.slice(0, mode === "same" ? 1 : quantity);
    const designs: CustomDesign[] = [];
    for (const [index, draft] of active.entries()) {
      const prefix = mode === "individual" ? "Rack " + (index + 1) + ": " : "";
      if (draft.kind === "logo") {
        if (!draft.file || !draft.file.size || draft.file.size > MAX_LOGO_BYTES) { setError(prefix + "Choose a logo file up to 3 MB."); return; }
        designs.push({ kind: "logo", file: draft.file });
      } else if (draft.kind === "name") {
        if (!draft.name.trim() || !CUSTOM_FONTS.some((item) => item.id === draft.font)) { setError(prefix + "Enter a name and select a font."); return; }
        designs.push({ kind: "name", name: draft.name.trim(), font: draft.font });
      } else { setError(prefix + "Choose Name or Logo."); return; }
    }
    onSave({ mode, designs });
    onClose();
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="custom-title" onClose={onClose}>
    <div className={styles.top}><p className="kicker">Make It Yours</p><button type="button" onClick={onClose} aria-label="Close customization form">Close x</button></div>
    <h2 id="custom-title" className="display">Customize True<span className="text-ember">Rack</span></h2>
    <p className={styles.summary}>{color} - Quantity {quantity} - $59.99 each</p>
    <form onSubmit={submit}>
      {quantity > 1 && <fieldset className={styles.assignment}>
        <legend>How would you like to customize your racks?</legend>
        <label><input type="radio" name="design-mode" checked={mode === "same"} onChange={() => { setMode("same"); setError(""); }} /> Same design on every rack</label>
        <label><input type="radio" name="design-mode" checked={mode === "individual"} onChange={() => { setMode("individual"); setError(""); }} /> Customize each rack</label>
        <p className={styles.help}>Use one name or logo for the whole order, or mix names and logos individually.</p>
      </fieldset>}
      {drafts.slice(0, mode === "same" ? 1 : quantity).map((draft, index) => {
        const selectedFont = CUSTOM_FONTS.find((item) => item.id === draft.font);
        return <fieldset key={index} className={styles.rackDesign}>
          <legend>{mode === "individual" || quantity === 1 ? "Rack " + (index + 1) : "Design for all " + quantity + " racks"}</legend>
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
            <label>{draft.file ? "Replace logo" : "Upload your logo"}<input type="file" accept=".png,.jpg,.jpeg,.webp,.pdf" required={!draft.file} onChange={(event) => { const file = event.target.files?.[0]; if (file) update(index, { file }); }} aria-describedby={"logo-help-" + index} /></label>
            {draft.file && <p className={styles.fileName}>Selected: {draft.file.name}</p>}
            <p id={"logo-help-" + index} className={styles.help}>PNG, JPG, WebP, or PDF. Maximum 3 MB per logo.</p>
          </div>}
        </fieldset>;
      })}
      <p className={styles.help}>Customizations are saved for this visit. Design approval and payment will be connected next.</p>
      <button type="submit" className="ember-btn">Save Customizations</button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </form>
  </dialog>;
}
