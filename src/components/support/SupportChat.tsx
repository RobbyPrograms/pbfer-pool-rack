"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { SUPPORT_CONFIG, type SupportMessage } from "@/lib/support-config";
import styles from "./SupportChat.module.css";

type Category = (typeof SUPPORT_CONFIG.categories)[number];

export function SupportChat({ category, onClose, onContact }: {
  category: Category;
  onClose: () => void;
  onContact: (messages: SupportMessage[]) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const sending = useRef(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState("");
  const [failed, setFailed] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<"checking" | "available" | "unavailable">("checking");
  const [error, setError] = useState("");
  const [needsContact, setNeedsContact] = useState(false);
  const limitReached = messages.length + 1 > SUPPORT_CONFIG.limits.messages || messages.reduce((count, item) => count + item.content.length, 0) + input.length > SUPPORT_CONFIG.limits.totalChars;

  useEffect(() => {
    const popup = dialog.current;
    popup?.showModal();
    const check = new AbortController();
    fetch("/api/support-chat", { signal: check.signal, cache: "no-store" })
      .then(async (response) => { if (!response.ok) throw new Error(); return response.json(); })
      .then((result) => setAvailability(result.available ? "available" : "unavailable"))
      .catch(() => { if (!check.signal.aborted) setAvailability("unavailable"); });
    return () => { check.abort(); controller.current?.abort(); popup?.close(); };
  }, []);

  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [messages, pending, failed, error, availability]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question || sending.current || availability !== "available" || limitReached) return;
    const next: SupportMessage[] = [...messages, { role: "user", content: question }];
    sending.current = true;
    setLoading(true);
    setError("");
    setFailed("");
    setPending(question);
    setInput("");
    const request = new AbortController();
    controller.current = request;
    const timeout = setTimeout(() => request.abort(), 25_000);
    try {
      const response = await fetch("/api/support-chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category.id, messages: next }), signal: request.signal,
      });
      const result = await response.json();
      if (!response.ok || typeof result.reply !== "string" || !result.reply.trim()) throw new Error(result.error || SUPPORT_CONFIG.unavailable);
      setMessages([...next, { role: "assistant", content: result.reply }]);
      setNeedsContact(Boolean(result.contactPayton));
    } catch (err) {
      if (dialog.current?.open) {
        setError(request.signal.aborted ? "The request timed out. Please try again or contact Payton." : err instanceof Error ? err.message : SUPPORT_CONFIG.unavailable);
        setFailed(question);
        setInput(question);
        setNeedsContact(true);
      }
    } finally {
      clearTimeout(timeout);
      sending.current = false;
      setLoading(false);
      setPending("");
      field.current?.focus();
    }
  }

  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="support-chat-title" onCancel={onClose}>
    <div className={styles.header}>
      <div><p className={styles.eyebrow}>AI support assistant</p><h3 id="support-chat-title">{category.title}</h3></div>
      <button type="button" onClick={onClose} className={styles.close} aria-label="Close support chat">×</button>
    </div>
    <div className={styles.conversation} role="log" aria-label="Support conversation" aria-live="polite" aria-relevant="additions text">
      <div className={styles.assistant}><span>AI support assistant</span><p>{SUPPORT_CONFIG.greeting}</p></div>
      {messages.map((message, index) => <div key={index} className={message.role === "user" ? styles.customer : styles.assistant}><span>{message.role === "user" ? "You" : "AI support assistant"}</span><p>{message.content}</p></div>)}
      {(pending || failed) && <div className={styles.customer}><span>You</span><p>{pending || failed}</p></div>}
      {loading && <p className={styles.notice} role="status">Checking approved information…</p>}
      {availability === "checking" && <p className={styles.notice} role="status">Checking chat availability…</p>}
      {availability === "unavailable" && <p className={styles.notice} role="status">{SUPPORT_CONFIG.unavailable}</p>}
      {error && <p className={styles.error} role="alert">{error}</p>}
      {limitReached && <p className={styles.notice}>This chat has reached its limit. Contact Payton to continue.</p>}
      <div ref={end} />
    </div>
    <div className={styles.footer}>
      {needsContact && <p className={styles.help}>Need personal help? Your category and conversation will be copied into the contact form.</p>}
      <button type="button" className={styles.contact} onClick={() => onContact([...messages, ...(pending || failed ? [{ role: "user" as const, content: pending || failed }] : [])])}>Contact Payton</button>
      <form onSubmit={send} className={styles.composer}>
        <label htmlFor="support-question" className={styles.srOnly}>Your question</label>
        <textarea ref={field} id="support-question" value={input} onChange={(event) => setInput(event.target.value)} maxLength={SUPPORT_CONFIG.limits.messageChars} rows={2} placeholder="How can we help?" disabled={loading || availability !== "available" || limitReached} required />
        <button type="submit" disabled={loading || availability !== "available" || limitReached || !input.trim()}>{loading ? "Sending…" : "Send"}</button>
      </form>
      <p className={styles.help}>AI support · {input.length}/{SUPPORT_CONFIG.limits.messageChars} characters. Closing this popup clears the chat.</p>
    </div>
  </dialog>;
}
