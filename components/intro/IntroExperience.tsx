"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import BlackHoleCanvas, { type HoleState } from "./BlackHoleCanvas";
import Preloader from "./Preloader";
import { intro as t } from "@/lib/content";
import { config } from "@/lib/config";
import { DeepRumble } from "@/lib/audio";
import {
  isLowPerfDevice,
  isTouchDevice,
  prefersReducedMotion,
  supportsWebGL,
} from "@/lib/device";

type Props = { onComplete: () => void };

type Mode = "loading" | "webgl" | "fallback";

export default function IntroExperience({ onComplete }: Props) {
  const [mode, setMode] = useState<Mode>("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [entering, setEntering] = useState(false);

  const stateRef = useRef<HoleState>({ progress: 0, mouse: { x: 0, y: 0 } });
  const tlRef = useRef<gsap.core.Tween | null>(null);
  const doneRef = useRef(false);
  const rumble = useMemo(() => new DeepRumble(), []);
  const quality = useMemo(
    () => (typeof window !== "undefined" && isLowPerfDevice() ? 0 : 1),
    []
  );

  const duration = useMemo(() => {
    if (typeof window === "undefined") return config.intro.fullDuration;
    const seen =
      config.intro.fullOnlyOnFirstVisit &&
      localStorage.getItem(config.intro.storageKey) === "1";
    return seen ? config.intro.shortDuration : config.intro.fullDuration;
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      localStorage.setItem(config.intro.storageKey, "1");
    } catch {
      /* privado / indisponível */
    }
    rumble.stop();
    onComplete();
  }, [onComplete, rumble]);

  // Deteção de capacidades + "carregamento" (fontes + warm-up do shader)
  useEffect(() => {
    let cancelled = false;
    if (!supportsWebGL() || prefersReducedMotion()) {
      setMode("fallback");
      return;
    }
    const start = performance.now();
    const tick = () => {
      if (cancelled) return;
      const p = Math.min((performance.now() - start) / 900, 1);
      setLoadProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else setMode("webgl");
    };
    const ready =
      "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();
    ready.then(() => requestAnimationFrame(tick));
    return () => {
      cancelled = true;
    };
  }, []);

  // Timeline principal
  useEffect(() => {
    if (mode !== "webgl") return;
    const obj = { p: 0 };
    const tween = gsap.to(obj, {
      p: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        stateRef.current.progress = obj.p;
        rumble.setIntensity(Math.max(0, (obj.p - 0.3) / 0.6));
        if (obj.p > 0.9) setEntering(true);
      },
      onComplete: finish,
    });
    tlRef.current = tween;
    return () => {
      tween.kill();
    };
  }, [mode, duration, finish, rumble]);

  // Acelerar até ao fim com clique / scroll / toque
  const accelerate = useCallback(() => {
    const tween = tlRef.current;
    if (!tween || doneRef.current) return;
    const cur = stateRef.current.progress;
    if (cur >= 0.999) return;
    tween.kill();
    const obj = { p: cur };
    tlRef.current = gsap.to(obj, {
      p: 1,
      duration: Math.max(1.4 * (1 - cur), 0.6),
      ease: "power2.in",
      onUpdate: () => {
        stateRef.current.progress = obj.p;
        rumble.setIntensity(1);
        if (obj.p > 0.9) setEntering(true);
      },
      onComplete: finish,
    });
  }, [finish, rumble]);

  const skip = useCallback(() => {
    tlRef.current?.kill();
    finish();
  }, [finish]);

  useEffect(() => {
    if (mode !== "webgl") return;
    const onWheel = () => accelerate();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
      if (e.key === "Enter" || e.key === " ") accelerate();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, accelerate, skip]);

  // Parallax do cursor / toque
  useEffect(() => {
    if (mode !== "webgl") return;
    const onMove = (e: PointerEvent) => {
      stateRef.current.mouse = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  const toggleSound = useCallback(async () => {
    if (rumble.running) {
      await rumble.stop();
      setSoundOn(false);
    } else {
      await rumble.start();
      setSoundOn(true);
    }
  }, [rumble]);

  // ---------- Fallback 2D elegante (sem WebGL / reduced motion) ----------
  if (mode === "fallback") {
    return (
      <div
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-void"
        onClick={finish}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === "Escape") && finish()}
        aria-label="Enter site"
      >
        <div className="bc-fallback-ring flex items-center justify-center" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-16 w-16" />
        </div>
        <p className="mt-10 font-sans text-sm tracking-vast text-bone">{t.wordmark}</p>
        <p className="mt-3 font-sans text-[10px] tracking-widest2 text-gunmetal">
          {t.phrase}
        </p>
        <button
          onClick={finish}
          className="mt-12 border border-line px-6 py-3 font-sans text-[10px] tracking-widest2 text-silver transition-colors duration-500 hover:border-silver hover:text-bone"
        >
          ENTER
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-void"
      onClick={accelerate}
      role="presentation"
    >
      <Preloader progress={loadProgress} visible={mode === "loading"} />

      {mode === "webgl" && (
        <>
          <div className="absolute inset-0">
            <BlackHoleCanvas
              stateRef={stateRef}
              quality={quality}
              onError={skip}
            />
          </div>

          {/* Controlos */}
          <div
            className={`absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-6 transition-opacity duration-700 sm:px-10 ${
              entering ? "opacity-0" : "opacity-100"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSound();
              }}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
              className="flex items-center gap-3 font-sans text-[9px] tracking-widest2 text-gunmetal transition-colors duration-500 hover:text-silver"
            >
              <span
                className={`block h-[5px] w-[5px] rounded-full transition-colors duration-500 ${
                  soundOn ? "bg-bone" : "bg-line"
                }`}
              />
              {soundOn ? t.sound.on : t.sound.off}
            </button>

            {!isTouchDevice() && (
              <p className="hidden font-sans text-[9px] tracking-widest2 text-line sm:block">
                {t.enterHint}
              </p>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                skip();
              }}
              className="font-sans text-[9px] tracking-widest2 text-gunmetal transition-colors duration-500 hover:text-silver"
            >
              {t.skip}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
