import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const benefits = [
  {
    title: "Napojení na Fakturoid",
    description: "Faktury se natáhnou samy, nic nepřepisujete.",
  },
  {
    title: "E-maily & SMS",
    description: "Automatická eskalace podle dní po splatnosti.",
  },
  {
    title: "Předžalobní výzvy",
    description: "Vygenerované a odeslané do datové schránky.",
  },
  {
    title: "Osobní onboarding",
    description: "Nastavíme vám to společně na vašich fakturách.",
  },
];

export function OfferSection() {
  return (
    <section className="border-t border-border bg-slate-50/60 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
            Otevíráme zavřené dveře.{" "}
            <span className="text-primary sm:block">
              Ale jen pro prvních 10 vizionářů.
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Hledáme 10 firem, se kterými nástroj vyladíme na reálných datech.
            Vaše faktury, vaši dlužníci, vaše připomínky — podle nich stavíme
            produkt dál.
          </p>
        </div>

        <Card className="mt-12 gap-0 p-0 shadow-md ring-foreground/10 sm:mt-14">
          {/* Modrý akcentní pruh na horní hraně karty */}
          <div aria-hidden="true" className="h-1.5 w-full bg-primary" />

          <div className="grid gap-10 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:gap-12">
            {/* Výhody */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Uzavřená Beta
              </span>

              <ul className="mt-7 space-y-5">
                {benefits.map(({ title, description }) => (
                  <li key={title} className="flex gap-3.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-semibold tracking-tight">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground text-pretty">
                        {description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cena */}
            <div className="flex flex-col justify-center rounded-xl bg-slate-50 p-7 text-center ring-1 ring-border md:w-72">
              <p className="text-sm text-muted-foreground">Běžná cena</p>
              <p className="mt-1 text-xl font-medium text-muted-foreground line-through decoration-destructive/70 decoration-2">
                4 500 Kč/měsíc
              </p>

              <div className="my-6 h-px w-full bg-border" />

              <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                Pro beta partnery
              </p>
              <p className="mt-2 text-5xl font-semibold tracking-[-0.03em] text-primary">
                0 Kč
              </p>
              <p className="mt-2 font-medium">po dobu 3 měsíců</p>

              <Button
                asChild
                className="mt-7 h-auto w-full rounded-xl px-4 py-3.5 text-sm font-semibold shadow-md shadow-primary/20 transition-transform hover:bg-blue-700 hover:-translate-y-0.5"
              >
                <a href="#formular">
                  Chci jedno z míst
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Bez platební karty a bez závazku.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
