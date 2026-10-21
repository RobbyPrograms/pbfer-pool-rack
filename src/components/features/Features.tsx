"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { TrueRack } from "@/components/brand/Marks";

const PartCanvas = dynamic(() => import("./PartCanvas"), { ssr: false });

const CARDS = [
  {
    titleLead: "Engineered",
    titleRest: "Hinge",
    model: "/models/shoulder-screw.glb",
    body: "A stainless steel bolt features a smooth, precision-machined shaft that allows TrueRack's arms to pivot freely. Its threaded end secures the connection, while the bolt's head prevents the arms from separating without clamping.",
    traits: [
      { label: "Durable", icon: "/features/durable.svg" },
      { label: "Reliable", icon: "/features/reliable.svg" },
      { label: "Smooth", icon: "/features/smooth.svg" },
    ],
  },
  {
    titleLead: "Precision",
    titleRest: "Stop",
    model: "/models/stop-mechanism.glb",
    body: "A threaded barrel travels through a curved slot, contacting a built-in stopping surface at exactly 60°. The barrel transfers the force into a steel screw supported above and below, creating an exceptionally strong stopping mechanism.",
    traits: [
      { label: "Tough", icon: "/features/tough.svg" },
      { label: "Accurate", icon: "/features/accurate.svg" },
      { label: "Consistent", icon: "/features/consistent.svg" },
    ],
  },
  {
    titleLead: "Carbon-Fiber",
    titleRest: "Construction",
    model: null,
    body: "TrueRack is constructed from a blend of plastic and carbon fiber, combining lightweight construction with exceptional rigidity. The result is a strong, durable rack with a sleek, premium matte finish.",
    traits: [
      { label: "Light weight", icon: "/features/light.svg" },
      { label: "Rigid", icon: "/features/rigid.svg" },
      { label: "Consistent", icon: "/features/finish.svg" },
    ],
  },
] as const;

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-ink-line bg-ink">
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="kicker">Features</p>
            <h2 className="display mt-4 text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
              A closer look at how
              <br />
              <TrueRack /> is engineered.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-paper/80 lg:text-right">
            Every component of <TrueRack className="font-semibold" /> serves a
            purpose. From its precision-engineered hinge and stopping mechanism
            to its materials and construction, each detail is designed for
            reliable performance and lasting durability.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {CARDS.map((card) => (
            <article
              key={card.titleRest}
              className="flex flex-col rounded-2xl border border-white/10 bg-[#141416] p-3 sm:p-4"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black">
                {card.model ? (
                  <ModelBoundary>
                    <PartCanvas url={card.model} />
                    <p className="pointer-events-none absolute bottom-3 right-3 font-display text-[0.62rem] uppercase tracking-[0.16em] text-paper-mute">
                      Drag to spin
                    </p>
                  </ModelBoundary>
                ) : (
                  <div className="flex h-full items-end justify-end p-3">
                    <p className="font-display text-[0.62rem] uppercase tracking-[0.16em] text-paper-mute">
                      Print timelapse
                    </p>
                  </div>
                )}
              </div>

              <h3 className="mt-5 px-1 font-display text-2xl font-bold leading-none sm:text-[1.7rem]">
                <span className="text-ember">{card.titleLead}</span>{" "}
                {card.titleRest}
              </h3>
              <p className="mt-3 px-1 text-sm leading-relaxed text-paper/85">
                {card.body.includes("TrueRack") ? (
                  <Body text={card.body} />
                ) : (
                  card.body
                )}
              </p>
              <ul className="mt-5 space-y-3 px-1 pb-2">
                {card.traits.map((trait) => (
                  <li key={trait.label} className="flex items-center gap-3">
                    <img
                      src={trait.icon}
                      alt=""
                      className="h-6 w-6 shrink-0 object-contain"
                    />
                    <span className="font-display text-sm text-paper">
                      {trait.label}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

class ModelBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="flex h-full items-center justify-center px-4 text-center font-display text-xs uppercase tracking-[0.14em] text-paper-mute">
          Model unavailable
        </div>
      );
    }
    return this.props.children;
  }
}

function Body({ text }: { text: string }) {
  const parts = text.split("TrueRack");
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? (
            <TrueRack className="font-semibold" />
          ) : null}
        </span>
      ))}
    </>
  );
}
