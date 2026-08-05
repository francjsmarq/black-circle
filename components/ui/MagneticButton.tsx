"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { isTouchDevice } from "@/lib/device";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  className?: string;
  cursor?: string;
  type?: "button" | "submit";
};

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "ghost",
  className = "",
  cursor = "ENTER",
  type = "button",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: MouseEvent) => {
    if (isTouchDevice() || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.22;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const base =
    "inline-block px-8 py-4 font-sans text-[10px] tracking-widest2 transition-colors duration-500 ease-lux will-change-transform " +
    (variant === "solid"
      ? "bg-bone text-void hover:bg-white"
      : "border border-line text-silver hover:border-silver hover:text-bone");

  const style = { transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.5s, border-color 0.5s, background-color 0.5s" };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        data-cursor={cursor}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`${base} ${className}`}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      data-cursor={cursor}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}
