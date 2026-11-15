"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Pulls its child toward the cursor while hovered and springs back on leave.
// The hit area is padded so the pull starts slightly before the cursor
// reaches the element. Fine pointers only; off for reduced motion.
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const zone = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const z = zone.current;
      const el = inner.current;
      if (!z || !el) return;
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return;
      }
      const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.4)" });
      const onMove = (e: PointerEvent) => {
        const r = z.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      z.addEventListener("pointermove", onMove);
      z.addEventListener("pointerleave", onLeave);
      return () => {
        z.removeEventListener("pointermove", onMove);
        z.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: zone },
  );

  return (
    <span ref={zone} className={`-m-3 inline-block p-3 ${className}`}>
      <span ref={inner} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}
