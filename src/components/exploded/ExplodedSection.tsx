"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canCreateWebGL, readDeviceProfile } from "@/lib/device";
import { RackFallback } from "@/components/rack/RackSvg";
import { WebGLErrorBoundary } from "@/components/rack/WebGLErrorBoundary";

const ExplodedCanvas = dynamic(() => import("@/components/rack/ExplodedCanvas"), {
  ssr: false,
  loading: () => <RackFallback className="h-full w-full" explode={0} />,
});

export function ExplodedSection() {
  const [use3d, setUse3d] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const profile = readDeviceProfile();
    setAutoRotate(!profile.reducedMotion);
    setUse3d(canCreateWebGL());
  }, []);

  return (
    <section
      id="gallery"
      className="relative scroll-mt-24 overflow-x-clip border-y border-ink-line"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/70 to-transparent" />
      <div className="mx-auto grid max-w-site items-center gap-8 px-5 py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-10 md:px-8 md:py-24 lg:py-32">
        <div className="min-w-0">
          <p className="kicker">Anatomy</p>
          <h2 className="display mt-4 text-[2rem] leading-[0.95] sm:text-6xl md:text-7xl">
            Two rails.
            <br />
            The table
            <br className="sm:hidden" />{" "}
            does the rest.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-paper-mute sm:text-lg">
            Same caret as the hero — two nylon rails sharing one apex pin.
            They lock at 60°, then they fold. The cushion you already have
            is the third side.
          </p>
          <dl className="mt-8 space-y-4 text-sm sm:mt-10">
            {[
              ["01", "Rails", "Two of them. Glass-filled nylon, 15° printed seat."],
              ["02", "Pin", "One apex hinge. Lock open, fold flat."],
            ].map(([n, title, copy]) => (
              <div
                key={n}
                className="grid grid-cols-[2.5rem_1fr] items-baseline gap-3 border-t border-ink-line pt-4 sm:grid-cols-[3rem_1fr] sm:gap-4"
              >
                <dt className="font-display text-ember">{n}</dt>
                <dd className="min-w-0">
                  <span className="block font-display text-paper">{title}</span>
                  <span className="mt-1 block text-paper-mute">{copy}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative order-first mx-auto h-[240px] w-full min-w-0 max-w-[560px] sm:h-[300px] md:order-none md:h-[520px] md:max-w-none">
          {use3d ? (
            <WebGLErrorBoundary
              fallback={<RackFallback className="h-full w-full" />}
            >
              <ExplodedCanvas autoRotate={autoRotate} />
            </WebGLErrorBoundary>
          ) : (
            <RackFallback className="h-full w-full" />
          )}
        </div>
      </div>
    </section>
  );
}
