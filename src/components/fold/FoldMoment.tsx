"use client";

import { useState } from "react";

export function FoldMoment() {
  const [flat, setFlat] = useState(false);

  return (
    <section id="fold" className="relative overflow-hidden border-t border-ink-line">
      <div className="mx-auto grid max-w-site items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-8 lg:py-32">
        <div>
          <p className="kicker">The fold — a demo, not the default</p>
          <h2 className="display mt-4 text-4xl sm:text-6xl md:text-7xl">
            Ships flat.
            <br />
            Locks rigid.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-mute">
            Two rails, one pin. Deployed, they lock at 60° and the table
            cushion closes the pack. Pinch the latch and they fold into a
            stick — sleeve-sized for shipping, drawer-sized for the rest
            of the week.
          </p>
          <button
            type="button"
            onClick={() => setFlat((v) => !v)}
            className="ghost-btn mt-8"
          >
            {flat ? "Open it back" : "See it fold"}
          </button>
        </div>

        <div className="relative min-h-[320px] bg-ink-raised hairline">
          <FoldGraphic flat={flat} />
          <p className="absolute bottom-4 left-4 font-display text-[0.62rem] uppercase tracking-[0.18em] text-paper-mute">
            {flat ? "14 mm pack — how it ships" : "Locked open — how it racks"}
          </p>
        </div>
      </div>
    </section>
  );
}

function FoldGraphic({ flat }: { flat: boolean }) {
  const pinX = 50;
  const pinY = flat ? 26 : 30;
  const leftRot = flat ? 90 : 122;
  const rightRot = flat ? 90 : 58;
  const ease = "transform 480ms cubic-bezier(.2,.8,.2,1)";

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g
        style={{
          transform: `translate(${pinX}px, ${pinY}px) rotate(${leftRot}deg)`,
          transformOrigin: "0px 0px",
          transition: ease,
        }}
      >
        <rect
          x="0"
          y={flat ? -6 : -3}
          width="42"
          height="6"
          rx="1.2"
          fill="#1c1c20"
          stroke="#FF5A1F"
          strokeWidth="0.5"
        />
      </g>
      <g
        style={{
          transform: `translate(${pinX}px, ${pinY}px) rotate(${rightRot}deg)`,
          transformOrigin: "0px 0px",
          transition: ease,
        }}
      >
        <rect
          x="0"
          y={flat ? 0 : -3}
          width="42"
          height="6"
          rx="1.2"
          fill="#1c1c20"
          stroke="#FF5A1F"
          strokeWidth="0.5"
        />
      </g>
      <g
        style={{
          transform: `translate(${pinX}px, ${pinY}px)`,
          transition: ease,
        }}
      >
        <circle
          r="2.6"
          fill="#1a1a1d"
          stroke="#FF5A1F"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
