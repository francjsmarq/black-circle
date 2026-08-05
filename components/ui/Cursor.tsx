"use client";

import { useEffect, useRef, useState } from "react";
import { isTouchDevice, prefersReducedMotion } from "@/lib/device";

/**
 * Cursor personalizado (apenas desktop).
 * Elementos com data-cursor="VIEW" | "ENTER" | "OPEN" mostram o rótulo.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    setEnabled(true);
    document.documentElement.classList.add("bc-no-cursor");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, [role='button'], input, select, textarea, label"
      );
      setActive(!!target);
      setLabel(target?.dataset.cursor ?? "");
    };

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current)
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%,-50%)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("bc-no-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] h-[5px] w-[5px] rounded-full bg-bone/90 mix-blend-difference"
      />
      <div
        ref={ring}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[89] flex items-center justify-center rounded-full border border-bone/40 transition-[width,height,background-color] duration-300 ease-lux ${
          active ? "h-16 w-16 bg-bone/5 backdrop-blur-[1px]" : "h-8 w-8"
        }`}
      >
        {label && (
          <span className="font-sans text-[8px] tracking-widest2 text-bone/80">{label}</span>
        )}
      </div>
    </>
  );
}
