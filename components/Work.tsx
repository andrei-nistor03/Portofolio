import { projects } from "@/lib/content";
import WorkList from "./WorkList";

export default function Work() {
  return (
    <section id="work" className="relative px-4 pb-28 pt-32 md:px-8 md:pb-40 md:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <h2 className="display text-[clamp(4.5rem,13vw,14rem)]">
          Selected <span className="text-violet">work</span>
        </h2>
        <WorkList items={projects} />
      </div>
    </section>
  );
}
