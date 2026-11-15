"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { Project } from "@/lib/content";

const SLIDE_SECONDS = 1.8;

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}

// Looping showcase video. It only downloads once first needed and only plays
// while its preview is showing, so six videos never decode at the same time.
function VideoMedia({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (active) setArmed(true);
  }, [active]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !armed) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active, armed]);

  return (
    <video
      ref={ref}
      src={armed ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

// Photo set cycled with a crossfade and a slow push-in, only while visible.
function GalleryMedia({ images, alt, active }: { images: string[]; alt: string; active: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (active) setArmed(true);
  }, [active]);

  // Plain effect (not useGSAP): the cleanup must run on every deactivate so
  // the cycle stops and never stacks up across hovers.
  useEffect(
    () => {
      if (!armed || !active || !root.current) return;
      const slides = gsap.utils.toArray<HTMLElement>(".slide", root.current);
      if (slides.length < 2) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let i = Number(root.current!.dataset.index ?? 0);
      gsap.set(slides, { autoAlpha: 0, zIndex: 0 });
      gsap.set(slides[i], { autoAlpha: 1, zIndex: 1, scale: 1.08 });
      if (!reduced) gsap.to(slides[i], { scale: 1, duration: SLIDE_SECONDS + 0.8, ease: "none" });

      const next = () => {
        const cur = slides[i];
        i = (i + 1) % slides.length;
        root.current!.dataset.index = String(i);
        const nxt = slides[i];
        gsap.set(nxt, { zIndex: 2, scale: reduced ? 1 : 1.08 });
        gsap.set(cur, { zIndex: 1 });
        gsap.fromTo(nxt, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduced ? 0 : 0.6, ease: "power2.out" });
        if (!reduced) gsap.to(nxt, { scale: 1, duration: SLIDE_SECONDS + 0.8, ease: "none" });
        gsap.set(cur, { autoAlpha: 0, delay: 0.6 });
      };
      const timer = window.setInterval(next, SLIDE_SECONDS * 1000);
      return () => {
        window.clearInterval(timer);
        gsap.killTweensOf(slides);
      };
    },
    [armed, active],
  );

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden bg-ink">
      {armed &&
        images.map((src, i) => (
          <div key={src} className="slide absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes="(min-width: 768px) 320px, 100vw"
              className="object-cover"
            />
          </div>
        ))}
    </div>
  );
}

function Media({ p, active, className = "" }: { p: Project; active: boolean; className?: string }) {
  const light = isLight(p.accent);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        // Branded fallback shows while media loads (or if none exists).
        background: `radial-gradient(120% 90% at 85% 10%, ${p.accent} 0%, ${p.accent} 35%, ${
          light ? "#9fd13a" : "#0d0d0d"
        } 140%)`,
        color: light ? "#0d0d0d" : "#f5f3ee",
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        <span className="label opacity-70">{p.kind}</span>
        <span className="display text-[clamp(2.6rem,5vw,4.5rem)] leading-[0.85]">{p.name}</span>
      </div>
      {p.video && <VideoMedia src={p.video} active={active} />}
      {p.gallery && <GalleryMedia images={p.gallery} alt={`${p.name} lookbook`} active={active} />}
    </div>
  );
}

// Mobile: the inline media plays while it is on screen.
function InlineMedia({ p }: { p: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="md:hidden">
      <Media p={p} active={inView} className={p.gallery ? "aspect-[4/5] w-full" : "aspect-video w-full"} />
    </div>
  );
}

// Preview box size per media shape: 16:9 for site videos, 3:4 for photo sets.
function previewSize(p: Project | undefined) {
  const base = gsap.utils.clamp(320, 500, window.innerWidth * 0.32);
  if (p?.gallery) {
    const h = base * 0.82;
    return { width: (h * 3) / 4, height: h };
  }
  return { width: base, height: (base * 9) / 16 };
}

