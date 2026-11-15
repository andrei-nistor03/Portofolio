import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Loader from "@/components/loader/Loader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Timeline from "@/components/Timeline";
import Studio from "@/components/Studio";
import Work from "@/components/Work";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Page() {
  return (
    <SmoothScroll>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Studio />
        <Work />
        <Skills />
      </main>
      <Contact />
    </SmoothScroll>
  );
}
