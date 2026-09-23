"use client";

import { PointerEvent, useMemo, useRef, useState } from "react";

const ROWS = [1, 2, 3, 4, 5];
const R = 14;
const TIGHT = R * 2;
const CHEAP = R * 2.18;

function layout(spacing: number) {
  const points: { x: number; y: number }[] = [];
  const totalRows = ROWS.length;
  const height = (totalRows - 1) * spacing * Math.sin(Math.PI / 3);
  ROWS.forEach((count, row) => {
    const y = row * spacing * Math.sin(Math.PI / 3) - height / 2;
    const rowWidth = (count - 1) * spacing;
    for (let i = 0; i < count; i++) {
      points.push({
        x: -rowWidth / 2 + i * spacing,
        y,
      });
    }
  });
  return points;
}

function playTick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.07);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    /* ignore */
  }
}

export function TightnessToy() {
  const [mode, setMode] = useState<"pbfer" | "cheap">("pbfer");
  const [drag, setDrag] = useState<{ i: number; x: number; y: number } | null>(
    null,
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const home = useMemo(
    () => layout(mode === "pbfer" ? TIGHT : CHEAP),
    [mode],
  );

  const jitter = useMemo(
    () =>
      home.map((_, i) =>
        mode === "cheap"
          ? {
              x: Math.sin(i * 1.7) * 2.4,
              y: Math.cos(i * 2.1) * 2.1,
            }
          : { x: 0, y: 0 },
      ),
    [home, mode],
  );

  function toLocal(e: PointerEvent<SVGCircleElement>) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x - 160, y: local.y - 130 };
  }

  function onDown(i: number, e: PointerEvent<SVGCircleElement>) {
    (e.target as Element).setPointerCapture(e.pointerId);
    setDrag({ i, ...toLocal(e) });
  }

  function onMove(e: PointerEvent<SVGCircleElement>) {
    if (!drag) return;
    setDrag({ ...drag, ...toLocal(e) });
  }

  function onUp() {
    if (drag && mode === "pbfer") playTick();
    setDrag(null);
  }

  function switchMode(next: "pbfer" | "cheap") {
    setMode(next);
    setDrag(null);
    if (next === "pbfer") playTick();
  }

  return (
    <section id="toy" className="relative overflow-hidden border-t border-ink-line">
      <div className="absolute inset-x-0 top-0 h-1 bg-felt" />
      <div className="mx-auto max-w-site px-5 py-24 md:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <p className="kicker">The toy</p>
            <h2 className="display mt-4 text-4xl sm:text-6xl">
              Rack tightness,
              <br />
              in ten seconds.
            </h2>
            <p className="mt-5 max-w-md text-lg text-paper-mute">
              Drag a ball out. Watch it snap home — or watch it sit there
              looking embarrassed. Toggle the cheap rack. Show this to
              whoever still defends the house triangle.
            </p>
            <div className="mt-8 inline-flex border border-ink-line">
              <button
                type="button"
                onClick={() => switchMode("pbfer")}
                className={`px-5 py-3 font-display text-xs uppercase tracking-[0.16em] ${
                  mode === "pbfer" ? "bg-ember text-ink" : "text-paper-mute"
                }`}
              >
                PBFER
              </button>
              <button
                type="button"
                onClick={() => switchMode("cheap")}
                className={`px-5 py-3 font-display text-xs uppercase tracking-[0.16em] ${
                  mode === "cheap" ? "bg-paper text-ink" : "text-paper-mute"
                }`}
              >
                Cheap rack
              </button>
            </div>
            <p className="mt-4 text-sm text-paper-mute">
              {mode === "pbfer"
                ? "Contact. No daylight. That's the product."
                : "Gaps. Wiggle. The break you already know."}
            </p>
          </div>

          <div className="relative bg-ink-raised hairline">
            <svg
              ref={svgRef}
              viewBox="0 0 320 260"
              className="h-auto w-full touch-none"
              role="img"
              aria-label="Interactive rack tightness comparison"
            >
              <polyline
                points="46,222 160,28 274,222"
                fill="none"
                stroke={mode === "pbfer" ? "#FF5A1F" : "#3a3a40"}
                strokeWidth="7"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="226"
                x2="280"
                y2="226"
                stroke="#1F4A3A"
                strokeWidth="5"
                strokeLinecap="round"
              />
              {home.map((p, i) => {
                const isDrag = drag?.i === i;
                const x = 160 + (isDrag ? drag.x : p.x + jitter[i].x);
                const y = 130 + (isDrag ? drag.y : p.y + jitter[i].y);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={R - 0.6}
                    fill="#f3eee4"
                    stroke="#0A0A0B"
                    strokeWidth="1.2"
                    className="cursor-grab active:cursor-grabbing"
                    style={{
                      transition: isDrag
                        ? "none"
                        : "cx 280ms cubic-bezier(.2,.8,.2,1), cy 280ms cubic-bezier(.2,.8,.2,1)",
                    }}
                    onPointerDown={(e) => onDown(i, e)}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                  />
                );
              })}
            </svg>
            <p className="px-4 pb-4 text-center font-display text-[0.62rem] uppercase tracking-[0.2em] text-paper-mute">
              Drag any ball · {mode === "pbfer" ? "snaps tight" : "stays sloppy"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
