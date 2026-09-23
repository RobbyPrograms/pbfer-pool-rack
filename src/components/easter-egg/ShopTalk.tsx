"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RackSvg } from "@/components/rack/RackSvg";

type EggContext = {
  bumpLogo: () => void;
  armed: boolean;
};

const Ctx = createContext<EggContext>({
  bumpLogo: () => undefined,
  armed: false,
});

export function useEasterEgg() {
  return useContext(Ctx);
}

function playSnap() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.14);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    /* ignore */
  }
}

function ShopTalkOverlay() {
  const [explode, setExplode] = useState(1);

  useEffect(() => {
    const id = window.setTimeout(() => setExplode(0), 40);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-ink/75">
      <div className="text-center">
        <div
          style={{
            transition: "transform 420ms cubic-bezier(.15,.9,.2,1)",
          }}
        >
          <RackSvg className="mx-auto h-56 w-56" explode={explode} />
        </div>
        <p className="mt-4 font-display text-2xl tracking-[0.2em] text-ember">
          RACKED.
        </p>
        <p className="mt-1 text-sm text-paper-mute">Shop talk unlocked.</p>
      </div>
    </div>
  );
}

const SEQUENCE = ["r", "a", "c", "k"];

export function ShopTalkProvider({ children }: { children: ReactNode }) {
  const [armed, setArmed] = useState(false);

  const fire = useCallback(() => {
    setArmed(true);
    playSnap();
    window.setTimeout(() => setArmed(false), 2200);
  }, []);

  const clickCount = useRef(0);
  const typedRef = useRef<string[]>([]);

  const bumpLogo = useCallback(() => {
    clickCount.current += 1;
    if (clickCount.current >= 7) {
      clickCount.current = 0;
      fire();
    }
  }, [fire]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      typedRef.current = [...typedRef.current, key].slice(-SEQUENCE.length);
      if (typedRef.current.join("") === SEQUENCE.join("")) {
        typedRef.current = [];
        fire();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fire]);

  const value = useMemo(() => ({ bumpLogo, armed }), [bumpLogo, armed]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {armed ? <ShopTalkOverlay /> : null}
    </Ctx.Provider>
  );
}
