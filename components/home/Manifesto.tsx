"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { manifesto } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/device";

gsap.registerPlugin(ScrollTrigger);

/** Secção sticky: as frases surgem progressivamente durante o scroll. */
export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-mline]");
    const closing = el.querySelector<HTMLElement>("[data-mclosing]");

    if (prefersReducedMotion()) {
      lines.forEach((l) => (l.style.opacity = "1"));
      if (closing) closing.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=280%",
          scrub: 0.6,
          pin: true,
        },
      });
      lines.forEach((line) => {
        tl.fromTo(
          line,
          { opacity: 0.06, y: 26, filter: "blur(4px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "none" }
        );
      });
      if (closing) {
        tl.fromTo(
          closing,
          { opacity: 0, letterSpacing: "0.9em" },
          { opacity: 1, letterSpacing: "0.5em", duration: 1.6, ease: "none" },
          "+=0.4"
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative border-t border-line/40 bg-void">
      <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl text-center">
          {manifesto.lines.map((line, i) => (
            <p
              key={i}
              data-mline
              className={`opacity-[0.06] ${
                i === 0 || i > 4
                  ? "my-8 font-serif text-2xl font-light leading-snug text-bone sm:text-3xl md:text-[2.2rem]"
                  : "my-2 font-sans text-lg tracking-widest2 text-silver sm:text-xl"
              }`}
            >
              {line}
            </p>
          ))}
          <p
            data-mclosing
            className="mt-16 font-sans text-sm tracking-vast text-champagne opacity-0 sm:text-base"
          >
            {manifesto.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
