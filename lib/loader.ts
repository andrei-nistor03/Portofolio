"use client";

// Tiny event bus between the page and the Loader overlay.
//  - navigateTo(id): the Loader covers the page, jumps to the section and
//    reveals it, instead of a long smooth scroll.
//  - onIntroComplete(cb): fires once the first-load loader has left, so intro
//    animations (hero, nav) play when they are actually visible.

export type LoadingStage = "boot" | "active" | "prime";

const NAVIGATE = "an:navigate";
const INTRO = "an:intro-complete";

export const loaderState = { introDone: false, busy: false };

export function navigateTo(id: string) {
  window.dispatchEvent(new CustomEvent<string>(NAVIGATE, { detail: id }));
}

export function onNavigate(cb: (id: string) => void) {
  const h = (e: Event) => cb((e as CustomEvent<string>).detail);
  window.addEventListener(NAVIGATE, h);
  return () => window.removeEventListener(NAVIGATE, h);
}

export function completeIntro() {
  loaderState.introDone = true;
  window.dispatchEvent(new Event(INTRO));
}

export function onIntroComplete(cb: () => void) {
  if (loaderState.introDone) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener(INTRO, h, { once: true });
  return () => window.removeEventListener(INTRO, h);
}
