"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Where does it ship from?",
    a: "We ship from the US, folded flat in a sleeve. Domestic usually lands in 4–7 business days. International is available — you'll see the rate at checkout.",
  },
  {
    q: "What is it actually made of?",
    a: "SLS-printed glass-filled nylon (PA12-GF). Two rails. One apex pin. No third bar — the table cushion is the third side. No wood. No cheap injection plastic that bows when you lean on the 1-ball.",
  },
  {
    q: "How does the fold work?",
    a: "The two rails share one pin. Snap them open and they lock at 60° — that's the rack, seated on the cushion. Pinch the latch and they fold into a 14 mm stick that fits a drawer or a bag pocket. That's how it ships.",
  },
  {
    q: "Will the pin loosen?",
    a: "If the pin lets go, we replace it. Email a photo and your order. No receipt scavenger hunt.",
  },
  {
    q: "Does it work on a 7-foot table?",
    a: "Yes. Regulation 2¼″ balls, 15-ball rack, 7–9 ft tables. Bar boxes included. We didn't make a cute 9-ball-only object.",
  },
  {
    q: "Can I get my name on it?",
    a: "The first 100 people on the waitlist get their name marked on the underside. After that, it's a paid extra when we open it up.",
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
