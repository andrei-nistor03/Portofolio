"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import WallsModel from "./WallsModel";
import PulsatingLight from "./PulsatingLight";
import CameraRig from "./CameraRig";
import { useIsTouch, useReducedMotion } from "@/lib/useMediaQuery";
import { markSceneReady } from "@/lib/loader";

// Mounted inside the model's Suspense boundary, so it only exists once the GLB
// and texture have resolved. The first frame after that compiles the shaders,
// uploads the texture and bakes the environment; by the third the walls are
// genuinely on the canvas, which is what the loader waits for.
const READY_AFTER_FRAMES = 3;
function SceneReady({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === READY_AFTER_FRAMES) onReady();
  });
  return null;
}

// Starts and stops the render loop. Passing `frameloop` as a Canvas prop is not
// enough: switching it from "never" to "always" only updates the store, and
// R3F restarts its RAF loop solely on invalidate(). The scene mounts off-screen
// (inactive), so on the first scroll-in nothing kicked the loop and the stage
// stayed blank until a resize or pointer event happened to invalidate it.
function FrameloopDriver({ active }: { active: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    setFrameloop(active ? "always" : "never");
    if (active) invalidate();
  }, [active, setFrameloop, invalidate]);
  return null;
}

// The LINKHAUS walls, relit for a dark stage. Ported from the studio hero.
export default function StudioScene({ active }: { active: boolean }) {
  const isTouch = useIsTouch();
  const reduced = useReducedMotion();
  const heavy = !isTouch && !reduced;
  // Render continuously (off-screen, behind the loader) until the model has
  // been drawn, then only while the section is on screen.
  const [ready, setReady] = useState(false);

  return (
    <Canvas
      // Loop is driven by FrameloopDriver below (from the tall section's
      // visibility, not the sticky canvas).
      dpr={[1, heavy ? 1.75 : 1.25]}
      gl={{ antialias: !isTouch, alpha: true, powerPreference: "high-performance" }}
      shadows={heavy}
      className="!absolute inset-0"
      onCreated={({ gl }) => {
        // Let the browser restore the context if the GPU drops it.
        gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault());
      }}
    >
      <PerspectiveCamera makeDefault fov={35} position={[0, 0, 6]} near={0.1} far={20} />
      <fog attach="fog" args={["#0d0d0d", 3.8, 9.5]} />

      <ambientLight intensity={0.22} />
      <directionalLight
        position={[2.5, 3.5, 4]}
        intensity={1.25}
        castShadow={heavy}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        shadow-camera-near={0.1}
        shadow-camera-far={9}
        shadow-bias={-0.0015}
        shadow-normalBias={0.02}
      />
      <PulsatingLight />

      <Suspense fallback={null}>
        <WallsModel scale={1.3} position={[0, -0.05, 0]} rotation={[0.04, -0.55, 0.01]} />
        {heavy && (
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={0.8} color="#ffffff" position={[0, 3, 1]} scale={[8, 2, 1]} />
            <Lightformer intensity={0.45} color="#8a5cff" position={[-3, -1, -2]} scale={4} />
            <Lightformer intensity={0.2} color="#2b4bff" position={[3, 1, -1]} scale={3} />
          </Environment>
        )}
        {!ready && (
          <SceneReady
            onReady={() => {
              setReady(true);
              markSceneReady();
            }}
          />
        )}
      </Suspense>

      <CameraRig />
      <FrameloopDriver active={active || !ready} />
    </Canvas>
  );
}
