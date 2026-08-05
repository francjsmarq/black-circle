"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/device";

gsap.registerPlugin(ScrollTrigger);

/**
 * Revela filhos marcados com [data-reveal] quando a secção entra no viewport.
 * Suporta máscara/clip via classe .bc-reveal-line.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      targets.forEach((t) => {
        t.style.opacity = "1";
        t.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 76%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return ref;
}
