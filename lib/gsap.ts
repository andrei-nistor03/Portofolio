"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
  // Brand ease from the LINKHAUS manual: cubic-bezier(0.16, 1, 0.3, 1).
  CustomEase.create("art", "0.16, 1, 0.3, 1");
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
