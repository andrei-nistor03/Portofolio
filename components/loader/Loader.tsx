"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { lenisRef, setScrollLocked } from "@/lib/lenis";
import { completeIntro, loaderState, onNavigate, type LoadingStage } from "@/lib/loader";
import { useIsTouch, useReducedMotion } from "@/lib/useMediaQuery";
import LoadingVisual from "./LoadingVisual";

const wait = (s: number) => new Promise<void>((r) => gsap.delayedCall(s, r));
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = lenisRef.current;
  if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
  else window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  ScrollTrigger.update();
}

// One overlay for both jobs:
//  1. First load: covers the page from the very first paint (it is server
//     rendered visible), fills as fonts and assets finish, then lifts away.
//  2. Navigation: slides up over the page, fills quickly, jumps to the target
//     section behind the cover, then lifts away. A short loader instead of a
//     long scroll through every pinned section in between.
export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  // Navigation runs mount the overlay hidden, then slide it in from below.
  const startHidden = useRef(false);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState<LoadingStage>("boot");
  const [exploding, setExploding] = useState(false);
  // Remounting the visual resets the dots after an exit burst.
  const [run, setRun] = useState(0);

  const progressTo = (value: number, duration: number) =>
    new Promise<void>((resolve) => {
      const obj = { v: progressRef.current };
      gsap.to(obj, {
        v: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          progressRef.current = obj.v;
        },
        onComplete: resolve,
      });
    });

  // onLift fires the moment the cover starts to move, so whatever is
  // underneath (the hero intro) is already animating as it is revealed.
  const exit = async (quick: boolean, onLift?: () => void) => {
    setStage("prime");
    setExploding(true);
    await wait(quick ? 0.25 : 0.35);
    const el = rootRef.current!;
    onLift?.();
    if (reduced) await gsap.to(el, { opacity: 0, duration: 0.3, ease: "power2.out" });
    else await gsap.to(el, { yPercent: -100, duration: quick ? 0.7 : 0.85, ease: "expo.inOut" });
    setVisible(false);
    gsap.set(el, { clearProps: "opacity" });
  };

  // 1. First load
  useEffect(() => {
    setScrollLocked(true);
    window.scrollTo(0, 0);
    let cancelled = false;

    const loaded = new Promise<void>((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", () => r(), { once: true });
    });
    const fonts = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
    const minimum = wait(reduced ? 0.15 : 0.9);

    (async () => {
      setStage("active");
      // Creep toward 85% while the real work finishes, then complete.
      const creep = progressTo(85, reduced ? 0.15 : 1.1);
      await Promise.all([loaded, fonts, minimum]);
      await creep;
      await progressTo(100, 0.3);
      if (cancelled) return;
      await exit(false, () => {
        if (cancelled) return;
        setScrollLocked(false);
        completeIntro();
      });
      if (cancelled) return;
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Navigation transitions
  useEffect(
    () =>
      onNavigate(async (id) => {
        if (loaderState.busy || !loaderState.introDone) return;
        loaderState.busy = true;
        setScrollLocked(true);

        progressRef.current = 0;
        setExploding(false);
        setStage("active");
        startHidden.current = true;
        setRun((r) => r + 1);
        setVisible(true);
        await nextFrame();
        await nextFrame();

        const el = rootRef.current!;
        if (reduced) {
          gsap.set(el, { yPercent: 0, opacity: 0, visibility: "visible" });
          await gsap.to(el, { opacity: 1, duration: 0.2 });
        } else {
          gsap.set(el, { yPercent: 100, opacity: 1, visibility: "visible" });
          await gsap.to(el, { yPercent: 0, duration: 0.6, ease: "expo.inOut" });
        }

        await progressTo(100, reduced ? 0.2 : 0.65);
        jumpTo(id);
        // Let scrubbed timelines catch up behind the cover.
        await wait(0.15);

        await exit(true);
        setScrollLocked(false);
        loaderState.busy = false;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reduced],
  );

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] overflow-hidden bg-paper"
      style={startHidden.current ? { visibility: "hidden" } : undefined}
      aria-hidden="true"
    >
      <LoadingVisual
        key={run}
        progressRef={progressRef}
        stage={stage}
        exploding={exploding}
        reducedMotion={reduced}
        isTouch={isTouch}
      />
    </div>
  );
}
