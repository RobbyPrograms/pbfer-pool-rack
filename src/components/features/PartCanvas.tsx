"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { readDeviceProfile } from "@/lib/device";
import { Studio } from "./Studio";

const center = new THREE.Vector3();
const sphere = new THREE.Sphere();

type ControlsRef = {
  current: OrbitControlsImpl | null;
};

const PRECISION_STOP_MOTION_END = 3.5;

function Model({
  url,
  controls,
}: {
  url: string;
  controls: ControlsRef;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const playbackAnimations = useMemo(() => {
    if (url !== "/models/stop-mechanism.glb") return animations;

    return animations.map((animation) => {
      const trimmed = animation.clone();
      trimmed.tracks = trimmed.tracks.map((track) =>
        track.clone().trim(0, PRECISION_STOP_MOTION_END),
      );
      trimmed.resetDuration();
      return trimmed;
    });
  }, [animations, url]);
  const { actions } = useAnimations(playbackAnimations, group);
  const { camera, size } = useThree();

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        if (!(material instanceof THREE.MeshStandardMaterial)) continue;
        if (
          url === "/models/shoulder-screw.glb" &&
          material.name === "satin finish stainless steel"
        ) {
          material.color.set("#85898c");
          material.metalness = 0.65;
          material.roughness = 0.38;
          material.envMapIntensity = 0.35;
        } else if (
          url === "/models/stop-mechanism.glb" &&
          material.name === "black medium gloss plastic"
        ) {
          material.color.set("#282828");
          material.metalness = 0;
          material.roughness = 0.25;
          material.envMapIntensity = 0.25;
        } else {
          material.envMapIntensity = material.metalness > 0.5 ? 0.9 : 1.15;
        }
        material.needsUpdate = true;
      }
    });
  }, [scene, url]);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (url === "/models/stop-mechanism.glb") {
        action?.setLoop(THREE.LoopPingPong, Infinity);
      }
      action?.reset().fadeIn(0.2).play();
    });
    return () => {
      Object.values(actions).forEach((action) => action?.fadeOut(0.1));
    };
  }, [actions]);

  useLayoutEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    let frameId = 0;

    const frame = () => {
      const root = group.current;
      if (!root) return false;
      root.position.set(0, 0, 0);
      root.rotation.set(0, 0, 0);
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      if (box.isEmpty()) return false;
      box.getCenter(center);
      if (url === "/models/stop-mechanism.glb") {
        const pivot = new THREE.Vector3(0, 0, 0.0142875);
        scene.localToWorld(pivot);
        const pivotRotation = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          THREE.MathUtils.degToRad(-30),
        );
        root.quaternion.copy(pivotRotation);
        root.position
          .copy(pivot)
          .sub(center)
          .sub(pivot.clone().applyQuaternion(pivotRotation));
      } else {
        root.position.copy(center).multiplyScalar(-1);
      }
      root.updateMatrixWorld(true);

      new THREE.Box3().setFromObject(root).getBoundingSphere(sphere);
      if (sphere.radius <= 0.001) return false;
      const viewTarget = new THREE.Vector3();
      if (url === "/models/stop-mechanism.glb") {
        viewTarget.set(0, 0, 0.0142875);
        scene.localToWorld(viewTarget);
      }

      const fov = (persp.fov * Math.PI) / 180;
      const aspect = Math.max(0.5, size.width / Math.max(1, size.height));
      const framingRadius =
        url === "/models/stop-mechanism.glb" ? sphere.radius * 0.24 : sphere.radius;
      const fit = framingRadius / Math.sin(fov / 2);
      const framing =
        url === "/models/shoulder-screw.glb"
          ? 1.38
          : url === "/models/stop-mechanism.glb"
            ? 1.25
            : 1.6;
      const dist = Math.max(fit, fit / aspect) * framing;
      const orbit = controls.current;
      if (url === "/models/stop-mechanism.glb" && !orbit) return false;
      const precisionStopCameraDistance = 0.0546067635 / Math.tan(fov / 2);
      if (url === "/models/stop-mechanism.glb") {
        persp.up.set(-0.738, 0, 0.674);
        persp.setViewOffset(
          size.width,
          size.height,
          size.width * 0.03,
          size.height * 0.36,
          size.width,
          size.height,
        );
        persp.position.set(
          viewTarget.x,
          viewTarget.y + precisionStopCameraDistance,
          viewTarget.z,
        );
      } else {
        persp.clearViewOffset();
        persp.position.set(dist * 0.42, dist * 0.28, dist);
      }
      persp.near = Math.max(0.001, dist / 100);
      persp.far = dist * 20;
      persp.lookAt(viewTarget);
      persp.updateProjectionMatrix();
      if (orbit) {
        orbit.target.copy(viewTarget);
        orbit.minDistance =
          url === "/models/stop-mechanism.glb"
            ? precisionStopCameraDistance * 0.35
            : sphere.radius * 1.15;
        orbit.maxDistance =
          url === "/models/stop-mechanism.glb"
            ? precisionStopCameraDistance * 4
            : dist * 3;
        orbit.update();
        orbit.saveState();
      }
      return true;
    };

    const frameWhenReady = () => {
      if (!frame()) frameId = requestAnimationFrame(frameWhenReady);
    };

    frameWhenReady();
    return () => cancelAnimationFrame(frameId);
  }, [camera, controls, scene, size.width, size.height, url]);

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function Lights({
  shoulderScrew,
  precisionStop,
}: {
  shoulderScrew: boolean;
  precisionStop: boolean;
}) {
  const brightness = shoulderScrew ? 0.35 : precisionStop ? 0.4 : 1;
  return (
    <>
      <Studio
        environmentIntensity={
          shoulderScrew ? 0.45 : precisionStop ? 0.5 : 1.6
        }
      />
      <ambientLight intensity={shoulderScrew ? 0.3 : precisionStop ? 0.25 : 0.45} />
      <hemisphereLight
        args={[
          "#fff4ea",
          "#2a2a30",
          shoulderScrew ? 0.35 : precisionStop ? 0.3 : 0.55,
        ]}
      />
      <directionalLight
        position={[3.2, 4.4, 2.6]}
        intensity={2.8 * brightness}
        color="#fff8f2"
      />
      <directionalLight
        position={[-3.4, 1.8, 2]}
        intensity={1.35 * brightness}
        color="#eef0f4"
      />
      <directionalLight
        position={[0.4, 1.6, -3.2]}
        intensity={0.9 * brightness}
        color="#ffd2c2"
      />
      <directionalLight
        position={[-3.4, 1.8, 2.6]}
        intensity={1.1 * brightness}
        color="#c7c9ce"
      />
      <directionalLight
        position={[0, -3, 2]}
        intensity={2.8 * brightness}
        color="#c7c9ce"
      />
    </>
  );
}

