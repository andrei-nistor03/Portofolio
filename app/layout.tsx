import type { Metadata, Viewport } from "next";
import { thunder } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andrei Nistor | Creative Developer & Data Analyst",
  description:
    "Portfolio of Andrei Nistor: creative developer, founder of LINKHAUS and Advanced Analytics student in Bucharest. 3D web experiences, full-stack platforms and analytics tools.",
  openGraph: {
    title: "Andrei Nistor | Creative Developer",
    description: "3D web experiences, full-stack platforms and analytics tools.",
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Andrei Nistor",
  jobTitle: "Creative Developer",
  address: { "@type": "PostalAddress", addressLocality: "Bucharest", addressCountry: "RO" },
  sameAs: ["https://www.linkedin.com/in/andrei-nistor-b38948205", "https://linkhaus.vercel.app"],
  alumniOf: "Polytechnic University of Timișoara",
};

// Sets --app-h to the screen height in px before first paint, for the tall
// scroll sections. In-app browsers (Instagram, Snapchat, ...) show and hide
// their bars by resizing the whole web view, which changes every viewport unit
// (vh, svh and lvh alike) and made a 520svh section grow or shrink by hundreds
// of px on each scroll-direction change. On touch devices it only updates when
// the width changes (rotation); a desktop window keeps following resizes.
const appHeightScript = `(function(){var d=document.documentElement,w=-1,t=matchMedia("(pointer: coarse)").matches;function s(){if(t&&innerWidth===w)return;w=innerWidth;d.style.setProperty("--app-h",innerHeight+"px")}s();addEventListener("resize",s)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The script above writes a style attribute on <html> before hydration.
    <html lang="en" className={thunder.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: appHeightScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        {children}
      </body>
    </html>
  );
}
