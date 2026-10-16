"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("busy");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not join.");
      setStatus("ok");
      setMessage("You're on the list.");
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Try again.");
    }
  }

  return (
    <div>
      <p className="kicker">Restock + early releases</p>
      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="block flex-1">
          <span className="kicker">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border border-ink-line bg-transparent px-3 py-3 outline-none focus:border-ember"
            placeholder="you@table.com"
          />
        </label>
        <button type="submit" className="ember-btn shrink-0" disabled={status === "busy"}>
          {status === "busy" ? "Saving…" : "Notify me"}
        </button>
      </form>
      {message ? (
        <p
          className={`mt-3 text-sm ${status === "err" ? "text-ember" : "text-paper"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
