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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={thunder.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
