"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { isScrollLocked, lenisRef } from "@/lib/lenis";
import { sceneState } from "@/lib/sceneState";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: reduced ? 0.1 : 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !reduced,
    });
    lenisRef.current = lenis;
    if (isScrollLocked()) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
      // Ease the pointer here once per frame for every consumer.
      const p = sceneState.pointer;
      const e = sceneState.pointerEased;
      e.x += (p.x - e.x) * 0.08;
      e.y += (p.y - e.y) * 0.08;
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onMove = (ev: PointerEvent) => {
      sceneState.pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = (ev.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Fonts change line metrics; re-measure triggers once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
