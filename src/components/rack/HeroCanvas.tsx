"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { RackModel } from "./RackModel";

type HeroCanvasProps = {
  allowDrag: boolean;
  autoRotate: boolean;
};

export default function HeroCanvas({
  allowDrag,
  autoRotate,
}: HeroCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 2.05, 3.55], fov: 36 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2.4, 2.2, 1.2]}
        intensity={1.15}
        color="#f3eee4"
      />
      <pointLight
        position={[-2.1, 0.6, -1.4]}
        intensity={18}
        distance={8}
        color="#FF5A1F"
      />
      <Suspense fallback={null}>
        <RackModel />
        <ContactShadows
          position={[0, -0.55, 0]}
          opacity={0.42}
          scale={6}
          blur={2.4}
          far={2}
          color="#000000"
        />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={allowDrag}
        autoRotate={autoRotate}
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.15}
      />
    </Canvas>
  );
}
