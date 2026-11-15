"use client";

import type Lenis from "lenis";

export const lenisRef: { current: Lenis | null } = { current: null };

// The loader locks scrolling while it covers the page. The lock may be set
// before Lenis exists (first load), so SmoothScroll reads it on init.
let locked = false;
export const isScrollLocked = () => locked;
export function setScrollLocked(value: boolean) {
  locked = value;
  if (value) lenisRef.current?.stop();
  else lenisRef.current?.start();
}

// Plain smooth scroll, for short in-section jumps (e.g. the skills index).
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}
