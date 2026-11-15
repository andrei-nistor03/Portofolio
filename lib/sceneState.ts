"use client";

// Plain mutable state read inside useFrame / rAF loops. ScrollTrigger and
// pointer listeners write here so per-frame values never touch React state.
export const sceneState = {
  studioProgress: 0,
  // Camera dive into the door, remapped from studioProgress.
  studioDive: 0,
  pointer: { x: 0, y: 0 },
  pointerEased: { x: 0, y: 0 },
};
