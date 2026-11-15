// Single source of truth for everything the page says about Andrei.
// Descriptions marked "CV" are verbatim from the CV.

export const profile = {
  name: "Andrei Nistor",
  role: "Creative developer & data analyst",
  email: "andreinistorbusiness@gmail.com",
  phone: "+40 734 236 074",
  phoneHref: "tel:+40734236074",
  linkedin: "https://www.linkedin.com/in/andrei-nistor-b38948205",
  studio: "https://linkhaus.vercel.app",
  cv: "/cv/Andrei_Nistor_CV.pdf",
  location: "Bucharest, Romania",
  origin: "Timișoara",
};

export const links = {
  maniacMinds: "https://www.instagram.com/maniac_minds/",
  utopia: "https://utopiafriedchicken.ro",
  ecandidat: "https://ecandidat.ro",
  linkhaus: "https://linkhaus.vercel.app",
};

export type TimelineKind = "education" | "work" | "venture";

export interface TimelineEntry {
  id: string;
  period: string;
  year: string;
  kind: TimelineKind;
  title: string;
  org: string;
  place: string;
  body?: string;
  bullets?: string[];
  tags?: string[];
  stats?: { value: number; suffix: string; label: string }[];
  link?: { href: string; label: string };
}

export const timeline: TimelineEntry[] = [
  {
    id: "carmen-sylva",
    period: "2017 - 2021",
    year: "2017",
    kind: "education",
    title: "Baccalaureate Diploma",
    org: "“Carmen Sylva” Pedagogical College",
    place: "Timișoara",
    body: "Mathematics and Computer Science, intensive computer science track. Where C and C++ came first.",
    tags: ["C", "C++", "Algorithms"],
  },
  {
    id: "upt",
    period: "2021 - 2025",
    year: "2021",
    kind: "education",
    title: "Bachelor's Degree in Systems Engineering",
    org: "Polytechnic University of Timișoara",
    place: "Faculty of Automation and Computing",
    tags: [
      "C#",
      "C++",
      "Java",
      "Object-Oriented Programming (OOP)",
      "Arduino",
      "Linux",
      "Git & GitHub",
      "Oracle SQL",
      "MATLAB & Simulink",
      "HTML",
    ],
  },
  {
    id: "maniac-minds",
    period: "Apr 2023 - Apr 2025",
    year: "2023",
    kind: "venture",
    title: "Founder & Brand Manager",
    org: "Maniac Minds",
    place: "Independent streetwear brand",
    // CV
    body: "Founded and managed an independent streetwear clothing brand. Responsibilities included: Product design and quality assurance, Social media management, content creation, Marketing, Customer support, Web design.",
    stats: [
      { value: 3, suffix: "M+", label: "organic views" },
      { value: 5000, suffix: "+", label: "followers" },
      { value: 25, suffix: "K+", label: "site visitors" },
      { value: 200, suffix: "+", label: "orders fulfilled" },
    ],
    link: { href: links.maniacMinds, label: "Instagram" },
  },
  {
    id: "atos",
    period: "Jun - Aug 2024",
    year: "2024",
    kind: "work",
    title: "Summer Practicant",
    org: "Atos",
    place: "Timișoara",
    // CV
    body: "As a participant in the Atos Summer Practice organized for students, I attended guided sessions aimed at understanding various roles and technologies used within the company. Topics covered included: Human Resources Business Partner (HRBP), Support Services, Project Management, Linux & Windows Servers, Virtual Machines, Generative AI (GenAI), Computing & Storage, Tooling & Automation, Cloud Technologies, Application Operations.",
    tags: [
      "Human Resources Business Partner (HRBP)",
      "Support Services",
      "Project Management",
      "Linux & Windows Servers",
      "Virtual Machines",
      "Generative AI (GenAI)",
      "Computing & Storage",
      "Tooling & Automation",
      "Cloud Technologies",
      "Application Operations",
    ],
  },
  {
    id: "enjoee",
    period: "Jan - Mar 2026",
    year: "2026",
    kind: "work",
    title: "Junior Developer",
    org: "StarTech Team · The Enjoee Project",
    place: "Development and Integration of Analytics Tool",
    // CV
    bullets: [
      "Designed and developed a modular user analytics system for React web applications",
      "Implemented page visit tracking, session management, time-on-page calculation, button event logging, pop-up session tracking and section-level interaction monitoring",
      "Used Supabase (PostgreSQL) for data storage and management of collected analytics data",
      "Built a data analytics dashboard to visualize key metrics such as page visits, session duration, user actions and active sessions",
      "Integrated the analytics system into an existing large-scale React platform (Enjoee), adapting the implementation to the application's architecture and managing environment configuration and codebase compatibility",
    ],
    tags: ["React", "Supabase", "PostgreSQL", "Dashboards", "Data Visualization", "Analytics"],
  },
  {
    id: "linkhaus",
    period: "Mar 2026 - Now",
    year: "Now",
    kind: "venture",
    title: "Founder & Creative Developer",
    org: "LINKHAUS",
    place: "Web design & development studio",
    // CV
    body: "Founded LINKHAUS, a creative web design & development studio building custom, high-performance websites – from brand-led landing pages and 3D web experiences to e-commerce and full-stack platforms",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Three.js",
      "React Three Fiber",
      "WebGL / GLSL",
      "GSAP",
      "Lenis",
      "Node.js",
      "Vercel",
    ],
    link: { href: links.linkhaus, label: "linkhaus.vercel.app" },
  },
  {
    id: "master",
    period: "2026 - Now",
    year: "2026",
    kind: "education",
    title: "Master's Degree in Advanced Analytics for Business",
    org: "National University of Science and Technology POLITEHNICA Bucharest",
    place: "Faculty of Automatic Control and Computers",
    // From the programme description (acs.pub.ro, ADA).
    body: "A two-year, English-taught programme on collecting, processing and interpreting data inside organizations. Coursework covers data science fundamentals, programming for data processing, visual analytics, exploratory data analysis, predictive modeling, neural networks, and forecasting and decision support systems, with a focus on building data pipelines aligned with business needs and turning analysis into actionable decisions.",
    tags: ["Python", "Data Analysis", "SQL", "Business Intelligence", "SAS Viya"],
  },
];

