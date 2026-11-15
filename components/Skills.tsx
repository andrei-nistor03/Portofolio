"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { lenisRef } from "@/lib/lenis";
import { certifications, skillGroups, spoken } from "@/lib/content";

const marqueeWords = [
  "React",
  "Next.js",
  "Three.js",
  "GLSL",
  "GSAP",
  "TypeScript",
  "PostgreSQL",
  "SQL",
  "SAS Viya",
  "Python",
  "C#",
  "Java",
];

const totalSkills = skillGroups.reduce((n, g) => n + g.items.length, 0);
const TITLE = "Skills";

// The skills chapter is its own dark sheet: it opens up from an inset,
// rounded card to full width as it arrives, and a giant title rises in, so
// the change of section is unmistakable.
export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.matchMedia("(max-width: 767px)").matches;

      // Index highlights the group currently in the reading band.
      const links = gsap.utils.toArray<HTMLElement>(".skill-index-link");
      gsap.utils.toArray<HTMLElement>(".skill-group").forEach((g, i) => {
        ScrollTrigger.create({
          trigger: g,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => links[i]?.classList.toggle("is-active", self.isActive),
        });
      });

      if (reduced) return;

      // Sheet opens from an inset card to full width.
      gsap.fromTo(
        ".skills-sheet",
        { clipPath: `inset(0% ${mobile ? 3 : 6}% 0% ${mobile ? 3 : 6}% round ${mobile ? 28 : 64}px)` },
        {
          clipPath: `inset(0% 0% 0% 0% round ${mobile ? 20 : 32}px)`,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
        },
      );

      // Giant title: letters rise in sequence, scrubbed to the arrival.
      gsap.fromTo(
        ".skills-char",
        { yPercent: 120 },
        {
          yPercent: 0,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".skills-title", start: "top 95%", end: "top 45%", scrub: true },
        },
      );
      gsap.from(".skills-sub", {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        ease: "art",
        stagger: 0.08,
        scrollTrigger: { trigger: ".skills-title", start: "top 60%" },
      });

      gsap.utils.toArray<HTMLElement>(".skill-group").forEach((g) => {
        gsap.from(g.querySelector(".skill-title"), {
          yPercent: 100,
          duration: 1.1,
          ease: "art",
          scrollTrigger: { trigger: g, start: "top 85%" },
        });
        gsap.from(g.querySelectorAll(".skill-chip"), {
          y: 16,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: { trigger: g, start: "top 78%" },
        });
      });
      gsap.from(".skill-panel", {
        y: 60,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "art",
        scrollTrigger: { trigger: ".skill-panels", start: "top 85%" },
      });
      // The marquee leans with scroll.
      gsap.to(".marquee-skew", {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -120, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={root} id="skills" className="relative px-2 pb-2 md:px-3 md:pb-3">
      <div className="skills-sheet relative overflow-clip rounded-[20px] bg-ink-soft pb-24 text-paper md:rounded-[32px] md:pb-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[20vw] left-1/2 h-[50vw] w-[80vw] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
          style={{ background: "radial-gradient(circle, #8a5cff 0%, #3a1785 45%, transparent 70%)" }}
        />

        {/* Chapter title */}
        <header className="relative mx-auto max-w-[1600px] px-4 pt-20 md:px-8 md:pt-28">
          <h2 aria-label={TITLE} className="skills-title display split-mask text-[29vw] leading-[0.8] md:text-[24vw]">
            {TITLE.split("").map((ch, i) => (
              <span key={i} aria-hidden className="skills-char inline-block">
                {ch}
              </span>
            ))}
          </h2>
          <div className="mt-6 flex flex-col gap-3 border-t border-paper/15 pt-5 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="skills-sub text-xl md:text-2xl">
              Design, code <span className="text-violet">and data</span>
            </p>
            <p className="skills-sub font-mono text-sm text-paper/55">
              {totalSkills} skills / {skillGroups.length} disciplines / {certifications.length} badges
            </p>
          </div>
        </header>

        <div aria-hidden className="relative mt-16 overflow-hidden border-y border-paper/10 md:mt-24">
          <div className="marquee-skew py-6 md:py-8">
            <div className="marquee-track flex w-max">
              {[0, 1].map((k) => (
                <div key={k} className="flex shrink-0 items-center">
                  {marqueeWords.map((w) => (
                    <span
                      key={w + k}
                      className="display flex items-center px-6 text-[clamp(3rem,7vw,7rem)] text-paper/90 md:px-10"
                    >
                      {w}
                      <span className="ml-12 inline-block h-3 w-3 rotate-45 bg-violet md:ml-20" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-[1600px] gap-14 px-4 pt-20 md:grid-cols-12 md:gap-10 md:px-8 md:pt-28">
          {/* Sticky intro + index */}
          <aside className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <h3 className="display text-[clamp(3.2rem,6vw,6.5rem)]">
                The <span className="text-violet">toolkit</span>
              </h3>
              <p className="mt-6 max-w-[34ch] text-lg leading-snug text-paper/70">
                {totalSkills} skills across {skillGroups.length} disciplines, plus SAS badges and two languages.
              </p>
              <nav aria-label="Skill groups" className="mt-10 hidden md:block">
                <ul className="space-y-1">
                  {skillGroups.map((g) => (
                    <li key={g.id}>
                      <a
                        href={`#skill-${g.id}`}
                        onClick={jump(`skill-${g.id}`)}
                        className="skill-index-link group flex items-baseline justify-between gap-6 border-b border-paper/10 py-2.5 text-paper/40 transition-colors duration-300 hover:text-paper [&.is-active]:text-paper"
                      >
                        <span className="flex items-center gap-3 text-lg">
                          <span className="h-2 w-2 rotate-45 bg-violet opacity-0 transition-opacity duration-300 group-[.is-active]:opacity-100" />
                          {g.title}
                        </span>
                        <span className="font-mono text-xs">{g.items.length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Groups */}
          <div className="md:col-span-8">
            {skillGroups.map((g) => (
              <article
                key={g.id}
                id={`skill-${g.id}`}
                className="skill-group border-t border-paper/12 py-10 first:border-t-0 first:pt-0 md:py-14"
              >
                <div className="flex items-end justify-between gap-6">
                  <div className="split-mask display text-[clamp(3rem,5.4vw,5.6rem)]">
                    <h4 className="skill-title">{g.title}</h4>
                  </div>
                  <span className="mb-2 font-mono text-sm text-paper/45">{g.items.length}</span>
                </div>
                <p className="mt-3 max-w-[48ch] text-paper/60">{g.blurb}</p>
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {g.items.map((s) => (
                    <li
                      key={s}
                      className="skill-chip cursor-default rounded-full border border-paper/15 px-4 py-2 text-[0.95rem] text-paper/85 transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* Certifications & badges + spoken languages */}
          <div className="skill-panels grid gap-3 md:col-span-12 md:mt-10 md:grid-cols-12">
            <div className="skill-panel relative overflow-hidden rounded-sm bg-paper p-6 text-ink md:col-span-8 md:p-10">
              <h3 className="display text-[clamp(3rem,5vw,5rem)]">
                Certifications <span className="text-violet">&amp; badges</span>
              </h3>
              <ul className="mt-8 grid gap-6 md:grid-cols-3">
                {certifications.map((c) => (
                  <li key={c.title} className="flex flex-col gap-3 border-t border-ink/10 pt-5">
                    <Image
                      src={c.badge}
                      alt={`${c.title}, ${c.type.toLowerCase()} issued by ${c.issuer}`}
                      width={96}
                      height={96}
                      className="h-20 w-20 md:h-24 md:w-24"
                    />
                    <span className="flex items-center gap-2">
                      <span className="label rounded-full bg-violet px-2.5 py-1 text-paper">{c.type}</span>
                      <span className="font-mono text-xs text-ink/50">Issued by {c.issuer}</span>
                    </span>
                    <span className="font-medium leading-snug">{c.title}</span>
                    <span className="text-sm leading-relaxed text-ink/70">{c.body}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="skill-panel flex flex-col justify-between gap-10 rounded-sm bg-violet p-6 text-paper md:col-span-4 md:p-10">
              <h3 className="display text-[clamp(3rem,5vw,5rem)]">Spoken</h3>
              <dl className="space-y-6">
                {spoken.map((s) => (
                  <div key={s.lang} className="flex items-baseline justify-between gap-4 border-t border-paper/25 pt-4">
                    <dt className="display text-[clamp(2.6rem,4vw,4rem)]">{s.lang}</dt>
                    <dd className="label text-paper/80">{s.level}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