export default function PartCanvas({ url }: { url: string }) {
  const [autoRotate, setAutoRotate] = useState(true);
  const controls = useRef<OrbitControlsImpl>(null);
  const isShoulderScrew = url === "/models/shoulder-screw.glb";
  const isPrecisionStop = url === "/models/stop-mechanism.glb";

  useEffect(() => {
    setAutoRotate(!readDeviceProfile().reducedMotion);
  }, []);

  useEffect(() => {
    if (!isPrecisionStop) return;

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
  }, [isPrecisionStop]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      resize={{ scroll: false, offsetSize: true }}
      camera={{ position: [0.4, 0.6, 2.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        touchAction: "pan-y",
        cursor: isPrecisionStop ? "default" : "grab",
      }}
    >
      <Lights
        shoulderScrew={isShoulderScrew}
        precisionStop={isPrecisionStop}
      />
      <Suspense fallback={null}>
        <Model url={url} controls={controls} />
      </Suspense>
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 0, 0]}
        enablePan={false}
        enableRotate={!isPrecisionStop}
        enableZoom
        zoomToCursor
        autoRotate={isPrecisionStop ? false : autoRotate}
        autoRotateSpeed={0.8}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={isPrecisionStop ? 0 : 0.1}
        maxPolarAngle={isPrecisionStop ? Math.PI : Math.PI - 0.1}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/shoulder-screw.glb");
useGLTF.preload("/models/stop-mechanism.glb");