export const studioChapters = [
  {
    title: "One continuous scroll",
    body: "Next.js 15, React 19 and TypeScript, composed as a single scroll with GSAP ScrollTrigger and Lenis.",
  },
  {
    title: "3D & WebGL",
    body: "Custom GLSL shaders, this concrete GLB with PBR textures, a velocity-reactive gallery camera and a cursor-repelling particle field.",
  },
  {
    title: "Fast by design",
    body: "Render loops pause off-screen, heavy effects gate on device and reduced motion, and scroll state lives outside React.",
  },
];

export interface Project {
  id: string;
  name: string;
  kind: string;
  year: string;
  body: string;
  stack: string[];
  href?: string;
  linkLabel?: string;
  /** Looping showcase video (16:9), shown in the hover preview. */
  video?: string;
  /** Photo set (3:4) cycled in the hover preview instead of a video. */
  gallery?: string[];
  accent: string;
}

// Project bodies are verbatim from the CV (stack lists moved to `stack`).
export const projects: Project[] = [
  {
    id: "ecandidat",
    name: "eCandidat",
    kind: "Full-stack recruitment platform",
    year: "2025",
    body: "Designed and fully developed a full-stack recruitment platform with candidate and company roles: JWT authentication, session handling and route protection; dynamic candidate profiles; a Smart Search system based on multi-criteria filtering and compatibility scoring; deployment on Vercel with custom domain and SSL",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Prisma ORM", "PostgreSQL"],
    href: links.ecandidat,
    linkLabel: "ecandidat.ro",
    video: "/projects/videos/ecandidat.mp4",
    accent: "#2b4bff",
  },
  {
    id: "utopia",
    name: "Utopia Fried Chicken",
    kind: "Brand website",
    year: "2026",
    body: "Mobile-first menu with category filters, store locator, interactive 3D effects and scroll-driven animations",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Three.js"],
    href: links.utopia,
    linkLabel: "utopiafriedchicken.ro",
    video: "/projects/videos/utopia.mp4",
    accent: "#ff5a1f",
  },
  {
    id: "linkhaus",
    name: "LINKHAUS",
    kind: "Studio site",
    year: "2026",
    body: "Built the studio site as one continuous scroll composition with Next.js 15 (App Router), React 19, TypeScript, Three.js / React Three Fiber / Drei, GSAP ScrollTrigger and Lenis smooth scroll",
    stack: ["Next.js", "React", "TypeScript", "R3F", "GLSL", "GSAP", "Lenis"],
    href: links.linkhaus,
    linkLabel: "linkhaus.vercel.app",
    video: "/projects/videos/linkhaus.mp4",
    accent: "#8a5cff",
  },
  {
    id: "maniac-minds",
    name: "Maniac Minds",
    kind: "Streetwear brand",
    year: "2023 - 2025",
    body: "Founded and managed an independent streetwear clothing brand. Over 5000 followers on social media platforms, Over 3 Million Views organically generated, Over 25 Thousand website visitors, Over 200 Orders fulfilled.",
    stack: ["Product design", "Social media", "Marketing", "Web design"],
    href: links.maniacMinds,
    linkLabel: "Instagram",
    gallery: Array.from({ length: 11 }, (_, i) => `/projects/maniac-minds/${String(i + 1).padStart(2, "0")}.webp`),
    accent: "#0d0d0d",
  },
  {
    id: "cuib-darte",
    name: "Cuib d’Arte",
    kind: "Concept website",
    year: "2026",
    body: "Art bar: paper-and-typewriter visual identity, events feed, table reservations, bilingual RO/EN",
    stack: ["Concept", "Visual identity", "i18n"],
    video: "/projects/videos/cuib-darte.mp4",
    accent: "#c8ff4d",
  },
  {
    id: "nocturne",
    name: "Nocturne Cocktail Club",
    kind: "Concept website",
    year: "2026",
    body: "Mood-based cocktail picker, cinematic motion, 3D product shots, reservations",
    stack: ["Concept", "Motion", "3D"],
    video: "/projects/videos/nocturne.mp4",
    accent: "#3a1785",
  },
];

