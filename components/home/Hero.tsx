"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hero, site } from "@/lib/content";
import MagneticButton from "@/components/ui/MagneticButton";
import { prefersReducedMotion } from "@/lib/device";

export default function Hero({ entered }: { entered: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!entered || !ref.current) return;
    const lines = ref.current.querySelectorAll("[data-hero-line]");
    const rest = ref.current.querySelectorAll("[data-hero-rest]");
    if (prefersReducedMotion()) {
      gsap.set([lines, rest], { opacity: 1, y: 0, yPercent: 0 });
      return;
    }
    const tl = gsap.timeline();
    tl.fromTo(
      lines,
      { yPercent: 110 },
      { yPercent: 0, duration: 1.5, ease: "power4.out", stagger: 0.14 }
    ).fromTo(
      rest,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.1 },
      "-=0.8"
    );
    return () => {
      tl.kill();
    };
  }, [entered]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 sm:px-10"
    >
      {/* presença viva do círculo — versão calma, CSS puro */}
      <div aria-hidden className="bc-ambient-circle" />

      <div className="relative mx-auto w-full max-w-[1560px]">
        <p
          data-hero-rest
          className="mb-8 font-sans text-[10px] tracking-vast text-gunmetal opacity-0"
        >
          {site.name}
        </p>

        <h1 className="font-sans text-[13vw] font-medium leading-[0.94] tracking-tight text-bone sm:text-[9.5vw] lg:text-[8vw]">
          {hero.headline.map((line) => (
            <span key={line} className="block overflow-hidden">
              <span data-hero-line className="block will-change-transform">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-rest
            className="max-w-md font-sans text-sm font-light leading-relaxed text-silver opacity-0"
          >
            {hero.sub}
          </p>
          <div data-hero-rest className="flex flex-wrap gap-4 opacity-0">
            <MagneticButton href={hero.primary.href} variant="solid" cursor="ENTER">
              {hero.primary.label}
            </MagneticButton>
            <MagneticButton href={hero.secondary.href} cursor="VIEW">
              {hero.secondary.label}
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 h-12 w-px -translate-x-1/2 overflow-hidden"
      >
        <span className="bc-scroll-line block h-full w-full bg-gradient-to-b from-transparent via-silver to-transparent" />
      </div>
    </section>
  );
}
