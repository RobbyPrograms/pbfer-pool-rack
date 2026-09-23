export type DeviceProfile = {
  preferFallback: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
};

function connectionIsConstrained() {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const conn = nav.connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

export function readDeviceProfile(): DeviceProfile {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (
    navigator as Navigator & { deviceMemory?: number }
  ).deviceMemory;
  const lowEnd =
    cores <= 2 ||
    (typeof memory === "number" && memory <= 2) ||
    connectionIsConstrained();

  return {
    preferFallback: reducedMotion || lowEnd,
    isMobile,
    reducedMotion,
  };
}

export function probeFps(sampleMs = 900): Promise<number> {
  return new Promise((resolve) => {
    let frames = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      frames += 1;
      if (now - start < sampleMs) {
        requestAnimationFrame(tick);
        return;
      }
      resolve((frames * 1000) / (now - start));
    };
    requestAnimationFrame(tick);
  });
}

export function canCreateWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