// Everything in the CV's Skills section, plus the university stack.
export const skillGroups = [
  {
    id: "programming",
    title: "Programming",
    blurb: "Languages and paradigms, from systems to the browser.",
    items: ["TypeScript", "JavaScript", "Python", "C", "C++", "C#", "Java", "Object-Oriented Programming (OOP)"],
  },
  {
    id: "web",
    title: "Web",
    blurb: "Front-end and creative engineering with 3D, shaders and scroll choreography.",
    items: [
      "React",
      "Next.js",
      "Node.js (Express)",
      "Vite",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "GSAP",
      "Lenis",
      "Three.js",
      "React Three Fiber",
      "WebGL / GLSL Shaders",
    ],
  },
  {
    id: "data",
    title: "Data Analysis",
    blurb: "From raw data to dashboards and decisions.",
    items: [
      "Data Literacy",
      "Business Intelligence",
      "SAS Visual Analytics (SAS Viya)",
      "Data Visualization",
      "Analytics Dashboards & KPI Tracking",
      "Data Processing",
      "SQL",
      "Oracle SQL",
    ],
  },
  {
    id: "backend",
    title: "Backend & Database",
    blurb: "APIs, auth and the data models behind them.",
    items: ["REST APIs", "JWT Authentication", "Prisma ORM", "MySQL", "PostgreSQL (Supabase)", "Database Design"],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    blurb: "What the work gets built and shipped with.",
    items: [
      "Git / GitHub",
      "Vercel",
      "Linux",
      "MATLAB & Simulink",
      "Arduino",
      "MS Office",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Claude Code",
    ],
  },
  {
    id: "other",
    title: "Other Skills",
    blurb: "Architecture, product thinking and how I work with people.",
    items: [
      "Client-Server Architecture",
      "UI/UX design principles",
      "Filtering Systems",
      "Search Algorithms",
      "Business & Marketing",
      "Communication",
      "Adaptability",
      "Team Work",
      "Problem Solving Oriented",
    ],
  },
];

// Everything earned so far is a digital badge (no formal certifications yet).
export const certifications = [
  {
    title: "Data Literacy Essentials",
    issuer: "SAS",
    type: "Badge",
    badge: "/badges/data-literacy-essentials.png",
    body: "Understanding data and its sources, interpreting statistics and visualizations, and evaluating data-driven claims.",
  },
  {
    title: "Data Literacy in Practice",
    issuer: "SAS",
    type: "Badge",
    badge: "/badges/data-literacy-in-practice.png",
    body: "Applying a structured, data-informed decision-making process to real-world business questions.",
  },
  {
    title: "SAS Visual Analytics 1 for SAS Viya: Basics",
    issuer: "SAS",
    type: "Badge",
    badge: "/badges/sas-visual-analytics.png",
    body: "Business intelligence with SAS Visual Analytics on SAS Viya: accessing and preparing data, exploring it visually, and building interactive reports and dashboards.",
  },
];

export const spoken = [
  { lang: "Romanian", level: "Native" },
  { lang: "English", level: "Fluent" },
];
