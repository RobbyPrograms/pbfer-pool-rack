"use client";

import { FormEvent, useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

type CountPayload = { count: number; cap: number };

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<CountPayload>({
    count: 0,
    cap: BRAND.waitlistCap,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/waitlist/count", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: CountPayload) => {
        if (!cancelled && typeof data.count === "number") setCount(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("busy");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = (await res.json()) as {
        error?: string;
        spot?: number;
        count?: number;
      };
      if (!res.ok) throw new Error(data.error || "Could not join.");
      setStatus("ok");
      setMessage(
        data.spot
          ? `You're #${data.spot}. Don't lose that.`
          : "You're on the list.",
      );
      if (typeof data.count === "number") {
        setCount((c) => ({ ...c, count: data.count as number }));
      }
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Try again.");
    }
  }

  const remaining = Math.max(0, count.cap - count.count);

  return (
    <div>
      {!compact ? (
        <>
          <p className="kicker">First 100</p>
          <h3 className="display mt-3 text-3xl sm:text-4xl">
            Get your name under the rail.
          </h3>
          <p className="mt-3 max-w-md text-paper-mute">
            First {count.cap} on the list get their name marked on the
            underside. After that, you just get restock notes.
          </p>
        </>
      ) : (
        <p className="kicker">Restock + early releases</p>
      )}

      <p className="mt-5 font-display text-2xl">
        <span className="text-ember">{count.count}</span>
        <span className="text-paper-mute">/{count.cap}</span>
        <span className="ml-3 text-sm tracking-normal text-paper-mute">
          {remaining === 0 ? "etch spots gone" : `${remaining} etch spots left`}
        </span>
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        {!compact ? (
          <label className="block flex-1">
            <span className="kicker">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-ink-line bg-transparent px-3 py-3 outline-none focus:border-ember"
              placeholder="What we etch"
            />
          </label>
        ) : null}
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
          {status === "busy" ? "Saving…" : compact ? "Notify me" : "Claim a spot"}
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
