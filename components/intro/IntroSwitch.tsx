"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import VideoIntro from "./VideoIntro";
import { config } from "@/lib/config";
import { prefersReducedMotion } from "@/lib/device";

// A intro 3D (Three.js) só é descarregada se for realmente precisa (fallback)
const ShaderIntro = dynamic(() => import("./IntroExperience"), { ssr: false });

type Props = { onComplete: () => void };

/**
 * Escolhe a intro: vídeo (config.intro.mode = "video") com queda automática
 * para a intro 3D se o vídeo faltar/falhar, ou com "reduzir movimento" ativo.
 */
export default function IntroSwitch({ onComplete }: Props) {
  const [useVideo, setUseVideo] = useState(
    () => config.intro.mode === "video" && !prefersReducedMotion()
  );

  if (useVideo) {
    return <VideoIntro onComplete={onComplete} onFail={() => setUseVideo(false)} />;
  }
  return <ShaderIntro onComplete={onComplete} />;
}
