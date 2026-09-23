"use client";

import { useMemo } from "react";
import * as THREE from "three";

const L = 2.15;
const H = L * Math.sqrt(3) / 2;
const RAIL_W = 0.16;
const RAIL_H = 0.11;
const BASE_Z = -H / 3;
const APEX_Z = (2 * H) / 3;

type RackModelProps = {
  explode?: number;
};

function railPose(index: 0 | 1 | 2, explode: number) {
  const out = explode * 0.55;
  if (index === 0) {
    return {
      position: new THREE.Vector3(0, 0, BASE_Z - out),
      rotation: 0,
    };
  }
  if (index === 1) {
    return {
      position: new THREE.Vector3(-L / 4 - out * 0.86, 0, H / 6 + out * 0.5),
      rotation: Math.PI / 3,
    };
  }
  return {
    position: new THREE.Vector3(L / 4 + out * 0.86, 0, H / 6 + out * 0.5),
    rotation: -Math.PI / 3,
  };
}

const CORNERS = [
  new THREE.Vector3(0, 0, APEX_Z),
  new THREE.Vector3(-L / 2, 0, BASE_Z),
  new THREE.Vector3(L / 2, 0, BASE_Z),
];

export function RackModel({ explode = 0 }: RackModelProps) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1c1c20",
        metalness: 0.72,
        roughness: 0.38,
        envMapIntensity: 0.4,
      }),
    [],
  );

  const rim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FF5A1F",
        metalness: 0.2,
        roughness: 0.45,
        emissive: "#FF5A1F",
        emissiveIntensity: 0.35,
      }),
    [],
  );

  const rails: Array<{ i: 0 | 1 | 2 }> = [{ i: 0 }, { i: 1 }, { i: 2 }];

  return (
    <group rotation={[0.38, 0.35, 0]}>
      {rails.map(({ i }) => {
        const pose = railPose(i, explode);
        return (
          <group key={i} position={pose.position} rotation={[0, pose.rotation, 0]}>
            <mesh material={material} castShadow>
              <boxGeometry args={[L, RAIL_H, RAIL_W]} />
            </mesh>
            <mesh position={[0, RAIL_H / 2 + 0.006, RAIL_W * 0.12]} material={rim}>
              <boxGeometry args={[L * 0.94, 0.012, RAIL_W * 0.42]} />
            </mesh>
          </group>
        );
      })}
      {CORNERS.map((corner, i) => (
        <mesh
          key={`pin-${i}`}
          position={[
            corner.x * (1 + explode * 0.12),
            0,
            corner.z * (1 + explode * 0.12),
          ]}
          material={rim}
        >
          <cylinderGeometry args={[0.055, 0.055, RAIL_H + 0.02, 12]} />
        </mesh>
      ))}
    </group>
  );
}
