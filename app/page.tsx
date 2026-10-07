"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Nav from "@/components/home/Nav";
import Hero from "@/components/home/Hero";
import TheCircle from "@/components/home/TheCircle";
import OurWorld from "@/components/home/OurWorld";
import Philosophy from "@/components/home/Philosophy";
import Founders from "@/components/home/Founders";
import Manifesto from "@/components/home/Manifesto";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";

// Intro carregada apenas no cliente (WebGL) — lazy, fora do bundle inicial
const IntroSwitch = dynamic(() => import("@/components/intro/IntroSwitch"), {
  ssr: false,
});

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => setMounted(true), []);

  const onIntroComplete = useCallback(() => {
    setEntered(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <SmoothScroll>
      {mounted && !entered && <IntroSwitch onComplete={onIntroComplete} />}

      {/* Homepage: emerge da escuridão em contínuo com a travessia do portal */}
      <div
        className={`transition-opacity duration-[1600ms] ease-lux ${
          entered ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden={!entered}
      >
        <Nav />
        <main id="main">
          <Hero entered={entered} />
          <TheCircle />
          <OurWorld />
          <Philosophy />
          <Founders />
          <Manifesto />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
