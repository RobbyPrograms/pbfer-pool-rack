"use client";

import { Center, useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export const TRUE_RACK_GLB = "/models/true-rack-open.glb";

type TrueRackModelProps = {
  scale?: number;
};

export function TrueRackModel({ scale = 4.4 }: TrueRackModelProps) {
  const { scene } = useGLTF(TRUE_RACK_GLB);
  const prepared = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      for (const mat of materials) {
        if (!(mat instanceof THREE.MeshStandardMaterial)) continue;
        const lum = mat.color.r * 0.3 + mat.color.g * 0.5 + mat.color.b * 0.2;
        if (lum > 0.65) {
          mat.metalness = 0.82;
          mat.roughness = 0.22;
          mat.envMapIntensity = 1.15;
        } else {
          mat.metalness = 0.16;
          mat.roughness = 0.58;
          mat.envMapIntensity = 0.4;
        }
      }
    });
    return root;
  }, [scene]);

  return (
    <group scale={scale}>
      <Center>
        <primitive object={prepared} />
      </Center>
    </group>
  );
}

useGLTF.preload(TRUE_RACK_GLB);
