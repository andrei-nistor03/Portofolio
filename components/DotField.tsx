"use client";

import { useEffect, useRef } from "react";
import { sceneState } from "@/lib/sceneState";

// Halftone dot field on canvas 2D. Dot size comes from slow value noise plus a
// soft bulge around the cursor; dots inside the bulge pick up the violet accent.
// Cheap at this density and decoupled from any WebGL context.

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export default function DotField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const gap = touch ? 20 : 18;
    let raf = 0;
    let visible = true;
    let t = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const rect = canvas.getBoundingClientRect();
      const pe = sceneState.pointerEased;
      const px = ((pe.x + 1) / 2) * window.innerWidth - rect.left;
      const py = ((pe.y + 1) / 2) * window.innerHeight - rect.top;
      const reach = Math.min(w, 900) * 0.28;

      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const n = noise(x * 0.006 + t * 0.12, y * 0.006 - t * 0.08);
          let r = Math.max(0, n - 0.42) * 3.4;
          let hot = 0;
          if (!touch) {
            const dx = x - px;
            const dy = y - py;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < reach) {
              hot = 1 - d / reach;
              hot = hot * hot * (3 - 2 * hot);
              r += hot * 4.2;
            }
          }
          if (r < 0.35) continue;
          ctx.fillStyle = hot > 0.15 ? `rgba(138,92,255,${0.35 + hot * 0.6})` : "rgba(13,13,13,0.22)";
          ctx.beginPath();
          ctx.arc(x, y, Math.min(r, gap * 0.42), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      t += 1 / 60;
      draw();
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduced) loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
