"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, DownloadSimple } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import Magnetic from "./Magnetic";
import { navigateTo } from "@/lib/loader";
import { links, profile } from "@/lib/content";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduced) {
        gsap.from(".contact-char", {
          yPercent: 110,
          duration: 1.2,
          ease: "art",
          stagger: 0.03,
          scrollTrigger: { trigger: ".contact-title", start: "top 85%" },
        });
        gsap.from(".contact-fade", {
          y: 30,
          autoAlpha: 0,
          duration: 1,
          ease: "art",
          stagger: 0.08,
          scrollTrigger: { trigger: ".contact-fade", start: "top 92%" },
        });
      }

    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const details = [
    { k: "Phone", v: profile.phone, href: profile.phoneHref },
    { k: "LinkedIn", v: "andrei-nistor", href: profile.linkedin, ext: true },
    { k: "Studio", v: "linkhaus.vercel.app", href: links.linkhaus, ext: true },
    { k: "Based in", v: `${profile.location}, from ${profile.origin}` },
  ];

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden bg-ink px-4 pt-28 text-paper md:px-8 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-[60vw] w-[60vw] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #8a5cff 0%, #3a1785 50%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1600px]">
        <h2 aria-label="Let's talk" className="contact-title display text-[clamp(5rem,17vw,19rem)]">
          {/* One headroom mask per word, so the rising letters never get their tops clipped. */}
          {["Let's", "talk"].map((word, wi) => (
            <span key={word} aria-hidden className="split-mask mr-[0.18em] inline-flex last:mr-0">
              {word.split("").map((ch, ci) => (
                <span key={wi + "-" + ci} className="contact-char inline-block">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="contact-fade mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center md:mt-14">
          <Magnetic strength={0.3}>
          <a
            href={`mailto:${profile.email}`}
            onClick={() => {
              // mailto does nothing without a configured mail app, so also
              // copy the address and confirm it on the Copy button.
              navigator.clipboard
                ?.writeText(profile.email)
                .then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                })
                .catch(() => {});
            }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-paper px-6 py-4 text-ink md:px-8 md:py-5"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-violet transition-transform duration-500 ease-art group-hover:translate-y-0" />
            <span className="relative text-base font-medium transition-colors duration-500 group-hover:text-paper md:text-xl">
              {profile.email}
            </span>
            <ArrowUpRight
              size={20}
              weight="bold"
              className="relative transition-all duration-500 ease-art group-hover:rotate-45 group-hover:text-paper"
            />
          </a>
          </Magnetic>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className="label inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-3 transition-colors duration-300 hover:border-paper active:scale-[0.98]"
          >
            {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy email"}
          </button>
          <a
            href={profile.cv}
            download
            className="label inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-3 transition-colors duration-300 hover:border-paper active:scale-[0.98]"
          >
            <DownloadSimple size={14} weight="bold" />
            Download CV
          </a>
        </div>

        <dl className="contact-fade mt-24 grid gap-8 border-t border-paper/15 pt-10 sm:grid-cols-2 md:mt-32 md:grid-cols-4">
          {details.map((d) => (
            <div key={d.k}>
              <dt className="label text-paper/45">{d.k}</dt>
              <dd className="mt-2">
                {d.href ? (
                  <a
                    href={d.href}
                    {...(d.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-violet"
                  >
                    {d.v}
                  </a>
                ) : (
                  d.v
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-paper/10 py-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-paper/45">© 2026 Andrei Nistor. Built with Next.js, GSAP and Three.js.</p>
          <button
            type="button"
            onClick={() => navigateTo("top")}
            className="label text-paper/60 transition-colors hover:text-paper"
          >
            Back to top
          </button>
        </div>
      </div>

      <div aria-hidden className="display relative -mb-[3vw] select-none whitespace-nowrap text-center text-[21vw] leading-[0.75] text-paper/[0.06]">
        Andrei Nistor
      </div>
    </footer>
  );
}
