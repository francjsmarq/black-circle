"use client";

import { useState, type FormEvent } from "react";
import { address, contact } from "@/lib/content";
import { useReveal } from "@/lib/useReveal";
import MagneticButton from "@/components/ui/MagneticButton";

const inputCls =
  "w-full border-b border-line bg-transparent py-4 font-sans text-sm font-light text-bone placeholder:text-gunmetal focus:border-silver focus:outline-none transition-colors duration-500";

export default function Contact() {
  const ref = useReveal<HTMLElement>();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Liga aqui o teu endpoint (API route, Formspree, Resend, etc.)
    // Ex.: await fetch("/api/access", { method: "POST", body: new FormData(e.currentTarget) })
    setSent(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative border-t border-line/40 px-6 py-32 sm:px-10 md:py-44"
    >
      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-12 gap-y-14 md:gap-x-10">
        <div className="col-span-12 md:col-span-4">
          <p data-reveal className="font-sans text-[10px] tracking-vast text-gunmetal opacity-0">
            {contact.eyebrow}
          </p>
          <h2
            data-reveal
            className="mt-6 font-sans text-4xl font-medium tracking-tight text-bone opacity-0 sm:text-5xl"
          >
            {contact.headline}
          </h2>
          <p data-reveal className="mt-8 max-w-sm font-serif text-lg font-light leading-relaxed text-silver opacity-0">
            {contact.sub}
          </p>
          <div data-reveal className="mt-10 opacity-0">
            <p className="font-sans text-[10px] tracking-vast text-gunmetal">{address.label}</p>
            <address className="mt-4 font-sans text-xs font-light not-italic leading-relaxed text-silver">
              {address.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          {sent ? (
            <div className="flex min-h-64 flex-col items-start justify-center border border-line/60 p-10">
              <span aria-hidden className="mb-8 block h-8 w-8 rounded-full border border-champagne" />
              <p className="font-serif text-xl font-light text-bone">{contact.success}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-8 sm:grid-cols-2" data-reveal>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[9px] tracking-widest2 text-gunmetal">
                  {contact.fields.name}
                </span>
                <input required name="name" autoComplete="name" className={inputCls} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[9px] tracking-widest2 text-gunmetal">
                  {contact.fields.company}
                </span>
                <input name="company" autoComplete="organization" className={inputCls} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[9px] tracking-widest2 text-gunmetal">
                  {contact.fields.email}
                </span>
                <input required type="email" name="email" autoComplete="email" className={inputCls} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[9px] tracking-widest2 text-gunmetal">
                  {contact.fields.area}
                </span>
                <select name="area" className={`${inputCls} appearance-none bg-void`} defaultValue="">
                  <option value="" disabled hidden />
                  {contact.areas.map((a) => (
                    <option key={a} value={a} className="bg-raised text-bone">
                      {a}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="font-sans text-[9px] tracking-widest2 text-gunmetal">
                  {contact.fields.message}
                </span>
                <textarea required name="message" rows={4} className={`${inputCls} resize-none`} />
              </label>
              <div className="sm:col-span-2">
                <MagneticButton type="submit" variant="solid" cursor="ENTER">
                  {contact.cta}
                </MagneticButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
