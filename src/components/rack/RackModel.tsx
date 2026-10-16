"use client";

import { useMemo } from "react";
import * as THREE from "three";

const SIDE = 2.15;
const H = SIDE * Math.sin(Math.PI / 3);
const RAIL_W = 0.14;
const RAIL_H = 0.1;
const PIN_R = 0.08;
const SEAT = PIN_R + 0.012;

/** Open caret in XZ. Apex away from a +Z camera so it reads as "^". No bottom rail. */
const APEX = new THREE.Vector3(0, 0, (-2 / 3) * H + 0.12);
const LEFT_FOOT = new THREE.Vector3(-SIDE / 2, 0, H / 3 + 0.12);
const RIGHT_FOOT = new THREE.Vector3(SIDE / 2, 0, H / 3 + 0.12);

function railFromApex(foot: THREE.Vector3) {
  const dx = foot.x - APEX.x;
  const dz = foot.z - APEX.z;
  const len = Math.hypot(dx, dz);
  const usable = Math.max(0.5, len - SEAT);
  const dir = new THREE.Vector3(dx / len, 0, dz / len);
  const start = APEX.clone().addScaledVector(dir, SEAT);
  const mid = start.clone().addScaledVector(dir, usable / 2);
  const angleY = Math.atan2(-dz, dx);
  return { mid, angleY, length: usable, dir };
}

const RAILS = [railFromApex(LEFT_FOOT), railFromApex(RIGHT_FOOT)] as const;

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
        color: "#AD3211",
        metalness: 0.15,
        roughness: 0.4,
        emissive: "#AD3211",
        emissiveIntensity: 0.38,
      }),
    [],
  );

  return (
    <group rotation={[0.16, 0.38, 0]}>
      {RAILS.map((rail, i) => {
        const pos = rail.mid.clone().addScaledVector(rail.dir, explode * 0.22);
        return (
          <group key={i} position={pos} rotation={[0, rail.angleY, 0]}>
            <mesh material={nylon} castShadow>
              <boxGeometry args={[rail.length, RAIL_H, RAIL_W]} />
            </mesh>
            <mesh
              position={[0, RAIL_H / 2 + 0.005, 0]}
              material={rim}
            >
              <boxGeometry args={[rail.length * 0.9, 0.012, RAIL_W * 0.36]} />
            </mesh>
          </group>
        );
      })}
      <mesh position={APEX} material={rim}>
        <cylinderGeometry args={[PIN_R, PIN_R, RAIL_H + 0.03, 16]} />
      </mesh>
    </group>
  );
}
