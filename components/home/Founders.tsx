"use client";

import { founders } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

export default function Founders() {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id="founders"
      ref={ref}
      className="relative border-t border-line/40 px-6 py-32 sm:px-10 md:py-44"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-12 gap-y-14 md:gap-x-10">
        <div className="col-span-12 md:col-span-3">
          <p data-reveal className="font-sans text-[10px] tracking-vast text-gunmetal opacity-0">
            {founders.eyebrow}
          </p>
        </div>

        <div className="col-span-12 md:col-span-8 md:col-start-5">
          <ul className="flex flex-col">
            {founders.people.map((p) => (
              <li
                key={p.name}
                data-reveal
                className="flex flex-col justify-between gap-2 border-t border-line/60 py-8 opacity-0 last:border-b sm:flex-row sm:items-baseline"
              >
                <span className="font-sans text-2xl font-medium tracking-tight text-bone sm:text-3xl">
                  {p.name}
                </span>
                <span className="font-sans text-[10px] tracking-widest2 text-gunmetal">
                  {p.role}
                </span>
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-12 font-serif text-xl font-light italic text-silver opacity-0">
            {founders.phrase}
          </p>
        </div>
      </div>
    </section>
  );
}
