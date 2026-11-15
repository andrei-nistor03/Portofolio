"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";
import { useInView } from "@/lib/useInView";
import { links, studioChapters } from "@/lib/content";

const StudioScene = dynamic(() => import("./three/StudioScene"), { ssr: false });

// Scroll budget, as fractions of the section's scroll length:
// 0.00-0.18 wordmark settles, 0.18-0.72 chapters, 0.72-1.00 dive through the door.
const DIVE_START = 0.72;

export default function Studio() {
  const root = useRef<HTMLElement>(null);
  // The scene mounts with the page (behind the first-load loader, which waits
  // for it to draw) and then stays mounted. Unmounting it on scroll-away used
  // to throw away the WebGL context, so coming back meant a blank stage while
  // it rebuilt (and browsers cap how many contexts a page may create).
  const active = useInView(root, "0px");

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".chapter");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            sceneState.studioProgress = p;
            // A slow approach while the chapters read, then a fast dive.
            sceneState.studioDive =
              p < DIVE_START
                ? (p / DIVE_START) * 0.28
                : 0.28 + ((p - DIVE_START) / (1 - DIVE_START)) * 0.72;
          },
        },
      });

      tl.fromTo(".wordmark", { yPercent: 30, scale: 1.08 }, { yPercent: 0, scale: 1, duration: 0.18 }, 0)
        .fromTo(".studio-intro", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.04)
        .to(".studio-intro", { autoAlpha: 0, y: -30, duration: 0.05 }, 0.18);

      const span = (DIVE_START - 0.22) / chapters.length;
      chapters.forEach((c, i) => {
        const at = 0.22 + i * span;
        tl.fromTo(c, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: span * 0.3 }, at);
        if (i < chapters.length - 1) {
          tl.to(c, { autoAlpha: 0, y: -40, duration: span * 0.25 }, at + span * 0.75);
        }
      });
      tl.fromTo(".studio-bar", { scaleX: 0 }, { scaleX: 1, duration: DIVE_START - 0.22 }, 0.22);

      // Dive: copy clears, the wordmark blows past, violet then paper floods in
      // so the next section starts seamlessly on paper.
      tl.to([".chapter", ".studio-ui"], { autoAlpha: 0, duration: 0.06 }, DIVE_START)
        .to(".wordmark", { scale: 2.4, autoAlpha: 0, duration: 0.2 }, DIVE_START)
        .fromTo(".veil-violet", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.84)
        .fromTo(".veil-paper", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.06 }, 0.9);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="studio" className="relative h-[calc(var(--app-h)*5.2)] bg-ink text-paper">
      {/* Section height uses --app-h (see app/layout.tsx) so it never changes
          mid-scroll, which would shift everything below it. The stage can use
          lvh: it lives inside that fixed height, so its size never moves the
          page. lvh fills the screen with the browser toolbar hidden; the bottom
          padding keeps the copy above the toolbar when it shows. */}
      <div className="sticky top-0 h-[100lvh] overflow-hidden">
        {/* Wordmark sits behind the transparent canvas, so the walls stand in front of it. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            aria-hidden
            className="wordmark display select-none whitespace-nowrap text-[30vw] text-paper/[0.07]"
          >
            Linkhaus
          </span>
        </div>

        <StudioScene active={active} />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(13,13,13,0.75)_100%)]" />

        <div className="studio-ui absolute inset-x-0 top-0 mx-auto flex max-w-[1600px] items-start justify-between gap-4 px-4 pt-24 md:px-8">
          <h2 className="label text-paper/60">LINKHAUS studio, since 2026</h2>
          <a
            href={links.linkhaus}
            target="_blank"
            rel="noopener noreferrer"
            className="label group inline-flex shrink-0 items-center gap-2 rounded-full border border-paper/25 px-4 py-2 transition-colors duration-300 hover:border-violet hover:bg-violet"
          >
            Visit the studio
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-500 ease-art group-hover:rotate-45"
            />
          </a>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-4 pb-[calc(100lvh-100svh+2.5rem)] md:px-8 md:pb-[calc(100lvh-100svh+3.5rem)]">
          <div className="relative min-h-[12rem]">
            <div className="studio-intro absolute bottom-0 left-0 max-w-[24ch]">
              <p className="text-xl leading-snug md:text-[1.7rem] md:leading-[1.15] md:tracking-[-0.015em]">
                A studio for custom, high-performance websites. Its home page is built around this
                model.
              </p>
            </div>
            {studioChapters.map((c) => (
              <div key={c.title} className="chapter invisible absolute bottom-0 left-0 max-w-[40ch]">
                <h3 className="display text-[clamp(3rem,6vw,6rem)] text-violet-pale">{c.title}</h3>
                <p className="mt-3 text-lg leading-snug text-paper/75">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="studio-ui mt-8 h-px w-full bg-paper/15">
            <div className="studio-bar h-full origin-left bg-violet" />
          </div>
        </div>

        <div className="veil-violet pointer-events-none invisible absolute inset-0 bg-[radial-gradient(circle_at_center,#e4d3ff_0%,#8a5cff_45%,#3a1785_100%)]" />
        <div className="veil-paper pointer-events-none invisible absolute inset-0 bg-paper" />
      </div>
    </section>
  );
}
