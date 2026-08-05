"use client";

type Props = { progress: number; visible: boolean };

/** Círculo fino que se completa — sem barras genéricas. */
export default function Preloader({ progress, visible }: Props) {
  const r = 27;
  const c = 2 * Math.PI * r;
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-void transition-opacity duration-700 ease-lux ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="Loading">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#1c1c1f" strokeWidth="1" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#e8e6e1"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <circle cx="32" cy="32" r="3.5" fill="#000" stroke="#e8e6e1" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
