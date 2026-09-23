"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import { HERO_VISUAL } from "@/lib/hero-visual";

type PhotoSpinProps = {
  allowDrag: boolean;
  autoRotate: boolean;
};

export function PhotoSpin({ allowDrag, autoRotate }: PhotoSpinProps) {
  const { frameCount, src, autoRpm } = HERO_VISUAL.spin;
  const [frame, setFrame] = useState(0);
  const [failed, setFailed] = useState(false);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const acc = useRef(0);

  useEffect(() => {
    const img = new Image();
    img.onerror = () => setFailed(true);
    img.src = src(0);
  }, [src]);

  useEffect(() => {
    if (!autoRotate || dragging.current || failed) return;
    const fps = (autoRpm / 60) * frameCount;
    const id = window.setInterval(() => {
      if (dragging.current) return;
      setFrame((f) => (f + 1) % frameCount);
    }, Math.max(16, 1000 / fps));
    return () => window.clearInterval(id);
  }, [autoRotate, failed, frameCount]);

  function onDown(e: PointerEvent<HTMLDivElement>) {
    if (!allowDrag) return;
    dragging.current = true;
    lastX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    acc.current += dx;
    const step = 8;
    if (Math.abs(acc.current) >= step) {
      const dir = acc.current > 0 ? 1 : -1;
      const hops = Math.floor(Math.abs(acc.current) / step);
      acc.current -= dir * hops * step;
      setFrame((f) => (f + dir * hops + frameCount * 8) % frameCount);
    }
  }

  function onUp() {
    dragging.current = false;
  }

  if (failed) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-paper-mute">
        Spin frames not found. Drop images in /public/spin.
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full touch-none select-none"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label="360 degree product view"
    >
      {/*
        Preload neighbors via hidden imgs so drag doesn't flash.
        Current frame is the visible one.
      */}
      <img
        src={src(frame)}
        alt=""
        draggable={false}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
