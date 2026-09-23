"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Where does it ship from?",
    a: "We ship from the US. Domestic usually lands in 4–7 business days. International is available — you'll see the rate at checkout.",
  },
  {
    q: "What is it actually made of?",
    a: "6061-T6 aluminum rails, hard-anodized. Stainless pins pressed at the corners. No plastic. No wood. No hidden steel that rusts in a damp basement.",
  },
  {
    q: "What if it warps?",
    a: "It won't. If it does, we replace it. Lifetime against warp, no receipt scavenger hunt. Email us a photo of the corner and your order.",
  },
  {
    q: "Does it work on a 7-foot table?",
    a: "Yes. Regulation 2¼″ balls, 15-ball rack, 7–9 ft tables. Bar boxes included. We didn't make a cute 9-ball-only object.",
  },
  {
    q: "Can I get my name on it?",
    a: "The first 100 people on the waitlist get their name laser-etched on the underside. After that, etching is a paid extra when we open it up.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-ink-line">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-ink-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-baseline justify-between gap-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg">{item.q}</span>
              <span className="font-display text-ember">
                {isOpen ? "–" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="max-w-xl pb-6 text-paper-mute">{item.a}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
