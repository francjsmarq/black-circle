"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Preloader from "./Preloader";
import { intro as t } from "@/lib/content";
import { config } from "@/lib/config";
import { DeepRumble } from "@/lib/audio";

type Props = {
  /** Chamado quando a intro termina (vídeo acabou ou foi saltado). */
  onComplete: () => void;
  /** Chamado se o vídeo não puder tocar (ficheiro em falta, erro, autoplay bloqueado, lento). */
  onFail: () => void;
};

/**
 * Intro em vídeo (ex: gerado no Kling). Toca sem som por defeito (autoplay
 * só é permitido pelos browsers sem som). O utilizador pode saltar a qualquer
 * momento por botão, clique, scroll, toque ou Esc.
 */
export default function VideoIntro({ onComplete, onFail }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);
  const startedRef = useRef(false);
  const rumble = useMemo(() => new DeepRumble(), []);

  const [buffered, setBuffered] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fading, setFading] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  const src = useMemo(() => {
    const c = config.intro;
    const small = window.innerWidth < config.performance.mobileBreakpoint;
    return small && c.videoSrcMobile ? c.videoSrcMobile : c.videoSrc;
  }, []);

  const seenBefore = useMemo(() => {
    try {
      return (
        config.intro.fullOnlyOnFirstVisit &&
        localStorage.getItem(config.intro.storageKey) === "1"
      );
    } catch {
      return false;
    }
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      localStorage.setItem(config.intro.storageKey, "1");
    } catch {
      /* armazenamento indisponível */
    }
    rumble.stop();
    setFading(true);
    window.setTimeout(onComplete, 700);
  }, [onComplete, rumble]);

  const fail = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    rumble.stop();
    onFail();
  }, [onFail, rumble]);

  // Se o vídeo não arrancar a tempo, usa a intro 3D
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!startedRef.current) fail();
    }, config.intro.videoStartTimeoutMs);
    return () => window.clearTimeout(id);
  }, [fail]);

  // Tentar tocar (autoplay sem som); se o browser bloquear, usa a intro 3D
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      if (!startedRef.current) fail();
    });
  }, [fail]);

  // Saltar com scroll / toque / teclado
  useEffect(() => {
    const skip = () => finish();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  const toggleSound = useCallback(async () => {
    const v = videoRef.current;
    if (config.intro.videoHasAudio) {
      if (!v) return;
      v.muted = !v.muted;
      setSoundOn(!v.muted);
      return;
    }
    // Sem som no vídeo: usa o rumble grave procedural
    if (rumble.running) {
      await rumble.stop();
      setSoundOn(false);
    } else {
      await rumble.start();
      rumble.setIntensity(0.6);
      setSoundOn(true);
    }
  }, [rumble]);

  return (
    <div
      className={`fixed inset-0 z-[60] bg-void transition-opacity duration-700 ease-lux ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      onClick={finish}
      role="presentation"
    >
      <Preloader progress={buffered} visible={!playing} />

      <video
        ref={videoRef}
        src={src}
        poster={config.intro.videoPoster ?? undefined}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-lux ${
          playing ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden
        onPlaying={(e) => {
          startedRef.current = true;
          setPlaying(true);
          if (seenBefore) e.currentTarget.playbackRate = config.intro.videoRepeatSpeed;
        }}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.duration && v.buffered.length) {
            setBuffered(Math.min(v.buffered.end(v.buffered.length - 1) / v.duration, 1));
          }
        }}
        onEnded={finish}
        onError={() => (startedRef.current ? finish() : fail())}
      />

      {/* Controlos funcionais (som + saltar) */}
      <div
        className={`absolute inset-x-0 bottom-0 z-[75] flex items-center justify-between px-6 pb-6 transition-opacity duration-700 sm:px-10 ${
          fading ? "opacity-0" : "opacity-100"
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            finish();
          }}
          className="font-sans text-[9px] tracking-widest2 text-gunmetal transition-colors duration-500 hover:text-silver"
        >
          {t.skip}
        </button>
      </div>
    </div>
  );
}
