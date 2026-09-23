"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  canCreateWebGL,
  readDeviceProfile,
} from "@/lib/device";
import { RackFallback } from "@/components/rack/RackSvg";
import { WebGLErrorBoundary } from "@/components/rack/WebGLErrorBoundary";

const ExplodedCanvas = dynamic(() => import("@/components/rack/ExplodedCanvas"), {
  ssr: false,
  loading: () => <RackFallback className="h-full w-full" explode={0.4} />,
});

export function ExplodedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [use3d, setUse3d] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const profile = readDeviceProfile();
    setAutoRotate(!profile.reducedMotion);
    setUse3d(!profile.preferFallback && canCreateWebGL());
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const view = window.innerHeight;
      const start = view * 0.75;
      const end = -rect.height * 0.15;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="anatomy"
      className="relative overflow-hidden border-y border-ink-line"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/70 to-transparent" />
      <div className="mx-auto grid max-w-site items-center gap-10 px-5 py-24 md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:py-32">
        <div>
          <p className="kicker">Anatomy</p>
          <h2 className="display mt-4 text-4xl sm:text-6xl md:text-7xl">
            Three rails.
            <br />
            No excuses.
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper-mute">
            Scroll it apart. Three identical extrusions, pinned at the corners,
            beveled on the inside face. Nothing to loosen. Nothing to swell.
            If a part can warp, we didn&apos;t use it.
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            {[
              ["01", "Rails", "6061 extrusion, 15° inner chamfer"],
              ["02", "Pins", "Pressed stainless, no threads to back out"],
              ["03", "Seat", "Balls drop in. They don't climb the wall."],
            ].map(([n, title, copy]) => (
              <div
                key={n}
                className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-ink-line pt-4"
              >
                <dt className="font-display text-ember">{n}</dt>
                <dd>
                  <span className="font-display text-paper">{title}</span>
                  <span className="ml-3 text-paper-mute">{copy}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative h-[56vw] min-h-[320px] max-h-[560px] md:h-[520px]">
          {use3d ? (
            <WebGLErrorBoundary
              fallback={
                <RackFallback className="h-full w-full" explode={progress} />
              }
            >
              <ExplodedCanvas progress={progress} autoRotate={autoRotate} />
            </WebGLErrorBoundary>
          ) : (
            <RackFallback className="h-full w-full" explode={progress} />
          )}
        </div>
      </div>
    </section>
  );
}
