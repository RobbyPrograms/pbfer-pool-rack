"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { Group } from "three";
import { RackModel } from "./RackModel";

type ExplodedCanvasProps = {
  progress: number;
  autoRotate: boolean;
};

function SpinningRack({
  progress,
  autoRotate,
}: {
  progress: number;
  autoRotate: boolean;
}) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current || !autoRotate) return;
    group.current.rotation.y += delta * 0.18;
  });

  return (
    <group ref={group}>
      <RackModel explode={progress} />
    </group>
  );
}

export default function ExplodedCanvas({
  progress,
  autoRotate,
}: ExplodedCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 2.4, 3.6], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <color attach="background" args={["#0A0A0B"]} />
      <ambientLight intensity={0.32} />
      <directionalLight position={[2, 2.4, 1]} intensity={1.05} color="#f3eee4" />
      <pointLight
        position={[-2, 0.8, -1.2]}
        intensity={16}
        distance={7}
        color="#FF5A1F"
      />
      <Suspense fallback={null}>
        <SpinningRack progress={progress} autoRotate={autoRotate} />
      </Suspense>
    </Canvas>
  );
}
