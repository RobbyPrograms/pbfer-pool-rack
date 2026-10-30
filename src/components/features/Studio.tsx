"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function Studio() {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={1.6}>
      <Lightformer
        form="rect"
        intensity={8}
        color="#fff6ee"
        position={[0, 3.2, 2.4]}
        scale={[8, 4.5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={4}
        color="#ffffff"
        position={[-3.6, 1.8, 1.2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[6, 3.2, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3}
        color="#f4f4f6"
        position={[3.6, 1.4, 1]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={[6, 3.2, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#ffd9c8"
        position={[0, 1.2, -3.4]}
        scale={[7, 3, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#d7d7dc"
        position={[0, -2.6, 1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[8, 5, 1]}
      />
    </Environment>
  );
}
