"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-lux ${
        scrolled
          ? "border-b border-line/60 bg-void/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1560px] items-center justify-between px-6 py-5 sm:px-10"
      >
        <a
          href="#top"
          data-cursor="ENTER"
          className="flex items-center gap-3 font-sans text-xs tracking-vast text-bone"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" aria-hidden className="h-6 w-6" />
          {site.name}
        </a>

        <div className="hidden items-center gap-10 lg:flex">
          {nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-sans text-[10px] tracking-widest2 text-silver transition-colors duration-500 hover:text-bone"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            data-cursor="ENTER"
            className="border border-line px-5 py-3 font-sans text-[10px] tracking-widest2 text-bone transition-colors duration-500 hover:border-bone"
          >
            {nav.cta}
          </a>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-[7px] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
            className={`block h-px w-6 bg-bone transition-transform duration-500 ease-lux ${
              open ? "translate-y-[4px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-bone transition-transform duration-500 ease-lux ${
              open ? "-translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Menu mobile fullscreen */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-void px-6 pb-10 pt-28 transition-all duration-700 ease-lux lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2">
          {nav.links.map((l, i) => (
            <li
              key={l.href}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              className={`transition-all duration-700 ease-lux ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-3xl font-light text-bone"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="border border-line py-4 text-center font-sans text-[11px] tracking-widest2 text-bone"
        >
          {nav.cta}
        </a>
      </div>
    </header>
  );
}
