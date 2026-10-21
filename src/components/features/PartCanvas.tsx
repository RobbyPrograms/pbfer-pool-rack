"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { readDeviceProfile } from "@/lib/device";
import { Studio } from "./Studio";

const center = new THREE.Vector3();
const sphere = new THREE.Sphere();

function Model({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);
  const { camera, size, controls } = useThree();

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        material.envMapIntensity = material.metalness > 0.5 ? 1.5 : 1.15;
        material.needsUpdate = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action?.reset().fadeIn(0.2).play();
    });
    return () => {
      Object.values(actions).forEach((action) => action?.fadeOut(0.1));
    };
  }, [actions]);

  useLayoutEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    const orbit = controls as OrbitControlsImpl | null;

    const frame = () => {
      const root = group.current;
      if (!root) return false;
      root.position.set(0, 0, 0);
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      if (box.isEmpty()) return false;
      box.getCenter(center);
      root.position.copy(center).multiplyScalar(-1);
      root.updateMatrixWorld(true);

      new THREE.Box3().setFromObject(root).getBoundingSphere(sphere);
      if (sphere.radius <= 0.001) return false;

      const fov = (persp.fov * Math.PI) / 180;
      const aspect = Math.max(0.5, size.width / Math.max(1, size.height));
      const fit = sphere.radius / Math.sin(fov / 2);
      const dist = Math.max(fit, fit / aspect) * 1.6;
      persp.position.set(dist * 0.42, dist * 0.28, dist);
      persp.near = Math.max(0.001, dist / 100);
      persp.far = dist * 20;
      persp.lookAt(0, 0, 0);
      persp.updateProjectionMatrix();
      if (orbit) {
        orbit.target.set(0, 0, 0);
        orbit.update();
      }
      return true;
    };

    if (frame()) return;
    const id = requestAnimationFrame(() => {
      frame();
    });
    return () => cancelAnimationFrame(id);
  }, [camera, controls, scene, size]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function Lights() {
  return (
    <>
      <Studio />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#fff4ea", "#2a2a30", 0.55]} />
      <directionalLight position={[3.2, 4.4, 2.6]} intensity={2.8} color="#fff8f2" />
      <directionalLight position={[-3.4, 1.8, 2]} intensity={1.35} color="#eef0f4" />
      <directionalLight position={[0.4, 1.6, -3.2]} intensity={0.9} color="#ffd2c2" />
    </>
  );
}

export default function PartCanvas({ url }: { url: string }) {
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    setAutoRotate(!readDeviceProfile().reducedMotion);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0.4, 0.6, 2.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.25;
      }}
      style={{ background: "transparent", touchAction: "none", cursor: "grab" }}
    >
      <Lights />
      <Suspense fallback={null}>
        <Model url={url} />
      </Suspense>
      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        enablePan={false}
        enableZoom={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.6}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/shoulder-screw.glb");
useGLTF.preload("/models/stop-mechanism.glb");
