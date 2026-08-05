import { footer, site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-line/40 px-6 pb-10 pt-20 sm:px-10">
      <div className="mx-auto w-full max-w-[1560px]">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-start">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-mark.png" alt="" aria-hidden className="h-6 w-6" />
            <span className="font-sans text-xs tracking-vast text-bone">{site.name}</span>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-4 sm:grid-cols-3">
            {footer.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...("external" in l && l.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="font-sans text-[10px] tracking-widest2 text-silver transition-colors duration-500 hover:text-bone"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-line/40 pt-8 md:flex-row">
          <p className="font-sans text-[9px] tracking-widest2 text-gunmetal">{footer.tagline}</p>
          <p className="font-sans text-[9px] tracking-widest2 text-gunmetal">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
