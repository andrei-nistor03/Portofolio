"use client";

import { useRef } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { timeline, type TimelineEntry } from "@/lib/content";

const kindLabel: Record<TimelineEntry["kind"], string> = {
  education: "Education",
  work: "Work",
  venture: "Founder",
};

function Station({ entry }: { entry: TimelineEntry }) {
  return (
    <article className="station relative flex shrink-0 flex-col md:h-full md:w-[min(48vw,700px)] md:justify-center md:pr-[6vw]">
      <span
        aria-hidden
        className="station-year display pointer-events-none select-none text-[34vw] leading-[0.8] text-transparent md:absolute md:top-[9vh] md:left-[-1vw] md:text-[17vw]"
        style={{ WebkitTextStroke: "1px rgba(13,13,13,0.2)" }}
      >
        {entry.year}
      </span>

      <div className="station-body relative -mt-[12vw] md:mt-[clamp(5rem,17vh,11rem)]">
        <div className="flex items-center gap-3">
          <span
            className={`label rounded-full px-2.5 py-1 ${
              entry.kind === "venture" ? "bg-violet text-paper" : "bg-ink/[0.06] text-ink"
            }`}
          >
            {kindLabel[entry.kind]}
          </span>
          <span className="label text-muted">{entry.period}</span>
        </div>

        <h3 className="display mt-5 text-[clamp(2.4rem,3.9vw,4rem)]">{entry.title}</h3>
        <p className="mt-3 text-lg font-medium">{entry.org}</p>
        <p className="text-muted">{entry.place}</p>
        {entry.body && (
          <p className="mt-5 max-w-[56ch] text-justify text-[0.95rem] leading-relaxed text-ink/80 hyphens-auto">
            {entry.body}
          </p>
        )}
        {entry.bullets && (
          <ul className="mt-5 max-w-[58ch] space-y-2.5">
            {entry.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-[0.95rem] leading-relaxed text-ink/80">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-violet" />
                <span className="min-w-0 flex-1 text-justify hyphens-auto">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {entry.stats && (
          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
            {entry.stats.map((s) => (
              <div key={s.label}>
                <dd className="display text-5xl text-violet">
                  <span className="stat-num" data-value={s.value}>
                    {s.value.toLocaleString("en-US")}
                  </span>
                  {s.suffix}
                </dd>
                <dt className="label mt-1 text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}

        {entry.tags && (
          <ul className="mt-6 flex max-w-[60ch] flex-wrap gap-2">
            {entry.tags.map((t) => (
              <li key={t} className="label rounded-full border border-ink/15 px-3 py-1.5 text-ink/70">
                {t}
              </li>
            ))}
          </ul>
        )}

        {entry.link && (
          <a
            href={entry.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-2 border-b border-ink pb-1 font-medium"
          >
            {entry.link.label}
            <ArrowUpRight
              size={16}
              weight="bold"
              className="transition-transform duration-500 ease-art group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Timeline() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const countUp = (el: HTMLElement, opts: gsap.TweenVars) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString("en-US")),
          ...opts,
        });
      };

      // Desktop: pin the section and pan the track horizontally.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const pan = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          ".tl-progress",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>(".station").forEach((st) => {
          gsap.from(st.querySelector(".station-body"), {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            ease: "art",
            scrollTrigger: { trigger: st, containerAnimation: pan, start: "left 80%" },
          });
          gsap.fromTo(
            st.querySelector(".station-year"),
            { xPercent: 18 },
            {
              xPercent: -18,
              ease: "none",
              scrollTrigger: {
                trigger: st,
                containerAnimation: pan,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
          st.querySelectorAll<HTMLElement>(".stat-num").forEach((n) =>
            countUp(n, { scrollTrigger: { trigger: st, containerAnimation: pan, start: "left 60%" } }),
          );
        });
      });

      // Mobile: vertical stack with simple reveals.
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".station-body").forEach((b) =>
          gsap.from(b, { y: 40, autoAlpha: 0, duration: 1, ease: "art", scrollTrigger: { trigger: b, start: "top 85%" } }),
        );
        gsap.utils.toArray<HTMLElement>(".stat-num").forEach((n) =>
          countUp(n, { scrollTrigger: { trigger: n, start: "top 90%" } }),
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="timeline"
      className="relative overflow-hidden bg-paper-deep md:h-[100dvh]"
    >
      <div
        ref={track}
        className="flex flex-col gap-24 px-4 py-24 md:h-full md:flex-row md:items-stretch md:gap-0 md:px-0 md:py-0 md:pl-8"
      >
        <header className="flex shrink-0 flex-col justify-center md:w-[min(52vw,760px)] md:pr-[6vw]">
          <h2 className="display text-[clamp(4.5rem,12vw,13rem)]">
            The road
            <br />
            <span className="text-violet">so far</span>
          </h2>
          <p className="mt-6 max-w-[36ch] text-lg leading-snug text-ink/75">
            From an intensive computer science class in Timișoara to running a studio and studying
            analytics in Bucharest.
          </p>
        </header>
        {timeline.map((e) => (
          <Station key={e.id} entry={e} />
        ))}
        <div aria-hidden className="hidden shrink-0 md:block md:w-[8vw]" />
      </div>

      <div className="pointer-events-none absolute inset-x-8 bottom-8 hidden h-[2px] bg-ink/10 md:block">
        <div className="tl-progress h-full origin-left bg-violet" />
      </div>
    </section>
  );
}
