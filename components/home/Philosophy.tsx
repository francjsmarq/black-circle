"use client";

import { philosophy } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

export default function Philosophy() {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative border-t border-line/40 px-6 py-32 sm:px-10 md:py-48"
    >
      <div className="mx-auto w-full max-w-[1560px]">
        <h2 className="font-sans text-4xl font-medium leading-[1.05] tracking-tight text-bone sm:text-6xl md:text-7xl">
          {philosophy.statement.map((line) => (
            <span key={line} data-reveal className="block opacity-0">
              {line}
            </span>
          ))}
        </h2>

        <p
          data-reveal
          className="mt-10 max-w-2xl font-serif text-xl font-light italic leading-snug text-silver opacity-0 sm:text-2xl md:mt-14 md:max-w-3xl"
        >
          {philosophy.intro}
        </p>

        <ul className="mt-24 flex flex-col md:mt-32">
          {philosophy.principles.map((p, i) => (
            <li
              key={p.name}
              data-reveal
              className={`group grid grid-cols-12 items-baseline gap-x-6 gap-y-4 border-t border-line/50 py-10 opacity-0 transition-colors duration-700 ease-lux hover:border-line md:py-14 ${
                i === philosophy.principles.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="col-span-4 font-serif text-2xl font-light text-line transition-colors duration-700 ease-lux group-hover:text-champagne sm:col-span-2 sm:text-3xl md:text-4xl">
                {p.numeral}
              </span>
              <span className="col-span-8 font-sans text-sm tracking-vast text-bone sm:col-span-3 sm:text-base">
                {p.name}
              </span>
              <p className="col-span-12 font-serif text-lg font-light leading-relaxed text-silver sm:col-span-7 md:text-xl">
                {p.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
