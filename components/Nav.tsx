"use client";

import { useEffect, useRef, useState } from "react";
import { DownloadSimple, List, X } from "@phosphor-icons/react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setScrollLocked } from "@/lib/lenis";
import { loaderState, navigateTo, onIntroComplete } from "@/lib/loader";
import { profile } from "@/lib/content";
import Magnetic from "./Magnetic";

const items = [
  { id: "timeline", label: "Timeline" },
  { id: "studio", label: "Studio" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
];

// Floating pill nav. Desktop shows the links inline; mobile gets a hamburger
// that opens a full-screen menu. Every link goes through the loader
// transition instead of a long smooth scroll.
export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Highlight the link of the section currently in view.
  useGSAP(
    () => {
      // Elements, not "#id" strings: inside a scoped context a selector string
      // would only search within the nav itself.
      const triggers = items.map((it) =>
        ScrollTrigger.create({
          trigger: document.getElementById(it.id),
          // Created before the timeline pin exists; measuring last makes the
          // positions include the pin spacing.
          refreshPriority: -1,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) =>
            ref.current
              ?.querySelector(`[data-nav="${it.id}"]`)
              ?.classList.toggle("is-current", self.isActive),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.set(".nav-pill", { yPercent: -160, autoAlpha: 0 });
      return onIntroComplete(() =>
        gsap.to(".nav-pill", { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "art", delay: 0.15 }),
      );
    },
    { scope: ref },
  );

  // Menu open/close animation.
  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (open) {
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0 : 0.7, ease: "expo.inOut" },
        );
        gsap.fromTo(
          ".menu-link",
          { yPercent: 110 },
          { yPercent: 0, duration: reduced ? 0 : 0.9, ease: "art", stagger: 0.06, delay: reduced ? 0 : 0.25 },
        );
        gsap.fromTo(
          ".menu-foot",
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.6, delay: reduced ? 0 : 0.5 },
        );
      } else {
        gsap.to(menu, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: reduced ? 0 : 0.5,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    },
    { dependencies: [open], scope: ref },
  );

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // A menu link hands the lock straight to the loader; don't release it.
      if (!loaderState.busy) setScrollLocked(false);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    navigateTo(id);
  };

  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-0 z-40">
      {/* Mobile menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className="pointer-events-auto invisible fixed inset-0 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 text-paper md:hidden"
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          <ul className="space-y-3">
            {[...items, { id: "contact", label: "Contact" }].map((it) => (
              <li key={it.id} className="split-mask display text-[17vw]">
                <a href={`#${it.id}`} onClick={go(it.id)} className="menu-link block" tabIndex={open ? 0 : -1}>
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-foot space-y-4">
          <a href={`mailto:${profile.email}`} className="block text-lg underline decoration-paper/30 underline-offset-4">
            {profile.email}
          </a>
          <div className="flex gap-3">
            <a
              href={profile.cv}
              download
              className="label inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-3"
              tabIndex={open ? 0 : -1}
            >
              <DownloadSimple size={14} weight="bold" />
              Download CV
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="label inline-flex items-center rounded-full border border-paper/25 px-4 py-3"
              tabIndex={open ? 0 : -1}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="px-3 pt-3 md:pt-4">
        <nav
          aria-label="Primary"
          className="nav-pill pointer-events-auto mx-auto flex h-14 max-w-[760px] items-center justify-between gap-2 rounded-full border border-ink/10 bg-paper/80 pl-5 pr-1.5 text-ink shadow-[0_10px_40px_-12px_rgba(13,13,13,0.25)] backdrop-blur-xl"
        >
          <a href="#top" onClick={go("top")} className="display text-[1.7rem] leading-none" aria-label="Back to top">
            AN<span className="text-violet">.</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {items.map((it) => (
              <li key={it.id}>
                <a
                  href={`#${it.id}`}
                  data-nav={it.id}
                  onClick={go(it.id)}
                  className="label group relative block overflow-hidden rounded-full px-3 py-2 transition-colors duration-300 hover:bg-ink/[0.06] [&.is-current]:bg-ink [&.is-current]:text-paper"
                >
                  <span className="block transition-transform duration-500 ease-art group-hover:-translate-y-[160%]">
                    {it.label}
                  </span>
                  <span className="absolute inset-0 flex translate-y-[160%] items-center justify-center transition-transform duration-500 ease-art group-hover:translate-y-0">
                    {it.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <a
              href={profile.cv}
              download
              aria-label="Download CV (PDF)"
              className="label hidden h-11 items-center gap-2 rounded-full px-3 transition-colors duration-300 hover:bg-ink/[0.06] sm:inline-flex"
            >
              <DownloadSimple size={16} weight="bold" />
              CV
            </a>
            <Magnetic>
              <a
                href="#contact"
                onClick={go("contact")}
                className="label inline-flex h-11 items-center rounded-full bg-ink px-5 text-paper transition-colors duration-300 hover:bg-violet"
              >
                Get in touch
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 hover:bg-ink/[0.06] md:hidden"
            >
              {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
