"use client";

import { useState } from "react";

export function FoldMoment() {
  const [flat, setFlat] = useState(false);

  return (
    <section id="fold" className="relative overflow-hidden border-t border-ink-line">
      <div className="mx-auto grid max-w-site items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-8 lg:py-32">
        <div>
          <p className="kicker">The fold</p>
          <h2 className="display mt-4 text-4xl sm:text-6xl md:text-7xl">
            Open, it&apos;s a rack.
            <br />
            Closed, it&apos;s a stick.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-mute">
            Each corner is a hinge with a detent. Snap the triangle open and
            it locks at 60°. Pinch the latch and the three rails fold flat —
            sleeve-sized, drawer-sized, envelope-sized. That&apos;s how it
            ships. That&apos;s how it lives when you&apos;re not breaking.
          </p>
          <button
            type="button"
            onClick={() => setFlat((v) => !v)}
            className="ghost-btn mt-8"
          >
            {flat ? "Snap it open" : "Fold it flat"}
          </button>
        </div>

        <div className="relative min-h-[320px] bg-ink-raised hairline">
          <FoldGraphic flat={flat} />
          <p className="absolute bottom-4 left-4 font-display text-[0.62rem] uppercase tracking-[0.18em] text-paper-mute">
            {flat ? "14 mm pack" : "Locked open"}
          </p>
        </div>
      </div>
    </section>
  );
}

function FoldGraphic({ flat }: { flat: boolean }) {
  const rails = flat
    ? [
        { x: 22, y: 50, rot: 0 },
        { x: 50, y: 50, rot: 0 },
        { x: 78, y: 50, rot: 0 },
      ]
    : [
        { x: 37, y: 42, rot: -58 },
        { x: 50, y: 72, rot: 0 },
        { x: 63, y: 42, rot: 58 },
      ];

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full p-6" aria-hidden>
      {rails.map((r, i) => (
        <g
          key={i}
          style={{
            transform: `translate(${r.x}px, ${r.y}px) rotate(${r.rot}deg)`,
            transformOrigin: "center",
            transition: "transform 480ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <rect
            x="-27"
            y="-3"
            width="54"
            height="6"
            rx="1.2"
            fill="#1c1c20"
            stroke="#FF5A1F"
            strokeWidth="0.5"
          />
        </g>
      ))}
    </svg>
  );
}
