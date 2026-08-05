"use client";

import { theCircle } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

export default function TheCircle() {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id="the-circle"
      ref={ref}
      className="relative border-t border-line/40 px-6 py-32 sm:px-10 md:py-44"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-12 gap-y-12 md:gap-x-10">
        <div className="col-span-12 md:col-span-3">
          <p data-reveal className="font-sans text-[10px] tracking-vast text-gunmetal opacity-0">
            {theCircle.eyebrow}
          </p>
          <span aria-hidden data-reveal className="mt-6 block h-px w-16 bg-line opacity-0" />
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-5">
          {theCircle.lines.map((line) => (
            <p
              key={line}
              data-reveal
              className="mb-10 font-serif text-2xl font-light leading-snug text-bone opacity-0 sm:text-3xl md:text-[2.4rem] md:leading-[1.3]"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
