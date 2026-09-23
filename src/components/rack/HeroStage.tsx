"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HERO_VISUAL } from "@/lib/hero-visual";
import {
  canCreateWebGL,
  probeFps,
  readDeviceProfile,
} from "@/lib/device";
import { PhotoSpin } from "./PhotoSpin";
import { RackFallback } from "./RackSvg";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <RackFallback className="h-full w-full" />,
});

export function HeroStage() {
  const [mode, setMode] = useState<"pending" | "3d" | "fallback">("pending");
  const [allowDrag, setAllowDrag] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [tilt, setTilt] = useState({ x: 14, z: -6 });

  useEffect(() => {
    const profile = readDeviceProfile();
    setAllowDrag(!profile.isMobile);
    setAutoRotate(!profile.reducedMotion);

    if (HERO_VISUAL.mode === "spin") return;

    if (profile.preferFallback || !canCreateWebGL()) {
      setMode("fallback");
    } else {
      setMode("3d");
      probeFps(800).then((fps) => {
        if (fps < 28) setMode("fallback");
      });
    }

    const onScroll = () => {
      const y = window.scrollY;
      setTilt({
        x: 14 + Math.min(8, y / 90),
        z: -6 + Math.min(5, y / 160),
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HERO_VISUAL.mode === "spin") {
    return (
      <PhotoSpin allowDrag={allowDrag} autoRotate={autoRotate} />
    );
  }

  if (mode !== "3d") {
    return (
      <div
        className="relative h-full w-full"
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateZ(${tilt.z}deg)`,
        }}
      >
        <RackFallback
          className="mx-auto h-full w-full max-w-[520px]"
          tilt={false}
        />
      </div>
    );
  }

  return (
    <WebGLErrorBoundary
      fallback={<RackFallback className="mx-auto h-full w-full max-w-[520px]" />}
    >
      <div className="h-full w-full">
        <HeroCanvas allowDrag={allowDrag} autoRotate={autoRotate} />
      </div>
    </WebGLErrorBoundary>
  );
}
