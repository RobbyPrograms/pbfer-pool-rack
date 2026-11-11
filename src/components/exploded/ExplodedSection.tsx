"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { canCreateWebGL, readDeviceProfile } from "@/lib/device";
import { SPECS } from "@/lib/brand";
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
      id="anatomy"
      className="relative scroll-mt-24 overflow-x-clip border-y border-ink-line"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/70 to-transparent" />
      <div className="mx-auto max-w-site px-5 py-16 md:px-8 md:py-24 lg:py-32">
        <div className="grid items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
          <div className="min-w-0">
            <p className="kicker">THE BORING PART THAT ISN&apos;T</p>
            <h2 className="display mt-4 text-[2rem] leading-[0.95] sm:text-6xl md:text-7xl">
              Spec Sheet
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper-mute sm:text-lg">
              Same caret as the hero — two nylon rails sharing one apex pin.
              They lock at 60°, then they fold. The cushion you already have
              is the third side.
            </p>
          </div>

          <div className="relative order-first mx-auto h-[240px] min-h-[240px] w-full min-w-0 max-w-[560px] overflow-hidden sm:h-[300px] sm:min-h-[300px] md:order-none md:h-[420px] md:min-h-[420px] md:max-w-none lg:h-[520px] lg:min-h-[520px]">
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

        <dl
          id="specs"
          className="mt-12 divide-y divide-ink-line border-y border-ink-line scroll-mt-24"
        >
          {SPECS.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 py-4 text-sm sm:grid-cols-[0.7fr_1.3fr] sm:items-baseline sm:gap-6 sm:text-base"
            >
              <dt className="text-paper-mute">{row.label}</dt>
              <dd className="font-display text-paper sm:text-right">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
