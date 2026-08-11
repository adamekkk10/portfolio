import { Gavel, Mail, MessageSquareWarning, type LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  day: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: Mail,
    day: "Den 3",
    title: "Přátelské pošťouchnutí",
    description: "E-mail s QR kódem pro okamžitou platbu.",
  },
  {
    icon: MessageSquareWarning,
    day: "Den 7",
    title: "Eskalace na jednatele",
    description: "Asertivní SMS přímo jednateli firmy.",
  },
  {
    icon: Gavel,
    day: "Den 14",
    title: "Třetí strana a Datovka",
    description: "Předžalobní výzva do Datovky z naší domény.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mx-auto max-w-3xl text-center text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
          Jak vracíme peníze na účet{" "}
          <span className="text-muted-foreground">
            (aniž byste hnuli prstem)
          </span>
        </h2>

        <ol className="mt-14 grid gap-10 sm:mt-20 md:grid-cols-3 md:gap-8">
          {steps.map(({ icon: Icon, day, title, description }, index) => (
            <li
              key={day}
              className="relative flex gap-5 md:flex-col md:items-center md:gap-0 md:text-center"
            >
              {/* Spojnice mezi kroky: svisle na mobilu, vodorovně na desktopu */}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-14 left-7 h-[calc(100%+1.25rem)] w-px bg-border md:top-7 md:left-1/2 md:h-px md:w-[calc(100%+2rem)]"
                />
              )}

              <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
                <Icon className="size-6" aria-hidden="true" />
                <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-semibold text-primary-foreground shadow-sm">
                  {index + 1}
                </span>
              </div>

              <div className="pb-2 md:pb-0">
                <p className="mt-1 text-xs font-semibold tracking-[0.08em] text-primary uppercase md:mt-6">
                  {day}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-muted-foreground text-pretty">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
