"use client";

import { useEffect, useState, type RefObject } from "react";

// True while the element is within `rootMargin` of the viewport. Used to pause
// WebGL render loops off-screen.
export function useInView(ref: RefObject<Element | null>, rootMargin = "25% 0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
