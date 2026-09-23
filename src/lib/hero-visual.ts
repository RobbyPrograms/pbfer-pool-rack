/**
 * Hero visual switch.
 * Keep `mode: "procedural"` until real turntable frames exist.
 * Drop 36–72 images in /public/spin (rack-00.webp …) and flip mode to "spin".
 * HeroStage / Hero do not need to be restructured.
 */
export type HeroVisualMode = "procedural" | "spin";

export const HERO_VISUAL = {
  mode: "procedural" as HeroVisualMode,
  spin: {
    frameCount: 36,
    src: (index: number) =>
      `/spin/rack-${String(index).padStart(2, "0")}.webp`,
    autoRpm: 3.2,
  },
} as const;
