"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

// Line breaks chosen by measuring Space Grotesk widths so every row has nearly
// the same natural length; justification then only nudges word spacing.
const manifesto = [
  "Engineer by degree, brand",
  "builder by instinct. I grew a",
  "streetwear label to millions",
  "of views, then I founded a",
  "studio to build the kind of",
  "web I always wanted to see.",
];

const facts = [
  { k: "Bachelor's degree", v: "Systems Engineering, Polytechnic University of Timișoara" },
  {
    k: "Master's degree",
    v: "Advanced Analytics for Business, National University of Science and Technology POLITEHNICA Bucharest",
  },
  { k: "Founder", v: "LINKHAUS, a web design & development studio" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const split = SplitText.create(".manifesto", { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".manifesto", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.from(".fact", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "art",
        scrollTrigger: { trigger: ".facts", start: "top 85%" },
      });
      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="px-4 py-28 md:px-8 md:py-44">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center">
        {/* Fixed breaks + a width in em means the same six rows at every viewport;
            the font scales so the longest row (about 12.6em) always fits. */}
        <p className="manifesto font-medium leading-[1.04] tracking-[-0.035em] [font-size:min(5.6rem,calc((100vw_-_2rem)/12.8))]">
          {manifesto.map((line) => (
            <span key={line} className="justify-all block w-[12.62em]">
              {line}{" "}
            </span>
          ))}
        </p>
        <dl className="facts mt-20 grid w-full max-w-[1200px] gap-10 text-center md:mt-28 md:grid-cols-3 md:gap-10">
          {facts.map((f) => (
            <div key={f.k} className="fact flex flex-col items-center border-t border-ink/15 pt-5">
              <dt className="label text-muted">{f.k}</dt>
              <dd className="mt-3 max-w-[30ch] text-lg leading-snug">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