export default function WorkList({ items }: { items: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const { contextSafe } = useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>(".work-row").forEach((row) => {
          gsap.from(row.querySelectorAll(".row-reveal"), {
            yPercent: 100,
            duration: 1.2,
            ease: "art",
            stagger: 0.06,
            scrollTrigger: { trigger: row, start: "top 88%" },
          });
          gsap.from(row.querySelector(".row-line"), {
            scaleX: 0,
            duration: 1.4,
            ease: "art",
            scrollTrigger: { trigger: row, start: "top 92%" },
          });
        });
      }

      // Cursor-following preview, desktop pointer only.
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || !preview.current) return;
      gsap.set(preview.current, { scale: 0.6, autoAlpha: 0, ...previewSize(items[0]) });
      const xTo = gsap.quickTo(preview.current, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(preview.current, "y", { duration: 0.6, ease: "power3" });
      const rTo = gsap.quickTo(preview.current, "rotation", { duration: 0.8, ease: "power3" });
      let lastX = 0;
      const onMove = (e: PointerEvent) => {
        const rect = root.current!.getBoundingClientRect();
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
        rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };
      root.current!.addEventListener("pointermove", onMove);
      return () => root.current?.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  const show = contextSafe((i: number | null) => {
    setActive(i);
    if (!preview.current) return;
    gsap.to(preview.current, {
      scale: i === null ? 0.6 : 1,
      autoAlpha: i === null ? 0 : 1,
      // The card reshapes between landscape video and portrait photos.
      ...(i === null ? {} : previewSize(items[i])),
      duration: 0.55,
      ease: "art",
    });
  });

  return (
    <div ref={root} className="relative mt-16 md:mt-24" onPointerLeave={() => show(null)}>
      <ul>
        {items.map((p, i) => {
          const dim = active !== null && active !== i;
          const Row = p.href ? "a" : "div";
          return (
            <li key={p.id} className="work-row relative">
              <span className="row-line absolute inset-x-0 top-0 h-px origin-left bg-ink/15" />
              <Row
                {...(p.href ? { href: p.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                onPointerEnter={() => show(i)}
                onFocus={() => show(i)}
                onBlur={() => show(null)}
                className={`group grid gap-6 py-8 transition-opacity duration-500 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:py-10 ${
                  dim ? "md:opacity-30" : ""
                }`}
              >
                <InlineMedia p={p} />

                {/* Type size lives on the mask so its em-based headroom matches the title. */}
                <div className="split-mask display text-[clamp(3.2rem,8vw,8.5rem)]">
                  <div className="row-reveal">
                    <h3 className="transition-transform duration-700 ease-art md:group-hover:translate-x-4">
                      {p.name}
                    </h3>
                  </div>
                </div>

                <div className="overflow-clip">
                  <div className="row-reveal">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="label text-muted">{p.kind}</span>
                      <span className="label text-muted">{p.year}</span>
                    </div>
                    <p className="mt-3 max-w-[52ch] text-justify leading-relaxed text-ink/80 hyphens-auto">{p.body}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs text-ink/55">{p.stack.join(" / ")}</span>
                      {p.href && (
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          {p.linkLabel}
                          <ArrowUpRight
                            size={16}
                            weight="bold"
                            className="transition-transform duration-500 ease-art group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Row>
            </li>
          );
        })}
      </ul>
      <span className="absolute inset-x-0 bottom-0 h-px bg-ink/15" />

      {/* Floating preview (desktop). All layers stay mounted and crossfade;
          only the active one plays. */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden -translate-x-1/2 -translate-y-1/2 opacity-0 md:block"
      >
        {items.map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 overflow-hidden rounded-sm shadow-[0_30px_80px_-20px_rgba(58,23,133,0.45)] transition-opacity duration-300"
            style={{ opacity: active === i ? 1 : 0 }}
          >
            <Media p={p} active={active === i} className="h-full w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
