"use client";

import { useRef } from "react";
import { ArrowDownRight, DownloadSimple } from "@phosphor-icons/react";
import { profile } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { navigateTo, onIntroComplete } from "@/lib/loader";
import DotField from "./DotField";

const LINES = ["Andrei", "Nistor"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      const glyphs = gsap.utils.toArray<HTMLSpanElement>(".glyph", root.current);

      // Intro: glyphs rise out of their mask while the variable weight swells
      // from hairline to bold, then the supporting copy follows.
      // Paused until the first-load loader has lifted, so the intro is seen.
      const tl = gsap.timeline({ defaults: { ease: "art" }, paused: true });
      const offIntro = onIntroComplete(() => tl.play());
      if (!reduced) {
        tl.from(glyphs, {
          yPercent: 110,
          duration: 1.4,
          stagger: { each: 0.05, from: "start" },
        })
          .fromTo(
            glyphs,
            { "--wght": 100 },
            { "--wght": 700, duration: 1.6, stagger: 0.05 },
            0.15,
          )
          .from(".hero-fade", { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.6);
      }

      // Scroll out: name drifts up and spreads apart, dots fade.
      if (!reduced) {
        gsap.to(".hero-line-0", {
          xPercent: -6,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-line-1", {
          xPercent: 6,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-dots", {
          autoAlpha: 0,
          scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
        });
      }

      // Weight follows the cursor: glyphs near the pointer get heavier.
      if (reduced || touch) return offIntro;
      const centers: { el: HTMLSpanElement; x: number; y: number }[] = [];
      const measure = () => {
        centers.length = 0;
        for (const el of glyphs) {
          const r = el.getBoundingClientRect();
          centers.push({ el, x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY });
        }
      };
      let mx = -9999;
      let my = -9999;
      const onMove = (e: PointerEvent) => {
        mx = e.clientX;
        my = e.clientY + window.scrollY;
      };
      const setters = glyphs.map((g) => gsap.quickTo(g, "--wght", { duration: 0.6, ease: "power3.out" }));
      const tick = () => {
        if (tl.isActive()) return;
        centers.forEach((c, i) => {
          const d = Math.hypot(c.x - mx, c.y - my);
          const k = Math.max(0, 1 - d / 420);
          setters[i](700 - 560 * k * k);
        });
      };
      tl.eventCallback("onComplete", measure);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", measure);
      gsap.ticker.add(tick);
      return () => {
        offIntro();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", measure);
        gsap.ticker.remove(tick);
      };
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden px-4 pb-8 pt-24 md:px-8"
    >
      <DotField className="hero-dots absolute inset-0 h-full w-full" />

      <p className="hero-fade label relative mx-auto w-full max-w-[1600px] text-muted">
        Creative developer &amp; data analyst
      </p>

      <h1
        ref={nameRef}
        aria-label="Andrei Nistor"
        className="display relative mx-auto my-auto w-full max-w-[1600px] select-none py-6 text-[36vw] md:text-[23vw] 2xl:text-[22rem]"
      >
        {LINES.map((line, li) => (
          <span
            key={line}
            aria-hidden
            className={`hero-line-${li} split-mask flex ${li === 1 ? "justify-end" : ""}`}
          >
            {line.split("").map((ch, ci) => (
              <span
                key={ci}
                className="glyph inline-block will-change-transform"
                style={{ fontVariationSettings: '"wght" var(--wght, 700)' } as React.CSSProperties}
              >
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <p className="hero-fade max-w-[38ch] text-lg leading-snug md:text-xl">
          I build websites that move and the analytics that measure them. Founder of{" "}
          <span className="text-violet">LINKHAUS</span>, based in Bucharest.
        </p>
        <div className="hero-fade flex flex-wrap items-center gap-3 justify-self-start md:justify-self-end">
          <a
            href={profile.cv}
            download
            className="group inline-flex items-center gap-3 rounded-full border border-ink/20 bg-paper/70 px-6 py-4 backdrop-blur transition-colors duration-300 hover:border-ink active:scale-[0.98]"
          >
            <span className="label">Download CV</span>
            <DownloadSimple
              size={18}
              weight="bold"
              className="transition-transform duration-500 ease-art group-hover:translate-y-0.5"
            />
          </a>
          <button
            type="button"
            onClick={() => navigateTo("work")}
            className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-4 text-paper transition-transform duration-300 active:scale-[0.98]"
          >
            <span className="label">View work</span>
            <ArrowDownRight
              size={18}
              weight="bold"
              className="transition-transform duration-500 ease-art group-hover:-rotate-45"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
