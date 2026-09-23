"use client";

import { useMemo } from "react";
import * as THREE from "three";

const SIDE = 2.05;
const H = SIDE * Math.sqrt(3) / 2;
const RAIL_W = 0.14;
const RAIL_H = 0.1;
const PIN_R = 0.075;
const INSET = 0.18;

/** Equilateral triangle in XZ, apex away from a +Z camera so it reads upright. */
const VERTS = [
  new THREE.Vector3(0, 0, (-2 / 3) * H),
  new THREE.Vector3(-SIDE / 2, 0, H / 3),
  new THREE.Vector3(SIDE / 2, 0, H / 3),
] as const;

function sideGeometry(index: 0 | 1 | 2) {
  const a = VERTS[index];
  const b = VERTS[(index + 1) % 3];
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len = Math.hypot(dx, dz);
  const mid = new THREE.Vector3((a.x + b.x) / 2, 0, (a.z + b.z) / 2);
  const angleY = Math.atan2(-dz, dx);
  const outward = new THREE.Vector3(-dz, 0, dx).normalize();
  if (outward.dot(mid) < 0) outward.negate();
  return {
    mid,
    angleY,
    length: Math.max(0.4, len - INSET * 2),
    outward,
  };
}

const SIDES = [sideGeometry(0), sideGeometry(1), sideGeometry(2)] as const;

type RackModelProps = {
  explode?: number;
};

export function RackModel({ explode = 0 }: RackModelProps) {
  const nylon = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1a1e",
        metalness: 0.18,
        roughness: 0.62,
        envMapIntensity: 0.25,
      }),
    [],
  );

  const rim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FF5A1F",
        metalness: 0.15,
        roughness: 0.4,
        emissive: "#FF5A1F",
        emissiveIntensity: 0.38,
      }),
    [],
  );

  return (
    <group rotation={[0.12, 0.42, 0]}>
      {SIDES.map((side, i) => {
        const pos = side.mid
          .clone()
          .addScaledVector(side.outward, explode * 0.62);
        return (
          <group key={`rail-${i}`} position={pos} rotation={[0, side.angleY, 0]}>
            <mesh material={nylon} castShadow>
              <boxGeometry args={[side.length, RAIL_H, RAIL_W]} />
            </mesh>
            <mesh
              position={[0, RAIL_H / 2 + 0.005, -RAIL_W * 0.18]}
              material={rim}
            >
              <boxGeometry args={[side.length * 0.92, 0.012, RAIL_W * 0.38]} />
            </mesh>
          </group>
        );
      })}
      {VERTS.map((v, i) => (
        <mesh key={`hinge-${i}`} position={v} material={rim}>
          <cylinderGeometry args={[PIN_R, PIN_R, RAIL_H + 0.025, 16]} />
        </mesh>
      ))}
    </group>
  );
}
