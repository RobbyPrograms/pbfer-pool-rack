"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { TrueRackModel } from "./TrueRackModel";

function FramedRack({ autoRotate, interactive }: { autoRotate: boolean; interactive: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;

    const frame = () => {
      const root = group.current;
      if (!root) return false;
      const box = new THREE.Box3().setFromObject(root);
      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);
      if (sphere.radius <= 0.001) return false;

      const fov = (persp.fov * Math.PI) / 180;
      const aspect = Math.max(0.5, size.width / Math.max(1, size.height));
      const fit = sphere.radius / Math.sin(fov / 2);
      const dist = Math.max(fit, fit / aspect) * 1.45;

      persp.position.set(
        sphere.center.x + dist * 0.16,
        sphere.center.y + dist * 0.48,
        sphere.center.z + dist * 0.88,
      );
      persp.near = dist / 50;
      persp.far = dist * 24;
      persp.lookAt(sphere.center);
      persp.updateProjectionMatrix();
      return true;
    };

    if (frame()) return;
    const id = requestAnimationFrame(() => {
      frame();
    });
    return () => cancelAnimationFrame(id);
  }, [camera, size]);

  useFrame((_, delta) => {
    if (interactive || !autoRotate || !group.current) return;
    group.current.rotation.y += delta * 0.28;
  });

  return (
    <group ref={group}>
      <TrueRackModel />
    </group>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.82} />
      <hemisphereLight args={["#f3eee4", "#2a2a2e", 0.55]} />
      <directionalLight position={[2.6, 3.1, 1.8]} intensity={1.55} color="#f3eee4" />
      <directionalLight position={[-2.4, 1.4, -1.6]} intensity={0.38} color="#AD3211" />
      <spotLight
        position={[0.2, 3.8, 1.2]}
        intensity={0.85}
        angle={0.55}
        penumbra={0.7}
        color="#fff4e8"
      />
    </>
  );
}

type ProductSpinCanvasProps = {
  autoRotate: boolean;
  interactive?: boolean;
};

export default function ProductSpinCanvas({
  autoRotate,
  interactive = false,
}: ProductSpinCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0.35, 2.15, 4.85], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      style={{
        background: "transparent",
        touchAction: interactive ? "none" : "auto",
        cursor: interactive ? "grab" : "default",
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <SceneLights />
      <Suspense fallback={null}>
        <FramedRack autoRotate={autoRotate} interactive={interactive} />
        <ContactShadows
          position={[0, -0.12, 0]}
          opacity={0.34}
          scale={6}
          blur={2.8}
          far={1.8}
          color="#000000"
        />
      </Suspense>
      {interactive ? (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate
          autoRotate={autoRotate}
          autoRotateSpeed={0.55}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.15}
          target={[0, 0, 0]}
        />
      ) : null}
    </Canvas>
  );
}
