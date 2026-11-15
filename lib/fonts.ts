import localFont from "next/font/local";

// Thunder (display) via next/font. Space Grotesk and JetBrains Mono are
// self-hosted in public/fonts with unicode-range subsets (see globals.css),
// so Romanian ă ș ț render without a Google Fonts round-trip.
export const thunder = localFont({
  src: "./fonts/thunder-vf.woff2",
  variable: "--font-thunder",
  display: "swap",
  weight: "100 900",
});
