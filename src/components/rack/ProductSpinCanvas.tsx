"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { TrueRackModel } from "./TrueRackModel";

type ControlsRef = {
  current: OrbitControlsImpl | null;
};

function FramedRack({
  autoRotate,
  interactive,
  hero,
  controls,
}: {
  autoRotate: boolean;
  interactive: boolean;
  hero: boolean;
  controls: ControlsRef;
}) {
  const group = useRef<THREE.Group>(null);
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    let frameId = 0;

    const frame = () => {
      const root = group.current;
      if (!root) {
        frameId = requestAnimationFrame(frame);
        return;
      }
      const box = new THREE.Box3().setFromObject(root);
      const sphere = new THREE.Sphere();
      box.getBoundingSphere(sphere);
      if (sphere.radius <= 0.001) {
        frameId = requestAnimationFrame(frame);
        return;
      }

      const fov = (persp.fov * Math.PI) / 180;
      const aspect = Math.max(0.5, size.width / Math.max(1, size.height));
      const fit = sphere.radius / Math.sin(fov / 2);
      const dist = Math.max(fit, fit / aspect) * (hero ? 1.04 : 1.45);

      persp.position.set(
        sphere.center.x + dist * 0.16,
        sphere.center.y + dist * 0.48,
        sphere.center.z + dist * 0.88,
      );
      persp.near = dist / 50;
      persp.far = dist * 24;
      persp.lookAt(sphere.center);
      if (hero && controls.current) {
        controls.current.target.copy(sphere.center);
        controls.current.minDistance = sphere.radius * 1.15;
        controls.current.maxDistance = dist * 3;
        controls.current.update();
        controls.current.saveState();
      }
      persp.updateProjectionMatrix();
    };

    frame();
    return () => cancelAnimationFrame(frameId);
  }, [camera, hero, size]);

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

function SceneLights({ hero }: { hero: boolean }) {
  return (
    <>
      <ambientLight intensity={0.82} />
      <hemisphereLight args={["#f3eee4", "#2a2a2e", 0.55]} />
      <directionalLight position={[2.6, 3.1, 1.8]} intensity={1.55} color="#f3eee4" />
      <directionalLight position={[-2.4, 1.4, -1.6]} intensity={0.38} color="#AD3211" />
      {hero ? (
        <directionalLight
          position={[-3.4, 1.8, 2.6]}
          intensity={1.1}
          color="#c7c9ce"
        />
      ) : null}
      {hero ? (
        <directionalLight
          position={[0, -3, 2]}
          intensity={2.8}
          color="#c7c9ce"
        />
      ) : null}
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
  hero?: boolean;
};

export default function ProductSpinCanvas({
  autoRotate,
  interactive = false,
  hero = false,
}: ProductSpinCanvasProps) {
  const controls = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (!hero || !interactive) return;

    let attachFrame = 0;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let animationFrame = 0;
    let resetting = false;
    let orbit: OrbitControlsImpl | null = null;
    let previousDistance = 0;

    const scheduleReset = () => {
      if (!orbit) return;
      if (resetTimer) clearTimeout(resetTimer);
      if (animationFrame) cancelAnimationFrame(animationFrame);

      resetTimer = setTimeout(() => {
        if (!orbit) return;
        resetting = true;
        const startPosition = orbit.object.position.clone();
        const startTarget = orbit.target.clone();
        const endPosition = orbit.position0.clone();
        const endTarget = orbit.target0.clone();
        const startTime = performance.now();
        const duration = 500;

        const animateReset = (now: number) => {
          if (!orbit) return;
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          orbit.object.position.lerpVectors(startPosition, endPosition, eased);
          orbit.target.lerpVectors(startTarget, endTarget, eased);
          orbit.update();

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animateReset);
          } else {
            resetting = false;
            previousDistance = orbit.getDistance();
          }
        };

        animationFrame = requestAnimationFrame(animateReset);
      }, 3000);
    };

    const resetAfterZoom = () => {
      if (!orbit) return;
      const currentDistance = orbit.getDistance();
      const zoomChanged = Math.abs(currentDistance - previousDistance) > 0.001;
      previousDistance = currentDistance;
      if (zoomChanged && !resetting) scheduleReset();
    };

    const pauseReset = () => {
      if (resetTimer) clearTimeout(resetTimer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      resetting = false;
    };

    const attach = () => {
      orbit = controls.current;
      if (!orbit) {
        attachFrame = requestAnimationFrame(attach);
        return;
      }
      previousDistance = orbit.getDistance();
      orbit.saveState();
      orbit.addEventListener("change", resetAfterZoom);
      orbit.addEventListener("start", pauseReset);
      orbit.addEventListener("end", scheduleReset);
    };

    attachFrame = requestAnimationFrame(attach);
    return () => {
      cancelAnimationFrame(attachFrame);
      orbit?.removeEventListener("change", resetAfterZoom);
      orbit?.removeEventListener("start", pauseReset);
      orbit?.removeEventListener("end", scheduleReset);
      if (resetTimer) clearTimeout(resetTimer);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [hero, interactive]);

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
      <SceneLights hero={hero} />
      <Suspense fallback={null}>
        <FramedRack
          autoRotate={autoRotate}
          interactive={interactive}
          hero={hero}
          controls={controls}
        />
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
          ref={controls}
          enablePan={false}
          enableZoom={hero}
          zoomToCursor={hero}
          enableRotate
          autoRotate={autoRotate}
          autoRotateSpeed={0.55}
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={hero ? 0.1 : Math.PI / 4}
          maxPolarAngle={hero ? Math.PI - 0.1 : Math.PI / 2.15}
          target={[0, 0, 0]}
        />
      ) : null}
    </Canvas>
  );
}
