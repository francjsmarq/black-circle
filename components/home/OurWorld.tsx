"use client";

import { useState } from "react";
import { ourWorld } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";

/**
 * Each area is a "door": hover reveals texture, description and moves the circle.
 * No stock images — procedural CSS textures per area. The hover fill is full-bleed
 * (edge to edge of the viewport) so it never reads as a box hugging the text.
 */
export default function OurWorld() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="our-world" ref={ref} className="relative border-t border-line/40 py-32 md:py-44">
      <div className="mx-auto w-full max-w-[1560px] px-6 sm:px-10">
        <div className="mb-16 flex items-end justify-between md:mb-24">
          <p data-reveal className="font-sans text-[10px] tracking-vast text-gunmetal opacity-0">
            {ourWorld.eyebrow}
          </p>
          <p data-reveal className="hidden font-sans text-[10px] tracking-widest2 text-line opacity-0 sm:block">
            {String(ourWorld.sectors.length).padStart(2, "0")} INDUSTRIES · ONE STANDARD
          </p>
        </div>
      </div>

      <ul className="flex flex-col">
        {ourWorld.sectors.map((s, i) => {
          const isActive = active === s.id;
          return (
            <li key={s.id} data-reveal className="opacity-0">
              <a
                href="#contact"
                data-cursor="OPEN"
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.id)}
                onBlur={() => setActive(null)}
                className={`bc-door group relative block overflow-hidden border-t border-line/60 transition-colors duration-700 ease-lux ${
                  isActive ? "bg-raised" : "bg-transparent"
                } ${i === ourWorld.sectors.length - 1 ? "border-b" : ""}`}
              >
                {/* procedural texture revealed on hover — stays full-bleed */}
                <span aria-hidden className={`bc-door-texture bc-tex-${s.id}`} />

                <div className="relative mx-auto grid max-w-[1560px] grid-cols-12 items-center gap-x-4 px-8 py-10 sm:px-14 md:py-12">
                  {/* circle that shifts on hover — anchored to the content width, not the viewport edge */}
                  <span
                    aria-hidden
                    className={`bc-door-circle ${isActive ? "bc-door-circle-active" : ""}`}
                  />

                  <span className="col-span-12 mb-2 font-sans text-[9px] tracking-widest2 text-gunmetal sm:col-span-1 sm:mb-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={`col-span-12 font-sans text-4xl font-medium tracking-tight transition-all duration-700 ease-lux sm:col-span-5 md:text-6xl ${
                      isActive ? "translate-x-3 text-bone" : "text-silver"
                    }`}
                  >
                    {s.name}
                  </span>

                  <span
                    className={`relative z-10 col-span-12 mt-3 max-w-sm font-sans text-xs font-light leading-relaxed transition-all duration-700 ease-lux sm:col-span-4 sm:mt-0 ${
                      isActive ? "text-silver opacity-100" : "text-gunmetal opacity-70"
                    }`}
                  >
                    {s.description}
                  </span>

                  <span className="relative z-10 col-span-12 mt-3 sm:col-span-2 sm:mt-0 sm:text-right">
                    {s.brand ? (
                      <span
                        className={`font-sans text-[10px] tracking-widest2 transition-colors duration-700 ${
                          isActive ? "text-champagne" : "text-gunmetal"
                        }`}
                      >
                        {s.brand}
                      </span>
                    ) : (
                      <span
                        className={`inline-block border px-3 py-2 font-sans text-[9px] tracking-widest2 transition-colors duration-700 ${
                          isActive ? "border-champagne/60 text-champagne" : "border-line text-gunmetal"
                        }`}
                      >
                        {s.status}
                      </span>
                    )}
                  </span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
