import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Dekorativní pozadí: jemná mřížka + modrá záře nahoře */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.05) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, #000 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, #000 40%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[32rem]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in oklab, var(--primary) 12%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-10 pb-20 sm:pt-14 sm:pb-28">
        {/* Značka */}
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          <span className="text-[0.9375rem] font-semibold tracking-tight">
            CashFlow Guard
          </span>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center text-center sm:mt-20">
          {/* Pre-headline */}
          <p className="inline-flex items-center rounded-full border border-border bg-white/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm sm:text-[0.8125rem]">
            Pro majitele B2B firem, agentur a řemeslníky.
          </p>

          {/* H1 */}
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Přestaňte svým klientům dotovat byznys. Vymáháme nezaplacené faktury{" "}
            <span className="text-primary">na autopilota</span>.
          </h1>

          {/* H2 */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:mt-8 sm:text-lg">
            Váš účetní systém pošle e-mail, který dlužník smaže. Náš systém
            pošle asertivní SMS jednateli, zapojí třetí stranu a vygeneruje
            předžalobní výzvu do Datovky. Vaše peníze na účtu dřív, než řeknete
            „splatnost“.
          </p>

          {/* CTA */}
          <div className="mt-9 w-full sm:mt-10 sm:w-auto">
            <Button
              asChild
              className="animate-cta-pulse h-auto w-full rounded-xl px-4 py-4 text-[0.8125rem] font-semibold tracking-tight shadow-lg shadow-primary/25 transition-transform hover:bg-blue-700 hover:-translate-y-0.5 sm:w-auto sm:px-9 sm:text-base"
            >
              <a href="#formular">
                [ ZÍSKAT PŘÍSTUP + 3 MĚSÍCE ZDARMA ]
                <ArrowRight
                  className="hidden size-[1.125rem] sm:block"
                  aria-hidden="true"
                />
              </a>
            </Button>
          </div>

          {/* Microcopy */}
          <p className="mt-5 flex items-center justify-center gap-1.5 text-[0.8125rem] text-muted-foreground sm:text-sm">
            <Zap className="size-4 text-orange-500" aria-hidden="true" />
            Nastavení za 3 minuty. Žádná platební karta.
          </p>
        </div>
      </div>
    </section>
  );
}
